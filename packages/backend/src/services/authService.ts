import { Static, Type } from "@sinclair/typebox";
import { jwtVerify, SignJWT } from "jose";
import { v7 } from "uuid";
import { db } from "../db/db";
import { ENV, isDev } from "../envVars";
import { verifyAccessToken } from "../features/auth/accessTokens";
import {
  isLegacyKeycloakEnabled,
  redeemLegacyRefreshToken,
  verifyLegacyAccessToken,
} from "../features/auth/legacyKeycloak";
import { normalizeEmail, requestMagicLink, verifyMagicLink } from "../features/auth/magicLink";
import {
  getProConnectAuthorizationUrl,
  getProConnectLogoutUrl,
  handleProConnectCallback,
  isProConnectEnabled,
} from "../features/auth/proconnect";
import {
  createSession,
  isSessionActive,
  isSessionRefreshToken,
  refreshSession,
  revokeSessionByRefreshToken,
  SessionProvider,
} from "../features/auth/sessions";
import { makeDebug } from "../features/debug";
import { AppError } from "../features/errors";
import type { completeSignupTSchema } from "../routes/authRoutes";
import { serviceTSchema } from "../routes/staticDataRoutes";
import { getServices } from "./services";

const debug = makeDebug("auth-service");

const SIGNUP_TOKEN_AUDIENCE = "patrinotes-signup";

/** Identity verified by ProConnect or by email, for an agent who has no account yet. */
type SignupClaims = {
  email: string;
  givenName: string | null;
  usualName: string | null;
  provider: Exclude<SessionProvider, "keycloak">;
  proconnectSub?: string;
  idToken?: string;
};

const signupSecret = () => new TextEncoder().encode(ENV.JWT_SECRET);

export class AuthService {
  getAuthConfig() {
    return { proconnect: isProConnectEnabled() };
  }

  // --- ProConnect ---------------------------------------------------------------------------------

  async getProConnectAuthorizationUrl() {
    return getProConnectAuthorizationUrl();
  }

  async proConnectCallback(params: { code: string; state: string }) {
    const identity = await handleProConnectCallback(params);

    const user = (await findUserByProConnectSub(identity.sub)) ?? (await findUserByEmail(identity.email));

    if (user) {
      await linkProConnectSub(user.id, user.email, identity.sub);
      return this.loggedIn(user, "proconnect", identity.idToken);
    }

    return this.signupRequired({
      email: identity.email,
      givenName: identity.givenName,
      usualName: identity.usualName,
      provider: "proconnect",
      proconnectSub: identity.sub,
      idToken: identity.idToken,
    });
  }

  // --- Magic link ---------------------------------------------------------------------------------

  async requestMagicLink(email: string) {
    const existing = await findUserByEmail(email);
    if (!existing) await assertEmailInWhitelist(email);

    await requestMagicLink(email);
    return { message: "Un courriel de connexion vous a été envoyé." };
  }

  async verifyMagicLink(input: { token: string } | { email: string; code: string }) {
    const email = await verifyMagicLink(input);

    const user = await findUserByEmail(email);
    if (user) return this.loggedIn(user, "magic_link");

    return this.signupRequired({ email, givenName: null, usualName: null, provider: "magic_link" });
  }

  // --- First sign-in: the agent completes their profile ------------------------------------------

  /**
   * ProConnect sent an email no account has (alias, other address): the agent proves they own the
   * address of their existing account with an emailed code, and the ProConnect identity is bound to it.
   */
  async linkExistingAccount(body: { signupToken: string; email: string; code: string }) {
    const claims = await verifySignupToken(body.signupToken);
    if (claims.provider !== "proconnect" || !claims.proconnectSub) {
      throw new AppError(400, "Seule une connexion ProConnect peut être rattachée à un compte existant");
    }

    const email = await verifyMagicLink({ email: body.email, code: body.code });
    const user = await findUserByEmail(email);
    if (!user) throw new AppError(404, "Aucun compte Patrinotes n'utilise ce courriel");

    debug("linking proconnect identity", claims.email, "to the account of", user.email);
    await linkProConnectSub(user.id, user.email, claims.proconnectSub);
    return this.loggedIn(user, "proconnect", claims.idToken);
  }

