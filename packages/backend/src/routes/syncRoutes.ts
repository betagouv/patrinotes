import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { crudTSchema } from "../services/syncService";
import { authenticate } from "./authMiddleware";

export const syncPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.addHook("preHandler", authenticate);

  fastify.post("/upload-data", { schema: uploadDataTSchema }, async (request) => {
    return request.services.sync.applyCrud(request.body, request.user!);
  });
};

const uploadDataTSchema = {
  body: crudTSchema,
};
