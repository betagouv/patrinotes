import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { db } from "../db/db";
import { generatePresignedUrl } from "../services/uploadService";
import { createAttachmentRedirection } from "../features/attachmentRedirection";
import { getGroupedStateReportMailName } from "@patrinotes/pdf/constat";
import { sendStateReportMail, sendValidationResultMail } from "../features/mail";
import { v4 } from "uuid";
import { AppError } from "../features/errors";
import { publicRateLimit } from "../features/rateLimit";

const optionalString = Type.Optional(Type.Union([Type.String(), Type.Null()]));

/**
 * Pending: the constat and its PDF, for the validator to decide. Once accepted or declined, only the decision and its
 * date (SEC-08): the link stays in the validator's mailbox, it must not give access to the constat anymore.
 */
const validationInfoTSchema = Type.Object({
  stateReport: Type.Optional(
    Type.Object({
      id: optionalString,
      titre_edifice: optionalString,
      commune: optionalString,
      date_visite: optionalString,
    }),
  ),
  pdfUrl: Type.Optional(Type.String()),
  status: optionalString,
  decidedAt: optionalString,
});

const isDecided = (validation: { status: string }) => validation.status !== "pending";

export const validationPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  // public pages opened from the validator's email: limited per IP
  fastify.addHook("onRequest", publicRateLimit);

  fastify.get(
    "/constat-validation/:token",
    {
      schema: {
        params: Type.Object({ token: Type.String() }),
        // Fastify 4 reads an empty schema such as Type.Any() as an object without properties and sent `{}`
        response: { 200: validationInfoTSchema },
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
        throw new AppError(404, "Lien de validation introuvable");
      }

      if (isDecided(validation)) {
        return { status: validation.status, decidedAt: validation.decided_at };
      }

      if (new Date(validation.token_expires_at) < new Date()) {
        throw new AppError(410, "Ce lien de validation a expiré");
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
        throw new AppError(404, "Lien de validation introuvable");
      }
      // the PDF is only shown to the validator while the decision is pending (SEC-08)
      if (isDecided(validation)) {
        throw new AppError(410, "Ce constat a déjà été traité");
      }
      if (new Date(validation.token_expires_at) < new Date()) {
        throw new AppError(410, "Ce lien de validation a expiré");
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
        throw new AppError(404, "Lien invalide ou déjà traité");
      }

      if (new Date(validation.token_expires_at) < new Date()) {
        throw new AppError(410, "Ce lien de validation a expiré");
      }

      await db.transaction().execute(async (trx) => {
        await trx
          .updateTable("constat_validation")
          .set({ status: "accepted", comment: comment ?? null, decided_at: new Date().toISOString() })
          .where("token", "=", token)
          .execute();

        await trx
          .updateTable("state_report")
          .set({ validation_status: "accepted", attachment_id: validation.pdf_path })
          .where((eb) =>
            eb.or([eb("id", "=", validation.state_report_id!), eb("attachment_id", "=", validation.pdf_path)]),
          )
          .execute();
      });

      const groupedReports = await getValidationReports(validation);

      const stateReport = await db
        .selectFrom("state_report")
        .leftJoin("user", "user.id", "state_report.created_by")
        .selectAll(["state_report"])
        .select(["user.email as creatorEmail", "user.name as createdByName"])
        .where("state_report.id", "=", validation.state_report_id!)
        .executeTakeFirst();

      if (stateReport) {
        // Same 90-day short link as a direct send, as announced in the email.
        const pdfUrl = await createAttachmentRedirection({
          s3Key: "attachment/" + validation.pdf_path,
          createdBy: stateReport.created_by ?? "",
          sentTo: validation.recipients,
          name: getGroupedStateReportMailName(groupedReports ?? [stateReport]),
        });

        await sendStateReportMail({
          recipients: validation.recipients,
          pdfUrl,
          stateReport,
          groupedReports,
          user: { name: stateReport.createdByName ?? "", email: stateReport.creatorEmail ?? "" } as any,
        });

        for (const recipient of validation.recipients.split(",").map((r) => r.trim())) {
          for (const report of groupedReports ?? [stateReport]) {
            await db
              .insertInto("state_report_sent_email")
              .values({
                id: v4(),
                state_report_id: report.id,
                sent_to: recipient,
                sent_at: new Date().toISOString(),
                service_id: validation.service_id ?? stateReport.service_id,
              })
              .execute();
          }
        }

        if (stateReport.creatorEmail) {
          await sendValidationResultMail({
            creatorEmail: stateReport.creatorEmail,
            stateReport,
            groupedReports,
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
        throw new AppError(404, "Lien invalide ou déjà traité");
      }

      if (new Date(validation.token_expires_at) < new Date()) {
        throw new AppError(410, "Ce lien de validation a expiré");
      }

      await db.transaction().execute(async (trx) => {
        await trx
          .updateTable("constat_validation")
          .set({ status: "declined", comment, decided_at: new Date().toISOString() })
          .where("token", "=", token)
          .execute();

        await trx
          .updateTable("state_report")
          .set({ validation_status: "declined" })
          .where((eb) =>
            eb.or([eb("id", "=", validation.state_report_id!), eb("attachment_id", "=", validation.pdf_path)]),
          )
          .execute();
      });

      const groupedReports = await getValidationReports(validation);

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
          groupedReports,
          accepted: false,
          comment,
          validatorEmail: validation.validator_email,
        });
      }

      return { message: "Constat refusé" };
    },
  );
};

/** Rapport groupé: the constats sent in the validated PDF (undefined for a simple constat). */
const getValidationReports = async (validation: { state_report_id: string | null; pdf_path: string }) => {
  const reports = await db
    .selectFrom("state_report")
    .selectAll()
    .where("attachment_id", "=", validation.pdf_path)
    .orderBy("created_at", "asc")
    .execute();
  return reports.length > 1 ? reports : undefined;
};