  async completeSignup(body: Static<(typeof completeSignupTSchema)["body"]>) {
    const claims = await verifySignupToken(body.signupToken);
    if (!body.cgu) throw new AppError(400, "Vous devez accepter les conditions générales d'utilisation");

    // already created meanwhile (double submit, other tab): just sign in
    const existing = await findUserByEmail(claims.email);
    if (existing) return this.loggedIn(existing, claims.provider, claims.idToken);

    await assertEmailInWhitelist(claims.email);

    debug("creating user", claims.email, claims.provider);
    const userId = v7();
    await db.transaction().execute(async (tx) => {
      await tx
        .insertInto("user")
        .values({ id: userId, name: body.name, service_id: body.service_id, email: claims.email, job: body.job })
        .execute();
      await tx
        .insertInto("internal_user")
        .values({
          id: v7(),
          userId,
          email: claims.email,
          newsletter: body.newsletter,
          role: "user",
          proconnect_sub: claims.proconnectSub ?? null,
        })
        .execute();
    });

    await getServices().user.changeService(userId, body.service_id);

    const user = (await findUserById(userId))!;
    return this.loggedIn(user, claims.provider, claims.idToken);
  }

  // --- Session lifecycle -----------------------------------------------------------------------

  async refreshToken(refreshToken: string) {
    if (isSessionRefreshToken(refreshToken)) {
      const { userId, ...tokens } = await refreshSession(refreshToken);
      const user = await findUserById(userId);
      if (!user) throw new AppError(401, "Session expirée, veuillez vous reconnecter");
      return { ...tokens, user };
    }

    // TEMPORARY: a session opened with Keycloak, migrated to our own session
    if (isLegacyKeycloakEnabled()) {
      const email = await redeemLegacyRefreshToken(refreshToken);
      const user = email ? await findUserByEmail(email) : null;
      if (user) {
        debug("migrating keycloak session", user.email);
        const tokens = await createSession({ user, provider: "keycloak" });
        return { ...tokens, user };
      }
    }

    throw new AppError(401, "Session expirée, veuillez vous reconnecter");
  }

  async logout(refreshToken: string) {
    const revoked = await revokeSessionByRefreshToken(refreshToken);
    if (!revoked?.idToken || !isProConnectEnabled()) return { proConnectLogoutUrl: null };
    return { proConnectLogoutUrl: await getProConnectLogoutUrl(revoked.idToken) };
  }

  /** Used by the auth middleware on every request. */
  async getUserFromToken(token: string) {
    try {
      const claims = await verifyAccessToken(token);
      if (!(await isSessionActive(claims.sid))) return null;
      return findUserById(claims.sub);
    } catch (error) {
      // TEMPORARY: access tokens issued by Keycloak before the migration (they expire within the hour)
      const legacyEmail = await verifyLegacyAccessToken(token);
      if (legacyEmail) return findUserByEmail(legacyEmail);
      throw error;
    }
  }

  async getUserCreatedAt(userId: string) {
    const internalUser = await db
      .selectFrom("internal_user")
      .select("createdAt")
      .where("userId", "=", userId)
      .executeTakeFirst();
    return internalUser?.createdAt ?? null;
  }

  // --- helpers -----------------------------------------------------------------------------------

  private async loggedIn(user: PopulatedUser, provider: SessionProvider, idToken?: string | null) {
    const tokens = await createSession({ user, provider, idToken });
    return { status: "logged-in" as const, ...tokens, user };
  }

