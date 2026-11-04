import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { userTSchema } from "../services/authService";
import { getJwks } from "../features/auth/accessTokens";

export const authPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  // public keys of the access tokens, read by PowerSync (client_auth.jwks_uri)
  fastify.get("/auth/jwks.json", { schema: { hide: true } as any }, async () => getJwks());

  fastify.get("/auth/config", { schema: authConfigTSchema }, async (request) => {
    return request.services.auth.getAuthConfig();
  });

  fastify.get("/auth/proconnect/authorize", { schema: proConnectAuthorizeTSchema }, async (request) => {
    return request.services.auth.getProConnectAuthorizationUrl();
  });

  fastify.post("/auth/proconnect/callback", { schema: proConnectCallbackTSchema }, async (request) => {
    return request.services.auth.proConnectCallback(request.body);
  });

  fastify.post("/auth/magic-link", { schema: requestMagicLinkTSchema }, async (request) => {
    return request.services.auth.requestMagicLink(request.body.email);
  });

  fastify.post("/auth/magic-link/verify", { schema: verifyMagicLinkTSchema }, async (request) => {
    const { token, email, code } = request.body;
    return request.services.auth.verifyMagicLink(token ? { token } : { email: email ?? "", code: code ?? "" });
  });

  fastify.post("/auth/link-account", { schema: linkAccountTSchema }, async (request) => {
    return request.services.auth.linkExistingAccount(request.body);
  });

  fastify.post("/auth/signup", { schema: completeSignupTSchema }, async (request) => {
    return request.services.auth.completeSignup(request.body);
  });

  fastify.post("/refresh-token", { schema: refreshTokenTSchema }, async (request) => {
    return request.services.auth.refreshToken(request.body.refreshToken);
  });

  fastify.post("/auth/logout", { schema: logoutTSchema }, async (request) => {
    return request.services.auth.logout(request.body.refreshToken);
  });
};

export const authTSchema = Type.Object({
  user: userTSchema,
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresAt: Type.String(),
});

/** Result of a sign-in: either a session, or the profile to complete on the first sign-in. */
export const signInResultTSchema = Type.Union([
  Type.Object({
    status: Type.Literal("logged-in"),
    user: userTSchema,
    accessToken: Type.String(),
    refreshToken: Type.String(),
    expiresAt: Type.String(),
  }),
  Type.Object({
    status: Type.Literal("signup-required"),
    signupToken: Type.String(),
    email: Type.String(),
    givenName: Type.Union([Type.String(), Type.Null()]),
    usualName: Type.Union([Type.String(), Type.Null()]),
    provider: Type.Union([Type.Literal("proconnect"), Type.Literal("magic_link")]),
    // false: the address is not authorized, only linking an existing account is possible
    canCreateAccount: Type.Boolean(),
  }),
]);

export const linkAccountTSchema = {
  body: Type.Object({ signupToken: Type.String(), email: Type.String(), code: Type.String() }),
  response: { 200: signInResultTSchema },
};

export const authConfigTSchema = {
  response: { 200: Type.Object({ proconnect: Type.Boolean() }) },
};

export const proConnectAuthorizeTSchema = {
  response: { 200: Type.Object({ url: Type.String(), state: Type.String() }) },
};

export const proConnectCallbackTSchema = {
  body: Type.Object({ code: Type.String(), state: Type.String() }),
  response: { 200: signInResultTSchema },
};

export const requestMagicLinkTSchema = {
  body: Type.Object({ email: Type.String({ minLength: 3, maxLength: 320 }) }),
  response: { 200: Type.Object({ message: Type.String() }) },
};

export const verifyMagicLinkTSchema = {
  body: Type.Object({
    token: Type.Optional(Type.String()),
    email: Type.Optional(Type.String()),
    code: Type.Optional(Type.String()),
  }),
  response: { 200: signInResultTSchema },
};

export const completeSignupTSchema = {
  body: Type.Object({
    signupToken: Type.String(),
    name: Type.String({ minLength: 1 }),
    job: Type.String(),
    service_id: Type.String(),
    newsletter: Type.Boolean(),
    cgu: Type.Boolean(),
  }),
  response: { 200: signInResultTSchema },
};

export const refreshTokenTSchema = {
  body: Type.Object({
    refreshToken: Type.String(),
  }),
  response: { 200: authTSchema },
};

export const logoutTSchema = {
  body: Type.Object({ refreshToken: Type.String() }),
  response: { 200: Type.Object({ proConnectLogoutUrl: Type.Union([Type.String(), Type.Null()]) }) },
};
