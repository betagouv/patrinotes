import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { makeDebug } from "../features/debug";
import { authenticate } from "./authMiddleware";
import { Nullable } from "../services/syncService";
import { ofetch } from "ofetch";
import { AppError } from "../features/errors";

const debug = makeDebug("state-report-plugin");

export const stateReportPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/objets-images", { schema: objetsImagesPdfSchema }, async (request, reply) => {
    const { references } = request.query;
    const images = await request.services.stateReport.getImagesForObjets(references.split(","));
    return images;
  });

  // proxy for POP's IIIF manifest, which doesn't send CORS headers
  fastify.get("/iiif-manifest", { schema: iiifManifestSchema }, async (request) => {
    const { reference } = request.query;
    try {
      const url = `https://api.pop.culture.gouv.fr/notices/merimee/${encodeURIComponent(reference)}/iiif/manifest`;
      return await ofetch(url, { responseType: "json" });
    } catch (e) {
      debug("failed to fetch iiif manifest", reference, e);
      throw new AppError(404, "Manifest IIIF introuvable");
    }
  });
};

// no response schema: an empty schema gets turned into `{ type: "object" }`,
// which makes the serializer strip every property of the manifest
export const iiifManifestSchema = {
  querystring: Type.Object({
    reference: Type.String(),
  }),
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
