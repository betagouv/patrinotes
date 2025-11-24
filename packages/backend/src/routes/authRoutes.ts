import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { keycloakTokenResponseTSchema, userTSchema } from "../services/authService";

export const authPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.post("/authenticate", { schema: authenticateTSchema }, async (request) => {
    return request.services.auth.authenticate(request.body);
  });

  fastify.post("/refresh-token", { schema: refreshTokenTSchema }, async (request) => {
    return request.services.auth.refreshToken(request.body.refreshToken);
  });

  fastify.post("/create-user", { schema: createUserTSchema }, async (request) => {
    return request.services.auth.createUser(request.body);
  });

  fastify.post("/login-user", { schema: loginTSchema }, async (request) => {
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

export const authenticateTSchema = {
  body: Type.Object({
    code: Type.String(),
  }),
  response: {
    200: Type.Object({ tokens: keycloakTokenResponseTSchema, user: userTSchema }),
  },
};

export const refreshTokenTSchema = {
  body: Type.Object({
    refreshToken: Type.String(),
  }),
  response: { 200: authTSchema },
};
