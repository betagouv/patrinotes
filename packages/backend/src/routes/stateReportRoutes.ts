import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { makeDebug } from "../features/debug";
import { authenticate } from "./authMiddleware";
import { Nullable } from "../services/syncService";

const debug = makeDebug("state-report-plugin");

export const stateReportPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/objets-images", { schema: objetsImagesPdfSchema }, async (request, reply) => {
    const { references } = request.query;
    const images = await request.services.stateReport.getImagesForObjets(references.split(","));
    return images;
  });
};

const imageTSchema = Type.Object({
  id: Type.String(),
  reference: Nullable(Type.String()),
  url: Nullable(Type.String()),
  dept_number: Nullable(Type.String()),
  label: Nullable(Type.String()),
  copyright: Nullable(Type.String()),
});

export const objetsImagesPdfSchema = {
  querystring: Type.Object({
    references: Type.String(),
  }),
  response: { 200: Type.Array(imageTSchema) },
};