  private async signupRequired(claims: SignupClaims) {
    // Checked here too, so a non-authorized agent is told before filling the form. Except after a
    // ProConnect sign-in: an existing agent whose ProConnect address differs from their account's must
    // still reach the page to link that account (creating a new one stays refused).
    const canCreateAccount = await isEmailWhitelisted(claims.email);
    if (!canCreateAccount && claims.provider !== "proconnect") await assertEmailInWhitelist(claims.email);

    const signupToken = await new SignJWT({ ...claims })
      .setProtectedHeader({ alg: "HS256" })
      .setAudience(SIGNUP_TOKEN_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime("30m")
      .sign(signupSecret());

    return {
      status: "signup-required" as const,
      signupToken,
      email: claims.email,
      givenName: claims.givenName,
      usualName: claims.usualName,
      provider: claims.provider,
      canCreateAccount,
    };
  }
}

type PopulatedUser = NonNullable<Awaited<ReturnType<typeof findUserById>>>;

const verifySignupToken = async (signupToken: string) => {
  try {
    const { payload } = await jwtVerify(signupToken, signupSecret(), { audience: SIGNUP_TOKEN_AUDIENCE });
    return payload as unknown as SignupClaims;
  } catch {
    throw new AppError(401, "La demande d'inscription a expiré, veuillez vous reconnecter");
  }
};

const populateService = async <T extends { service_id: string }>(user: T) => {
  const service = await db.selectFrom("service").where("id", "=", user.service_id).selectAll().executeTakeFirst();
  return { ...user, service: service! };
};

const findUserById = async (id: string) => {
  const user = await db.selectFrom("user").where("id", "=", id).selectAll().executeTakeFirst();
  return user ? populateService(user) : null;
};

const findUserByEmail = async (email: string) => {
  const user = await db
    .selectFrom("user")
    .where((eb) => eb(eb.fn("lower", ["email"]), "=", normalizeEmail(email)))
    .selectAll()
    .executeTakeFirst();
  return user ? populateService(user) : null;
};

const findUserByProConnectSub = async (sub: string) => {
  const internalUser = await db
    .selectFrom("internal_user")
    .where("proconnect_sub", "=", sub)
    .select("userId")
    .executeTakeFirst();
  return internalUser ? findUserById(internalUser.userId) : null;
};

/** Remember the ProConnect identity, so a later change of email at ProConnect keeps the account. */
const linkProConnectSub = async (userId: string, email: string, sub: string) => {
  const internalUser = await db
    .selectFrom("internal_user")
    .where("userId", "=", userId)
    .select(["id", "proconnect_sub"])
    .executeTakeFirst();

  if (!internalUser) {
    await db.insertInto("internal_user").values({ id: v7(), userId, email, role: "user", proconnect_sub: sub }).execute();
    return;
  }
  if (internalUser.proconnect_sub === sub) return;
  if (internalUser.proconnect_sub) {
    // the account was bound to another ProConnect identity carrying the same email
    debug("proconnect sub changed for", email, internalUser.proconnect_sub, "->", sub);
  }
  await db.updateTable("internal_user").set({ proconnect_sub: sub }).where("id", "=", internalUser.id).execute();
};

const isEmailWhitelisted = async (email: string) => {
  if (isDev) return true;

  const whitelist = await db
    .selectFrom("whitelist")
    .where((eb) => eb(eb.fn("lower", ["email"]), "=", normalizeEmail(email)))
    .selectAll()
    .executeTakeFirst();
  return !!whitelist;
};

const assertEmailInWhitelist = async (email: string) => {
  if (!(await isEmailWhitelisted(email))) {
    throw new AppError(
      403,
      "Votre courriel n'est pas autorisé à accéder à cette application.\nVous pouvez écrire à contact@patrinotes.beta.gouv.fr.",
    );
  }
};

export const userTSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  service_id: Type.String(),
  service: serviceTSchema,
  job: Type.Union([Type.String(), Type.Null()]),
});
