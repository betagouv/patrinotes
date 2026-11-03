import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { addDays } from "date-fns";
import { v7 } from "uuid";
import { db } from "../../db/db";
import { ENV } from "../../envVars";
import { AppError } from "../errors";
import { makeDebug } from "../debug";
import { signAccessToken } from "./accessTokens";

const debug = makeDebug("auth:session");

export type SessionProvider = "proconnect" | "magic_link" | "keycloak";

/**
 * Rotation: every refresh replaces the token, the replaced one is kept as `previous_token_hash`.
 *
 * - The previous token stays accepted, without time limit: a refresh whose response never reached the
 *   client (connection lost on the field, then hours offline) leaves it holding that one, and it must
 *   not be logged out for it. Presenting it rotates again and keeps the replaced token as previous.
 * - A token two rotations old is a replay (someone else uses the session): the session is revoked.
 */

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
export const randomSecret = (bytes = 32) => randomBytes(bytes).toString("base64url");

const hashesEqual = (a: string | null | undefined, b: string) =>
  !!a && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

const nextExpiry = () => addDays(new Date(), ENV.AUTH_SESSION_IDLE_DAYS).toISOString();

/** What the frontend stores: same shape as before the ProConnect migration. */
const issueTokens = async ({
  sessionId,
  secret,
  user,
}: {
  sessionId: string;
  secret: string;
  user: { id: string; email: string };
}) => {
  const { accessToken, expiresIn } = await signAccessToken({ userId: user.id, email: user.email, sessionId });
  return {
    accessToken,
    refreshToken: `${sessionId}.${secret}`,
    // refresh at 80% of the lifetime, as the frontend expects
    expiresAt: String(Date.now() + expiresIn * 0.8 * 1000),
  };
};

export const createSession = async ({
  user,
  provider,
  idToken,
}: {
  user: { id: string; email: string };
  provider: SessionProvider;
  idToken?: string | null;
}) => {
  const sessionId = v7();
  const secret = randomSecret();

  await db
    .insertInto("auth_session")
    .values({
      id: sessionId,
      user_id: user.id,
      provider,
      token_hash: sha256(secret),
      id_token: idToken ?? null,
      expires_at: nextExpiry(),
    })
    .execute();

  debug("session created", sessionId, provider, user.id);
  return issueTokens({ sessionId, secret, user });
};

const parseRefreshToken = (refreshToken: string) => {
  const [sessionId, secret, ...rest] = refreshToken.split(".");
  if (!sessionId || !secret || rest.length) return null;
  return { sessionId, secret };
};

/** True when the string looks like one of our refresh tokens (and not a legacy Keycloak JWT). */
export const isSessionRefreshToken = (refreshToken: string) => parseRefreshToken(refreshToken) !== null;

const sessionExpired = () => new AppError(401, "Session expirée, veuillez vous reconnecter");

/** Rotates the refresh token and issues a new access token. */
export const refreshSession = async (refreshToken: string) => {
  const parsed = parseRefreshToken(refreshToken);
  if (!parsed) throw sessionExpired();
  const presentedHash = sha256(parsed.secret);

  // optimistic concurrency: two refreshes racing with the same token must not make each other look
  // like a replay, the loser simply re-reads the session and is then "one rotation behind"
  for (let attempt = 0; attempt < 3; attempt++) {
    const session = await db
      .selectFrom("auth_session")
      .innerJoin("user", "user.id", "auth_session.user_id")
      .where("auth_session.id", "=", parsed.sessionId)
      .select([
        "auth_session.id",
        "auth_session.token_hash",
        "auth_session.previous_token_hash",
        "auth_session.expires_at",
        "auth_session.revoked_at",
        "user.id as user_id",
        "user.email as email",
      ])
      .executeTakeFirst();

    if (!session || session.revoked_at || new Date(session.expires_at) < new Date()) throw sessionExpired();

    const isCurrent = hashesEqual(session.token_hash, presentedHash);
    const isPrevious = hashesEqual(session.previous_token_hash, presentedHash);

    if (!isCurrent && !isPrevious) {
      debug("refresh token reuse detected, revoking session", session.id);
      await revokeSession(session.id);
      throw sessionExpired();
    }

    const secret = randomSecret();
    const updated = await db
      .updateTable("auth_session")
      .set({
        token_hash: sha256(secret),
        // the replaced token stays valid as "previous", whichever was presented: after a lost response
        // it is the one the client never got (harmless), with two holders of the session (two tabs of
        // an old version of the app) it is the other holder's, so both keep working
        previous_token_hash: session.token_hash,
        rotated_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
        expires_at: nextExpiry(),
      })
      .where("id", "=", session.id)
      .where("token_hash", "=", session.token_hash)
      .executeTakeFirst();

    if (Number(updated.numUpdatedRows) === 0) continue; // rotated concurrently, read again

    return {
      userId: session.user_id,
      ...(await issueTokens({ sessionId: session.id, secret, user: { id: session.user_id, email: session.email } })),
    };
  }

  throw new AppError(503, "Le service est momentanément indisponible, veuillez réessayer");
};

export const revokeSession = async (sessionId: string) => {
  await db
    .updateTable("auth_session")
    .set({ revoked_at: new Date().toISOString() })
    .where("id", "=", sessionId)
    .where("revoked_at", "is", null)
    .execute();
};

/**
 * Revokes the session the refresh token belongs to (logout). Returns the ProConnect id_token,
 * if any, so the browser can also end its ProConnect session.
 */
export const revokeSessionByRefreshToken = async (refreshToken: string) => {
  const parsed = parseRefreshToken(refreshToken);
  if (!parsed) return null;

  const session = await db
    .selectFrom("auth_session")
    .where("id", "=", parsed.sessionId)
    .select(["id", "token_hash", "previous_token_hash", "id_token"])
    .executeTakeFirst();
  if (!session) return null;

  const presentedHash = sha256(parsed.secret);
  if (!hashesEqual(session.token_hash, presentedHash) && !hashesEqual(session.previous_token_hash, presentedHash)) {
    return null;
  }

  await revokeSession(session.id);
  return { idToken: session.id_token };
};

/** Every session of a user (e.g. when an admin removes them). */
export const revokeUserSessions = async (userId: string) => {
  await db
    .updateTable("auth_session")
    .set({ revoked_at: new Date().toISOString() })
    .where("user_id", "=", userId)
    .where("revoked_at", "is", null)
    .execute();
};

/** Is the session behind an access token still usable? (checked on every API request) */
export const isSessionActive = async (sessionId: string) => {
  const session = await db
    .selectFrom("auth_session")
    .where("id", "=", sessionId)
    .select(["revoked_at", "expires_at"])
    .executeTakeFirst();
  return !!session && !session.revoked_at && new Date(session.expires_at) > new Date();
};
