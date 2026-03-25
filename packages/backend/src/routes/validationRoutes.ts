import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { db } from "../db/db";
import { generatePresignedUrl } from "../services/uploadService";
import { sendStateReportMail, sendValidationResultMail } from "../features/mail";
import { v4 } from "uuid";

export const validationPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.get(
    "/constat-validation/:token",
    {
      schema: {
        params: Type.Object({ token: Type.String() }),
        response: { 200: Type.Any() },
      },
    },
    async (request) => {
      const { token } = request.params;

      const validation = await db
        .selectFrom("constat_validation")
        .where("token", "=", token)
        .selectAll()
        .executeTakeFirst();

      if (!validation) {
        throw { statusCode: 404, message: "Lien de validation introuvable" };
      }

      if (new Date(validation.token_expires_at) < new Date() && validation.status === "pending") {
        throw { statusCode: 410, message: "Ce lien de validation a expiré" };
      }

      const stateReport = await db
        .selectFrom("state_report")
        .where("id", "=", validation.state_report_id!)
        .selectAll()
        .executeTakeFirst();

      const pdfUrl = await generatePresignedUrl("attachment/" + validation.pdf_path);

      return {
        stateReport: {
          id: stateReport?.id,
          titre_edifice: stateReport?.titre_edifice,
          commune: stateReport?.commune,
          date_visite: stateReport?.date_visite,
        },
        pdfUrl,
        status: validation.status,
        comment: validation.comment,
      };
    },
  );

  fastify.get(
    "/constat-validation/:token/pdf",
    {
      schema: {
        params: Type.Object({ token: Type.String() }),
      },
    },
    async (request, reply) => {
      const { token } = request.params;

      const validation = await db
        .selectFrom("constat_validation")
        .where("token", "=", token)
        .selectAll()
        .executeTakeFirst();

      if (!validation) {
        throw { statusCode: 404, message: "Lien de validation introuvable" };
      }

      if (new Date(validation.token_expires_at) < new Date() && validation.status === "pending") {
        throw { statusCode: 410, message: "Ce lien de validation a expiré" };
      }

      const pdfBuffer = await request.services.upload.getAttachment({ filePath: validation.pdf_path });

      reply.header("Content-Type", "application/pdf");
      return reply.send(pdfBuffer);
    },
  );

  fastify.post(
    "/constat-validation/:token/accept",
    {
      schema: {
        params: Type.Object({ token: Type.String() }),
        body: Type.Object({ comment: Type.Optional(Type.String()) }),
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (request) => {
      const { token } = request.params;
      const { comment } = request.body;

      const validation = await db
        .selectFrom("constat_validation")
        .where("token", "=", token)
        .where("status", "=", "pending")
        .selectAll()
        .executeTakeFirst();

      if (!validation) {
        throw { statusCode: 404, message: "Lien invalide ou déjà traité" };
      }

      if (new Date(validation.token_expires_at) < new Date()) {
        throw { statusCode: 410, message: "Ce lien de validation a expiré" };
      }

      await db
        .updateTable("constat_validation")
        .set({ status: "accepted", comment: comment ?? null })
        .where("token", "=", token)
        .execute();

      const stateReport = await db
        .selectFrom("state_report")
        .leftJoin("user", "user.id", "state_report.created_by")
        .selectAll(["state_report"])
        .select(["user.email as creatorEmail", "user.name as createdByName"])
        .where("state_report.id", "=", validation.state_report_id!)
        .executeTakeFirst();

      if (stateReport) {
        const pdfBuffer = await request.services.upload.getAttachment({ filePath: validation.pdf_path });

        await sendStateReportMail({
          recipients: validation.recipients,
          pdfBuffer,
          stateReport,
          user: { name: stateReport.createdByName ?? "", email: stateReport.creatorEmail ?? "" } as any,
        });

        for (const recipient of validation.recipients.split(",").map((r) => r.trim())) {
          await db
            .insertInto("state_report_sent_email")
            .values({
              id: v4(),
              state_report_id: stateReport.id,
              sent_to: recipient,
              sent_at: new Date().toISOString(),
              service_id: validation.service_id ?? stateReport.service_id,
            })
            .execute();
        }

        if (stateReport.creatorEmail) {
          await sendValidationResultMail({
            creatorEmail: stateReport.creatorEmail,
            stateReport,
            accepted: true,
            comment,
            validatorEmail: validation.validator_email,
          });
        }
      }

      return { message: "Constat accepté et envoyé aux destinataires" };
    },
  );

  fastify.post(
    "/constat-validation/:token/decline",
    {
      schema: {
        params: Type.Object({ token: Type.String() }),
        body: Type.Object({ comment: Type.String() }),
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (request) => {
      const { token } = request.params;
      const { comment } = request.body;

      const validation = await db
        .selectFrom("constat_validation")
        .where("token", "=", token)
        .where("status", "=", "pending")
        .selectAll()
        .executeTakeFirst();

      if (!validation) {
        throw { statusCode: 404, message: "Lien invalide ou déjà traité" };
      }

      if (new Date(validation.token_expires_at) < new Date()) {
        throw { statusCode: 410, message: "Ce lien de validation a expiré" };
      }

      await db
        .updateTable("constat_validation")
        .set({ status: "declined", comment })
        .where("token", "=", token)
        .execute();

      const stateReport = await db
        .selectFrom("state_report")
        .leftJoin("user", "user.id", "state_report.created_by")
        .selectAll(["state_report"])
        .select(["user.email as creatorEmail"])
        .where("state_report.id", "=", validation.state_report_id!)
        .executeTakeFirst();

      if (stateReport?.creatorEmail) {
        await sendValidationResultMail({
          creatorEmail: stateReport.creatorEmail,
          stateReport,
          accepted: false,
          comment,
          validatorEmail: validation.validator_email,
        });
      }

      return { message: "Constat refusé" };
    },
  );
};
