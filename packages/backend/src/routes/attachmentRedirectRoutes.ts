import { Type, type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { db } from "../db/db";
import { generatePresignedUrl, getObjectByKey } from "../services/uploadService";
import { differenceInDays } from "date-fns";

export const attachmentRedirectPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.get(
    "/attachment/:id/:filename?",
    {
      schema: {
        params: Type.Object({ id: Type.String(), filename: Type.Optional(Type.String()) }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const redirection = await db
        .selectFrom("attachment_redirection")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst();

      if (!redirection) {
        return reply.status(404).send({ error: "Lien introuvable" });
      }

      if (differenceInDays(new Date(), new Date(redirection.created_at)) > 90) {
        return reply.status(410).send({ error: "Ce lien a expiré" });
      }

      if (redirection.name) {
        const { buffer, contentType } = await getObjectByKey(redirection.s3_key);
        return reply
          .header("Content-Type", contentType ?? "application/pdf")
          .header("Content-Disposition", `inline; filename="${redirection.name}"`)
          .send(buffer);
      }

      const presignedUrl = await generatePresignedUrl(redirection.s3_key, 3600);
      return reply.redirect(presignedUrl);
    },
  );
};
