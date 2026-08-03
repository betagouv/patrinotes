import type { FastifyPluginAsyncTypebox, Static } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { authenticate } from "./authMiddleware";

export const userPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.post("/change-service", { schema: changeServiceTSchema, preHandler: authenticate }, async (request) => {
    const { service_id } = request.body;
    const { id } = request.user!;
    return request.services.user.changeService(id, service_id);
  });

  fastify.get("/created-at", { schema: getUserCreatedAtTSchema, preHandler: authenticate }, async (request) => {
    const { id } = request.user!;
    const createdAt = await request.services.auth.getUserCreatedAt(id);
    return { createdAt };
  });

  fastify.post("/send-reset-password", { schema: sendResetPasswordTSchema }, async (request) => {
    return request.services.user.generateResetLink(request.body.email) as Promise<{ message: string }>;
  });

  fastify.post("/reset-password", { schema: resetPasswordTSchema }, async (request) => {
    return request.services.user.resetPassword(request.body);
  });
};

export const changeServiceTSchema = {
  body: Type.Object({
    service_id: Type.String(),
  }),
  response: { 200: Type.Object({ message: Type.String() }) },
};

export const sendResetPasswordTSchema = {
  body: Type.Object({ email: Type.String() }),
  response: { 200: Type.Object({ message: Type.String() }) },
};

export const resetPasswordTSchema = {
  body: Type.Object({
    temporaryLink: Type.String(),
    newPassword: Type.String(),
  }),
  response: { 200: Type.Object({ message: Type.String() }) },
};

export const getUserCreatedAtTSchema = {
  response: { 200: Type.Object({ createdAt: Type.Union([Type.String(), Type.Null()]) }) },
};
