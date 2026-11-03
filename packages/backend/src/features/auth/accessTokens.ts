import { createHash, createPrivateKey, createPublicKey, generateKeyPairSync, KeyObject } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { exportJWK, jwtVerify, SignJWT, type JWK } from "jose";
import { ENV } from "../../envVars";
import { makeDebug } from "../debug";

const debug = makeDebug("auth:access-token");

/** Audience of the access tokens; PowerSync must be configured with the same value. */
export const ACCESS_TOKEN_AUDIENCE = "patrinotes";
export const ACCESS_TOKEN_ISSUER = "patrinotes";

type SigningKey = { privateKey: KeyObject; publicKey: KeyObject; kid: string };

let signingKey: SigningKey | null = null;

/**
 * Dev / test only (envVars refuses to start in production without AUTH_JWT_PRIVATE_KEY): a key generated
 * once and kept in a git-ignored file. It must survive the restarts of `vite-node --watch`, since PowerSync
 * caches the JWKS and would reject the tokens signed with a new key.
 */
const loadOrCreateDevKey = () => {
  const keyPath = fileURLToPath(new URL("../../../.auth-dev-key.pem", import.meta.url));
  if (existsSync(keyPath)) return createPrivateKey(readFileSync(keyPath, "utf8"));

  debug("AUTH_JWT_PRIVATE_KEY is not set, generating a development key in", keyPath);
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  writeFileSync(keyPath, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
  return privateKey;
};

const loadSigningKey = (): SigningKey => {
  if (signingKey) return signingKey;

  const privateKey = ENV.AUTH_JWT_PRIVATE_KEY
    ? createPrivateKey(ENV.AUTH_JWT_PRIVATE_KEY.replace(/\\n/g, "\n"))
    : loadOrCreateDevKey();

  const publicKey = createPublicKey(privateKey);
  const der = publicKey.export({ type: "spki", format: "der" });
  const kid = createHash("sha256").update(der).digest("base64url").slice(0, 16);

  signingKey = { privateKey, publicKey, kid };
  return signingKey;
};

export type AccessTokenClaims = { sub: string; email: string; sid: string };

export const signAccessToken = async ({ userId, email, sessionId }: { userId: string; email: string; sessionId: string }) => {
  const { privateKey, kid } = loadSigningKey();
  const expiresIn = ENV.ACCESS_TOKEN_TTL_SECONDS;

  const accessToken = await new SignJWT({ email, sid: sessionId })
    .setProtectedHeader({ alg: "RS256", kid, typ: "JWT" })
    .setSubject(userId)
    .setIssuer(ACCESS_TOKEN_ISSUER)
    .setAudience(ACCESS_TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(privateKey);

  return { accessToken, expiresIn };
};

export const verifyAccessToken = async (token: string) => {
  const { publicKey } = loadSigningKey();
  const { payload } = await jwtVerify(token, publicKey, {
    algorithms: ["RS256"],
    issuer: ACCESS_TOKEN_ISSUER,
    audience: ACCESS_TOKEN_AUDIENCE,
  });
  return payload as typeof payload & AccessTokenClaims;
};

/** Public keys, served at /api/auth/jwks.json for PowerSync. */
export const getJwks = async (): Promise<{ keys: JWK[] }> => {
  const { publicKey, kid } = loadSigningKey();
  const jwk = await exportJWK(publicKey);
  return { keys: [{ ...jwk, kid, alg: "RS256", use: "sig" }] };
};
