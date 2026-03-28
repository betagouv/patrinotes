import { ofetch } from "ofetch";
import { ENV } from "../envVars";
import { Type } from "@sinclair/typebox";
import jwt from "jsonwebtoken";
import jwks from "jwks-rsa";
import { createHash } from "crypto";
import { db } from "../db/db";
import { serviceTSchema } from "../routes/staticDataRoutes";
import { AppError } from "../features/errors";
import { makeDebug } from "../features/debug";

const debug = makeDebug("auth-service");
const proConnectBaseUrl = ENV.VITE_AUTH_URL;

const jwksClient = jwks({
  jwksUri: `${proConnectBaseUrl}/jwks`,
  cache: true,
});

const getProConnectKey = (header: jwt.JwtHeader) =>
  new Promise<string>((resolve, reject) => {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      resolve(key!.getPublicKey());
    });
  });

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export class AuthService {
  async authenticate({ code, nonce }: { code: string; nonce: string }) {
    debug("authenticating with ProConnect", { code: code.slice(0, 8) + "..." });

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${ENV.FRONTEND_URL}/auth-callback`,
      client_id: ENV.VITE_AUTH_CLIENT_ID,
      client_secret: ENV.AUTH_CLIENT_SECRET,
    });

    const proConnectTokens = await ofetch<ProConnectTokenResponse>(`${proConnectBaseUrl}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    // Verify id_token signature (ProConnect uses RS256)
    const decodedHeader = jwt.decode(proConnectTokens.id_token, { complete: true });
    const signingKey = await getProConnectKey(decodedHeader!.header);
    const idToken = jwt.verify(proConnectTokens.id_token, signingKey, {
      algorithms: ["RS256"],
    }) as jwt.JwtPayload & { nonce?: string };

    if (idToken.nonce !== nonce) {
      throw new AppError(400, "Nonce invalide");
    }

    const userInfo = await ofetch<ProConnectUserInfo>(`${proConnectBaseUrl}/userinfo`, {
      headers: { Authorization: `Bearer ${proConnectTokens.access_token}` },
    });

    const user = await this.upsertUser(userInfo);
    const { accessToken, refreshToken, expiresAt } = await this.issueTokens(user.id);
    const populatedUser = await populateService(user);

    return { accessToken, refreshToken, expiresAt, user: populatedUser };
  }

  async refreshToken(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);

    const session = await db
      .selectFrom("session")
      .where("refresh_token_hash", "=", tokenHash)
      .where("expires_at", ">", new Date().toISOString())
      .selectAll()
      .executeTakeFirst();

    if (!session) {
      return { accessToken: null as null, refreshToken: null as null, expiresAt: null as null };
    }

    const user = await db
      .selectFrom("user")
      .where("id", "=", session.user_id)
      .selectAll()
      .executeTakeFirstOrThrow();

    await db.deleteFrom("session").where("id", "=", session.id).execute();
    const tokens = await this.issueTokens(user.id);
    const populatedUser = await populateService(user);

    return { ...tokens, user: populatedUser };
  }

  checkToken(token: string) {
    return jwt.verify(token, ENV.JWT_SECRET, { algorithms: ["HS256"] }) as jwt.JwtPayload;
  }

  async getUserFromToken(token: string) {
    const payload = this.checkToken(token);
    const user = await db.selectFrom("user").where("id", "=", payload.sub!).selectAll().executeTakeFirst();
    if (!user) return null;
    return populateService(user);
  }

  private async upsertUser(userInfo: ProConnectUserInfo) {
    const name = [userInfo.given_name, userInfo.usual_name].filter(Boolean).join(" ") || userInfo.email;

    const existingById = await db.selectFrom("user").where("id", "=", userInfo.sub).selectAll().executeTakeFirst();
    const existing =
      existingById ??
      (await db.selectFrom("user").where("email", "=", userInfo.email).selectAll().executeTakeFirst());

    if (existing) {
      await db.updateTable("user").set({ name }).where("id", "=", existing.id).execute();

      const internalUserExists = await db
        .selectFrom("internal_user")
        .where("userId", "=", existing.id)
        .select("id")
        .executeTakeFirst();

      if (!internalUserExists) {
        await db
          .insertInto("internal_user")
          .values({ id: crypto.randomUUID(), userId: existing.id, email: existing.email, role: "user" })
          .execute();
      }

      return { ...existing, name };
    }

    return db.transaction().execute(async (tx) => {
      const u = await tx
        .insertInto("user")
        .values({ id: userInfo.sub, name, email: userInfo.email })
        .returningAll()
        .executeTakeFirstOrThrow();

      await tx
        .insertInto("internal_user")
        .values({ id: crypto.randomUUID(), userId: u.id, email: userInfo.email, role: "user" })
        .execute();

      return u;
    });
  }

  private async issueTokens(userId: string) {
    const accessToken = jwt.sign({ sub: userId }, ENV.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    const rawRefreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db
      .insertInto("session")
      .values({
        id: crypto.randomUUID(),
        user_id: userId,
        refresh_token_hash: hashToken(rawRefreshToken),
        expires_at: expiresAt.toISOString(),
      })
      .execute();

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresAt: get80PercentOfTokenLifespan(3600).toString(),
    };
  }
}

const populateService = async <T extends { service_id: string | null }>(user: T) => {
  if (!user.service_id) return { ...user, service: null };
  const service = await db.selectFrom("service").where("id", "=", user.service_id).selectAll().executeTakeFirst();
  return { ...user, service: service ?? null };
};

export const get80PercentOfTokenLifespan = (expiresIn: number) => Date.now() + expiresIn * 0.8 * 1000;

type ProConnectTokenResponse = {
  access_token: string;
  id_token: string;
  token_type: string;
};

type ProConnectUserInfo = {
  sub: string;
  email: string;
  given_name?: string;
  usual_name?: string;
};

export const userTSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  service_id: Type.Union([Type.String(), Type.Null()]),
  service: Type.Union([serviceTSchema, Type.Null()]),
  email: Type.String(),
  job: Type.Union([Type.String(), Type.Null()]),
});

export const authTSchema = Type.Object({
  user: userTSchema,
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresAt: Type.String(),
});
