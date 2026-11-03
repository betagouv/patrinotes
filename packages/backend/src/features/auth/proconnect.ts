/**
 * ProConnect (OIDC authorization code flow), following
 * https://github.com/numerique-gouv/proconnect-documentation/blob/main/doc_fs/implementation_technique.md
 *
 * ProConnect rejects any authorize parameter it does not know (no PKCE), returns a *signed JWT* from
 * userinfo, and its own session lasts 12 h: it only proves who the agent is at sign-in, the long-lived
 * (offline) session is ours (see sessions.ts).
 */
import { createRemoteJWKSet, jwtVerify, type JWTPayload, type JWTVerifyGetKey } from "jose";
import { ofetch } from "ofetch";
import { db } from "../../db/db";
import { ENV } from "../../envVars";
import { AppError } from "../errors";
import { makeDebug } from "../debug";
import { randomSecret } from "./sessions";

const debug = makeDebug("auth:proconnect");

const STATE_TTL_MS = 10 * 60 * 1000;

export const isProConnectEnabled = () => !!ENV.PROCONNECT_CLIENT_ID && !!ENV.PROCONNECT_CLIENT_SECRET;

const frontendUrl = () => ENV.FRONTEND_URL.replace(/\/+$/, "");
/** Must be declared, exactly, to ProConnect (connexion + déconnexion). */
export const proConnectRedirectUri = () => `${frontendUrl()}/auth-callback`;
export const proConnectPostLogoutRedirectUri = () => `${frontendUrl()}/connexion`;

type Discovery = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
};

let discoveryPromise: Promise<{ discovery: Discovery; jwks: ReturnType<typeof createRemoteJWKSet> }> | null = null;

const getProvider = () => {
  if (!isProConnectEnabled()) throw new AppError(404, "La connexion ProConnect n'est pas configurée");
  if (!discoveryPromise) {
    // a bare domain (as in the ProConnect documentation), or a full URL (local mock provider)
    const base = /^https?:\/\//.test(ENV.PROCONNECT_DOMAIN)
      ? ENV.PROCONNECT_DOMAIN.replace(/\/+$/, "")
      : `https://${ENV.PROCONNECT_DOMAIN}`;
    discoveryPromise = ofetch<Discovery>(`${base}/api/v2/.well-known/openid-configuration`)
      .then((discovery) => ({ discovery, jwks: createRemoteJWKSet(new URL(discovery.jwks_uri)) }))
      .catch((error) => {
        discoveryPromise = null;
        throw error;
      });
  }
  return discoveryPromise;
};

/** id_token and userinfo are signed with the algorithm chosen at registration: RS256, ES256 or HS256. */
const getKey = (jwks: ReturnType<typeof createRemoteJWKSet>): JWTVerifyGetKey => {
  return async (header, token) => {
    if (header.alg === "HS256") return new TextEncoder().encode(ENV.PROCONNECT_CLIENT_SECRET!);
    return jwks(header, token);
  };
};

const verifyProConnectJwt = async (jwt: string, { retried = false } = {}): Promise<JWTPayload> => {
  const { discovery, jwks } = await getProvider();
  try {
    const { payload } = await jwtVerify(jwt, getKey(jwks), {
      issuer: discovery.issuer,
      audience: ENV.PROCONNECT_CLIENT_ID!,
      algorithms: ["RS256", "ES256", "HS256"],
    });
    return payload;
  } catch (error: any) {
    // keys rotated at ProConnect: reload the discovery document and the JWKS once
    if (!retried && ["ERR_JWS_SIGNATURE_VERIFICATION_FAILED", "ERR_JWKS_NO_MATCHING_KEY"].includes(error?.code)) {
      discoveryPromise = null;
      return verifyProConnectJwt(jwt, { retried: true });
    }
    debug("invalid ProConnect JWT", error?.code, error?.message);
    throw new AppError(401, "La connexion avec ProConnect a échoué, veuillez réessayer");
  }
};

