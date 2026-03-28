import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { authTSchema, userTSchema } from "../services/authService";

export const authPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.post("/authenticate", { schema: authenticateTSchema }, async (request) => {
    return request.services.auth.authenticate(request.body);
  });

  fastify.post("/refresh-token", { schema: refreshTokenTSchema }, async (request) => {
    return request.services.auth.refreshToken(request.body.refreshToken);
  });
};

export const authenticateTSchema = {
  body: Type.Object({
    code: Type.String(),
    nonce: Type.String(),
    redirectUri: Type.String(),
  }),
  response: { 200: authTSchema },
};

export const refreshTokenTSchema = {
  body: Type.Object({
    refreshToken: Type.String(),
  }),
  response: {
    200: Type.Object({
      accessToken: Type.Union([Type.String(), Type.Null()]),
      refreshToken: Type.Union([Type.String(), Type.Null()]),
      expiresAt: Type.Union([Type.String(), Type.Null()]),
      user: Type.Optional(userTSchema),
    }),
  },
};
