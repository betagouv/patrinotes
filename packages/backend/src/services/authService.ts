import { FetchError, ofetch } from "ofetch";
import { ENV, isDev } from "../envVars";
import { Static, Type } from "@sinclair/typebox";
import jwt from "jsonwebtoken";
import jwks from "jwks-rsa";
import { db } from "../db/db";
import { serviceTSchema } from "../routes/staticDataRoutes";
import { createUserTSchema, loginTSchema } from "../routes/authRoutes";
import { adminAuthApi, getKeycloakAdminTokens } from "../features/auth/keycloak";
import { AppError } from "../features/errors";
import { getServices } from "./services";
import { AuthUser } from "../routes/authMiddleware";
import { makeDebug } from "../features/debug";
const debug = makeDebug("auth-service");
const authFullUrl = `${ENV.VITE_AUTH_URL}/realms/${ENV.VITE_AUTH_REALM}`;

const jwksClient = jwks({
  jwksUri: `${authFullUrl}/protocol/openid-connect/certs`,
  cache: true,
});

export class AuthService {
  async authenticate({ code }: AuthenticateProps) {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${ENV.FRONTEND_URL}/auth-callback`,
      client_id: ENV.VITE_AUTH_CLIENT_ID,
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: getClientAssertion(),
    });

    const response = await authApi<Static<typeof keycloakTokenResponseTSchema>>("/protocol/openid-connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const user = await this.getOrCreateUserFromToken(response.access_token);

    return { tokens: response, user: user! };
  }

  async checkToken(token: string) {
    const decoded = jwt.decode(token, { complete: true });
    const key = await getKey(decoded!.header);
    return jwt.verify(token, key, {
      algorithms: ["RS256"],
      issuer: `${ENV.VITE_AUTH_URL}/realms/${ENV.VITE_AUTH_REALM}`,
      audience: "account",
    }) as Promise<jwt.JwtPayload & ExtraTokenInfo>;
  }

  async refreshToken(refreshToken: string) {
    const keycloakTokens = await authApi<Static<typeof keycloakTokenResponseTSchema>>(
      "/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: ENV.VITE_AUTH_CLIENT_ID,
          refresh_token: refreshToken,
          client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: getClientAssertion(),
        }).toString(),
      },
    );

    const user = await this.getUserFromToken(keycloakTokens.access_token);

    return {
      accessToken: keycloakTokens.access_token,
      refreshToken: keycloakTokens.refresh_token,
      expiresAt: get80PercentOfTokenLifespan(Number(keycloakTokens.expires_in)).toString(),
      user: user!,
    };
  }

  async getOrCreateUserFromToken(token: string) {
    const checked = await this.checkToken(token);

    const userPayload = {
      id: checked.sub!,
      name: checked.name ?? checked.preferred_username!,
      service_id: "no-service",
      email: checked.email,
    };

    const existingUser = await this.getUserFromToken(token);
    if (existingUser) return existingUser;

    const user = await db.insertInto("user").values(userPayload).returningAll().executeTakeFirstOrThrow();
    const populatedUser = { ...(await populateService(user!)), isFirstConnection: true };
    return populatedUser;
  }

  async getUserFromToken(token: string) {
    const checked = await this.checkToken(token);
    const user = await db.selectFrom("user").where("id", "=", checked.sub!).selectAll().executeTakeFirst();
    if (!user) return null;
    return populateService(user);
  }

  async loginUser(userData: Static<typeof loginTSchema.body>) {
    debug("logging in user", userData.email);
    try {
      const keycloakTokens = await authApi<Static<typeof keycloakTokenResponseTSchema>>(
        "/protocol/openid-connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "password",
            client_id: ENV.VITE_AUTH_CLIENT_ID,
            client_secret: ENV.AUTH_CLIENT_SECRET,
            username: userData.email,
            password: userData.password,
            scope: "offline_access",
            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            client_assertion: getClientAssertion(),
          }).toString(),
        },
      );

      const user = await db.selectFrom("user").where("email", "=", userData.email).selectAll().executeTakeFirst();
      return {
        accessToken: keycloakTokens.access_token,
        refreshToken: keycloakTokens.refresh_token,
        expiresAt: get80PercentOfTokenLifespan(Number(keycloakTokens.expires_in)).toString(),
        user: await populateService(user!),
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.message, error.cause, error.data);
        console.log(error.data?.error_description);
        throw convertFetchErrorToAppError(error);
      }
      throw error;
    }
  }

  async createUser(userData: Static<typeof createUserTSchema.body>) {
    await assertEmailInWhitelist(userData.email);
    debug("creating user", userData.email);
    try {
      await adminAuthApi("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          username: userData.name,
          email: userData.email,
          firstName: userData.name,
          enabled: true,
          credentials: [
            {
              type: "password",
              value: userData.password,
              temporary: false,
            },
          ],
        },
      });
      debug("user created in keycloak, creating in local db", userData.email);

      const keycloakUser = await adminAuthApi<Array<{ id: string }>>("/users", {
        method: "GET",
        query: {
          email: userData.email,
        },
      }).then((users) => users[0]);

      debug("fetched keycloak user", keycloakUser);

      const user = await db.transaction().execute(async (tx) => {
        const u = await tx
          .insertInto("user")
          .values({
            id: keycloakUser!.id,
            name: userData.name,
            service_id: userData.service_id,
            email: userData.email,
            job: userData.job,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        await tx
          .insertInto("internal_user")
          .values({
            id: keycloakUser!.id,
            userId: keycloakUser!.id,
            email: userData.email,
            newsletter: userData.newsletter,
            role: "user",
          })
          .execute();

        return u;
      });

      debug("user created in local db", user);

      await getServices().user.changeService(user.id, user.service_id);
      debug("user service changed", user.id, user.service_id);
      return this.loginUser({ email: userData.email, password: userData.password });
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error);
        throw new AppError(error.status || 500, `Authentication error: ${error.data?.errorMessage || error.message}`);
      }
      throw error;
    }
  }
}

const populateService = async <T extends { service_id: string }>(user: T) => {
  const service = await db.selectFrom("service").where("id", "=", user.service_id).selectAll().executeTakeFirst();
  return { ...user, service: service! };
};

const getClientAssertion = () => {
  return jwt.sign(
    {
      iss: ENV.VITE_AUTH_CLIENT_ID,
      sub: ENV.VITE_AUTH_CLIENT_ID,
      aud: `${ENV.VITE_AUTH_URL}/realms/${ENV.VITE_AUTH_REALM}`,
      exp: Math.floor(Date.now() / 1000) + 30,
      jti: crypto.randomUUID(),
    },
    ENV.AUTH_CLIENT_SECRET,
    { algorithm: "HS256" },
  );
};

const getKey = async (header: jwt.JwtHeader) => {
  return new Promise<string>((resolve, reject) => {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return reject(err);
      }
      const signingKey = key!.getPublicKey();
      resolve(signingKey);
    });
  });
};

export const get80PercentOfTokenLifespan = (expiresIn: number) => Date.now() + expiresIn * 0.8 * 1000;

type AuthenticateProps = {
  code: string;
};

type ExtraTokenInfo = {
  name: string;
  email: string;
  preferred_username: string;
};

export const keycloakTokenResponseTSchema = Type.Object({
  access_token: Type.String(),
  expires_in: Type.String(),
  refresh_token: Type.String(),
  refresh_expires_in: Type.String(),
  token_type: Type.String(),
  session_state: Type.String(),
  scope: Type.String(),
  id_token: Type.String(),
});

export const userTSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  service_id: Type.String(),
  service: serviceTSchema,
  job: Type.Union([Type.String(), Type.Null()]),
});

export const authApi = ofetch.create({
  baseURL: authFullUrl,
});

const assertEmailInWhitelist = async (email: string) => {
  if (isDev) return;

  const whitelistResults = await db.selectFrom("whitelist").where("email", "=", email).selectAll().execute();
  const whitelist = whitelistResults[0];

  if (!whitelist) {
    throw new AppError(
      403,
      "Votre courriel n'est pas autorisé à accéder à cette application.\nVous pouvez écrire à contact@patrinotes.beta.gouv.fr.",
    );
  }
};

const convertFetchErrorToAppError = (error: FetchError) => {
  if (!(error instanceof FetchError)) return new AppError(500, "Une erreur s'est produite");
  const description =
    error.data?.error_description || error.data?.message || error.message || "Une erreur s'est produite";

  const userFriendlyDescription = (descriptionMap as any)[description] || description;

  return new AppError(error.status || 500, userFriendlyDescription);
};

const descriptionMap = {
  "Invalid user credentials": "Courriel ou mot de passe incorrect",
};