/** Step 1: the URL the browser is sent to. `state` must also be kept by the browser and checked on return. */
export const getProConnectAuthorizationUrl = async () => {
  const { discovery } = await getProvider();

  const state = randomSecret();
  const nonce = randomSecret();

  await db
    .deleteFrom("oidc_login_state")
    .where("created_at", "<", new Date(Date.now() - STATE_TTL_MS).toISOString())
    .execute();
  await db.insertInto("oidc_login_state").values({ state, nonce }).execute();

  const url = new URL(discovery.authorization_endpoint);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: ENV.PROCONNECT_CLIENT_ID!,
    redirect_uri: proConnectRedirectUri(),
    scope: ENV.PROCONNECT_SCOPES,
    state,
    nonce,
  }).toString();

  return { url: url.toString(), state };
};

export type ProConnectIdentity = {
  sub: string;
  email: string;
  givenName: string | null;
  usualName: string | null;
  siret: string | null;
  idToken: string;
};

/** Step 2: back on /auth-callback, the frontend hands us `code` and `state`. */
export const handleProConnectCallback = async ({ code, state }: { code: string; state: string }) => {
  const { discovery } = await getProvider();

  // single use
  const pending = await db.deleteFrom("oidc_login_state").where("state", "=", state).returningAll().executeTakeFirst();
  if (!pending || Date.now() - new Date(pending.created_at).getTime() > STATE_TTL_MS) {
    throw new AppError(400, "La demande de connexion a expiré, veuillez réessayer");
  }

  let tokens: { access_token: string; id_token: string };
  try {
    tokens = await ofetch(discovery.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: ENV.PROCONNECT_CLIENT_ID!,
        client_secret: ENV.PROCONNECT_CLIENT_SECRET!,
        redirect_uri: proConnectRedirectUri(),
        code,
      }).toString(),
    });
  } catch (error: any) {
    debug("token endpoint error", error?.data);
    throw new AppError(401, "La connexion avec ProConnect a échoué, veuillez réessayer");
  }

  const idToken = await verifyProConnectJwt(tokens.id_token);
  if (idToken.nonce !== pending.nonce) throw new AppError(401, "La connexion avec ProConnect a échoué (nonce)");

  const userinfoResponse = await ofetch.raw(discovery.userinfo_endpoint, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    responseType: "text",
  });
  const contentType = userinfoResponse.headers.get("content-type") ?? "";
  const userinfo: JWTPayload & Record<string, unknown> = contentType.includes("application/jwt")
    ? await verifyProConnectJwt(userinfoResponse._data as string)
    : JSON.parse(userinfoResponse._data as string);

  if (!userinfo.sub || userinfo.sub !== idToken.sub) throw new AppError(401, "La connexion avec ProConnect a échoué (sub)");
  if (typeof userinfo.email !== "string" || !userinfo.email) {
    throw new AppError(401, "ProConnect n'a pas transmis votre courriel");
  }

  return {
    sub: userinfo.sub,
    email: userinfo.email.trim().toLowerCase(),
    givenName: typeof userinfo.given_name === "string" ? userinfo.given_name : null,
    usualName: typeof userinfo.usual_name === "string" ? userinfo.usual_name : null,
    siret: typeof userinfo.siret === "string" ? userinfo.siret : null,
    idToken: tokens.id_token,
  } satisfies ProConnectIdentity;
};

/** Must be opened by the browser itself (it clears ProConnect and identity-provider cookies). */
export const getProConnectLogoutUrl = async (idToken: string) => {
  const { discovery } = await getProvider();
  const url = new URL(discovery.end_session_endpoint);
  url.search = new URLSearchParams({
    id_token_hint: idToken,
    state: randomSecret(),
    post_logout_redirect_uri: proConnectPostLogoutRedirectUri(),
  }).toString();
  return url.toString();
};
