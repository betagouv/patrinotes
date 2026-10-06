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

  fastify.get("/previous", { schema: previousConstatsSchema }, async (request) => {
    const { referencePop } = request.query;
    const { stateReport } = request.services;

    const canAccess = await stateReport.canServiceAccessMonument(referencePop, request.user!.service?.dept_numbers);
    if (!canAccess) return [];

    return stateReport.getPreviousConstats(referencePop);
  });
};

const previousConstatTSchema = Type.Object({
  id: Type.String(),
  created_at: Nullable(Type.String()),
  nature_visite: Nullable(Type.String()),
  redacted_by: Nullable(Type.String()),
  titre_edifice: Nullable(Type.String()),
  pdf_size: Nullable(Type.Number()),
  service_id: Nullable(Type.String()),
  service_name: Nullable(Type.String()),
});

export const previousConstatsSchema = {
  querystring: Type.Object({
    referencePop: Type.String(),
  }),
  response: { 200: Type.Array(previousConstatTSchema) },
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
