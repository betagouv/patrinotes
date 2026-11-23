import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { userTSchema } from "../services/authService";
import { authRateLimit, publicRateLimit } from "../features/rateLimit";

export const authPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.post("/refresh-token", { schema: refreshTokenTSchema }, async (request) => {
    return request.services.auth.refreshToken(request.body.refreshToken);
  });

  fastify.post("/create-user", { schema: createUserTSchema, preHandler: authRateLimit }, async (request) => {
    return request.services.auth.createUser(request.body);
  });

  // called by the frontend when the agent logs out; the access token may have expired, the refresh token is the proof
  fastify.post("/logout", { schema: logoutTSchema, onRequest: publicRateLimit }, async (request) => {
    return request.services.auth.revokeRefreshToken(request.body.refreshToken);
  });

  fastify.post("/login-user", { schema: loginTSchema, preHandler: authRateLimit }, async (request) => {
    return request.services.auth.loginUser(request.body);
  });
};

export const authTSchema = Type.Object({
  user: userTSchema,
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresAt: Type.String(),
});

export const loginTSchema = {
  body: Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
  response: { 200: authTSchema },
};

export const createUserTSchema = {
  body: Type.Object({
    password: Type.String(),
    name: Type.String(),
    email: Type.String(),
    job: Type.String(),
    service_id: Type.String(),
    newsletter: Type.Boolean(),
    cgu: Type.Boolean(),
  }),
  response: { 200: authTSchema },
};

export const refreshTokenTSchema = {
  body: Type.Object({
    refreshToken: Type.String(),
  }),
  response: { 200: authTSchema },
};

export const logoutTSchema = {
  body: Type.Object({
    refreshToken: Type.String(),
  }),
  response: { 200: Type.Object({ revoked: Type.Boolean() }) },
};
