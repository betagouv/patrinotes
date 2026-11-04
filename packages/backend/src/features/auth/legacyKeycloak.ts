/**
 * TEMPORARY — migration of the sessions opened while Keycloak issued the tokens.
 *
 * Agents may be offline with unsynced work when the new authentication ships: instead of logging
 * them out, the Keycloak refresh token their app still holds is exchanged, once, for a new session.
 * Enabled only while VITE_AUTH_URL / VITE_AUTH_REALM / VITE_AUTH_CLIENT_ID / AUTH_CLIENT_SECRET are set.
 *
 * Delete this file (and its two call sites in authService) once every agent has migrated: count the
 * auth_session rows whose provider is "keycloak" against the active users.
 */
import { createRemoteJWKSet, decodeJwt, jwtVerify, SignJWT } from "jose";
import { FetchError, ofetch } from "ofetch";
import { ENV } from "../../envVars";
import { makeDebug } from "../debug";
import { AppError } from "../errors";

const debug = makeDebug("auth:legacy-keycloak");

export const isLegacyKeycloakEnabled = () =>
  !!ENV.VITE_AUTH_URL && !!ENV.VITE_AUTH_REALM && !!ENV.VITE_AUTH_CLIENT_ID && !!ENV.AUTH_CLIENT_SECRET;

const realmUrl = () => `${ENV.VITE_AUTH_URL}/realms/${ENV.VITE_AUTH_REALM}`;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
const getJwks = () => (jwks ??= createRemoteJWKSet(new URL(`${realmUrl()}/protocol/openid-connect/certs`)));

/** Email of a still-valid Keycloak access token, or null. */
export const verifyLegacyAccessToken = async (token: string) => {
  if (!isLegacyKeycloakEnabled()) return null;
  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      algorithms: ["RS256"],
      issuer: realmUrl(),
      audience: "account",
    });
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
};

const clientAssertion = () =>
  new SignJWT({ jti: crypto.randomUUID() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ENV.VITE_AUTH_CLIENT_ID!)
    .setSubject(ENV.VITE_AUTH_CLIENT_ID!)
    .setAudience(realmUrl())
    .setExpirationTime("30s")
    .sign(new TextEncoder().encode(ENV.AUTH_CLIENT_SECRET!));

/** Email of the agent a Keycloak refresh token belongs to, or null if Keycloak refuses it. */
export const redeemLegacyRefreshToken = async (refreshToken: string) => {
  if (!isLegacyKeycloakEnabled()) return null;
  try {
    const tokens = await ofetch<{ access_token: string }>(`${realmUrl()}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: ENV.VITE_AUTH_CLIENT_ID!,
        refresh_token: refreshToken,
        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: await clientAssertion(),
      }).toString(),
    });
    // issued by Keycloak in answer to our own authenticated request over TLS: no need to verify it again
    const { email } = decodeJwt(tokens.access_token);
    return typeof email === "string" ? email : null;
  } catch (error) {
    // only a real refusal (expired / revoked offline session) ends the session; Keycloak being down or
    // slow must not log everyone out: 503, the client keeps its tokens and retries later
    if (error instanceof FetchError && (error.status === 400 || error.status === 401)) {
      debug("keycloak refused the refresh token", error.data?.error, error.data?.error_description);
      return null;
    }
    debug("keycloak unreachable", error instanceof FetchError ? error.status : error);
    throw new AppError(503, "Le service de connexion est momentanément indisponible, veuillez réessayer");
  }
};
