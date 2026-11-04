/**
 * Sign-in by email, for agents who cannot use ProConnect.
 *
 * One email carries both a link and a 6-digit code: on iOS an installed PWA does not share its
 * storage with Safari, so a link opened from the mail app would sign Safari in, not the app.
 * The code can be typed in the app instead.
 */
import { randomInt } from "node:crypto";
import { v7 } from "uuid";
import { db } from "../../db/db";
import { ENV } from "../../envVars";
import { AppError } from "../errors";
import { sendMagicLinkMail } from "../mail";
import { makeDebug } from "../debug";
import { randomSecret, sha256 } from "./sessions";

const debug = makeDebug("auth:magic-link");

const CHALLENGE_TTL_MS = 15 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const requestMagicLink = async (rawEmail: string) => {
  const email = normalizeEmail(rawEmail);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError(400, "Le courriel n'est pas valide");

  const recent = await db
    .selectFrom("login_challenge")
    .where("email", "=", email)
    .where("created_at", ">", new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .select((eb) => eb.fn.countAll<string>().as("count"))
    .executeTakeFirstOrThrow();
  if (Number(recent.count) >= ENV.AUTH_MAGIC_LINK_MAX_PER_HOUR) {
    throw new AppError(429, "Trop de demandes de connexion, veuillez réessayer dans une heure");
  }

  const id = v7();
  const secret = randomSecret();
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");

  await db
    .insertInto("login_challenge")
    .values({
      id,
      email,
      token_hash: sha256(secret),
      code_hash: sha256(`${id}:${code}`),
      expires_at: new Date(Date.now() + CHALLENGE_TTL_MS).toISOString(),
    })
    .execute();

  const link = `${ENV.FRONTEND_URL.replace(/\/+$/, "")}/auth-callback?magic=${encodeURIComponent(`${id}.${secret}`)}`;
  await sendMagicLinkMail({ email, link, code });
  debug("magic link sent", email);
};

const invalid = () => new AppError(401, "Le lien ou le code est invalide ou a expiré");

/** Returns the verified email. */
export const verifyMagicLink = async (input: { token: string } | { email: string; code: string }) => {
  if ("token" in input) {
    const [id, secret] = input.token.split(".");
    if (!id || !secret) throw invalid();

    const challenge = await db
      .updateTable("login_challenge")
      .set({ used_at: new Date().toISOString() })
      .where("id", "=", id)
      .where("token_hash", "=", sha256(secret))
      .where("used_at", "is", null)
      .where("expires_at", ">", new Date().toISOString())
      .returning(["email"])
      .executeTakeFirst();
    if (!challenge) throw invalid();
    return challenge.email;
  }

  const email = normalizeEmail(input.email);
  const code = input.code.replace(/\s/g, "");

  const challenge = await db
    .selectFrom("login_challenge")
    .where("email", "=", email)
    .where("used_at", "is", null)
    .where("expires_at", ">", new Date().toISOString())
    .orderBy("created_at", "desc")
    .selectAll()
    .executeTakeFirst();
  if (!challenge || challenge.attempts >= MAX_CODE_ATTEMPTS) throw invalid();

  if (challenge.code_hash !== sha256(`${challenge.id}:${code}`)) {
    await db
      .updateTable("login_challenge")
      .set((eb) => ({ attempts: eb("attempts", "+", 1) }))
      .where("id", "=", challenge.id)
      .execute();
    throw invalid();
  }

  const used = await db
    .updateTable("login_challenge")
    .set({ used_at: new Date().toISOString() })
    .where("id", "=", challenge.id)
    .where("used_at", "is", null)
    .returning(["email"])
    .executeTakeFirst();
  if (!used) throw invalid();
  return used.email;
};
