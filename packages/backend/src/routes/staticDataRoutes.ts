import type { FastifyPluginAsyncTypebox, Static } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { Nullable } from "../services/syncService";

export const staticDataPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.get("/services", { schema: getServiceTSchema }, async (request) => {
    return request.services.staticData.getServices();
  });
};

export const serviceTSchema = Type.Object({
  id: Type.String(),
  department: Type.String(),
  completeCoords: Nullable(Type.String()),
  visible: Nullable(Type.Boolean()),
  name: Nullable(Type.String()),
  address: Nullable(Type.String()),
  zipCode: Nullable(Type.String()),
  city: Nullable(Type.String()),
  phone: Nullable(Type.String()),
  email: Nullable(Type.String()),
  marianne_text: Nullable(Type.String()),
  drac_text: Nullable(Type.String()),
  dept_numbers: Nullable(Type.String()),
  service_text: Nullable(Type.String()),
  courriel_crmh: Nullable(Type.String()),
  courriel_caoa: Nullable(Type.String()),
  courriel_dreal: Nullable(Type.String()),
  courriel_sra: Nullable(Type.String()),
  courriel_udap: Nullable(Type.String()),
  courriel_ofb: Nullable(Type.String()),
});

export const getServiceTSchema = {
  response: { 200: Type.Array(serviceTSchema) },
};
