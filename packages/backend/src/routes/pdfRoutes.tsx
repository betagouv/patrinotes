import { Type, type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticate } from "./authMiddleware";
import { Database, db } from "../db/db";
import { sendReportMail, sendStateReportMail, sendAlertEmail, sendValidationRequestMail } from "../features/mail";
import { addDays } from "date-fns";
import { generatePresignedUrl } from "../services/uploadService";
import { Service } from "../../../frontend/src/db/AppSchema";
import { makeDebug } from "../features/debug";
import { v4 } from "uuid";
import { Selectable } from "kysely";
import { getServices } from "../services/services";
import { deserializeMandatoryEmails } from "@patrinotes/pdf/utils";
import { AppError } from "../features/errors";

const debug = makeDebug("pdf-plugin");

export const pdfPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.addHook("preHandler", authenticate);

  fastify.post(
    "/report/upload-url",
    {
      schema: {
        body: Type.Object({ reportId: Type.String() }),
        response: {
          200: Type.Object({ uploadUrl: Type.String(), pdfPath: Type.String() }),
        },
      },
    },
    async (request) => {
      const { reportId } = request.body;
      const pdfPath = reportId + "/compte_rendu_" + Math.round(Date.now() / 1000) + ".pdf";
      const uploadUrl = await request.services.upload.getPresignedUploadUrl({
        filePath: pdfPath,
        contentType: "application/pdf",
      });
      return { uploadUrl, pdfPath };
    },
  );

  fastify.post("/report", { schema: reportPdfTSchema }, async (request) => {
    const { reportId, pdfPath, recipients: rawRecipients } = request.body;
    const { service_id } = request.user!;

    const pdf = await request.services.upload.getAttachment({ filePath: pdfPath });

    await db.transaction().execute(async (tx) => {
      await tx
        .insertInto("report_attachment")
        .values({
          id: pdfPath,
          attachment_id: pdfPath,
          is_deprecated: false,
          report_id: reportId,
          created_at: new Date().toISOString(),
          service_id,
        })
        .execute();
      await tx.updateTable("report").set({ attachment_id: pdfPath }).where("id", "=", reportId).execute();
    });

    const userMail = request.user!.email;
    const recipients = rawRecipients
      .replaceAll(";", ",")
      .split(",")
      .map((r) => r.trim());
    if (!recipients.includes(userMail)) recipients.push(userMail);

    const reportsQuery = await db.selectFrom("report").where("id", "=", reportId).selectAll().execute();
    const report = reportsQuery[0] as Selectable<Database["report"]>;
    await sendReportMail({ recipients: recipients.join(","), pdfBuffer: pdf, report: report! });

    for (const recipient of recipients) {
      const id = v4();

      await db
        .insertInto("sent_email")
        .values({ id, report_id: reportId, sent_to: recipient, sent_at: new Date().toISOString(), service_id })
        .execute();

      await db
        .insertInto("suggested_email")
        .values({ id, email: recipient, service_id })
        .execute()
        .catch(() => {});
    }

    return await generatePresignedUrl("attachment/" + pdfPath);
  });

  fastify.get(
    "/report",
    {
      schema: {
        querystring: Type.Object({ reportId: Type.String() }),
        response: { 200: Type.Any() },
      },
    },
    async (request) => {
      const { reportId } = request.query;
      const buffer = await request.services.upload.getReportPDF({ reportId });

      return buffer.toString("base64");
    },
  );

  fastify.get(
    "/state-report",
    {
      schema: {
        querystring: Type.Object({ stateReportId: Type.String() }),
        response: { 200: Type.Any() },
      },
    },
    async (request) => {
      const { stateReportId } = request.query;
      const stateReport = await db
        .selectFrom("state_report")
        .where("id", "=", stateReportId)
        .selectAll()
        .executeTakeFirst();
      if (!stateReport || !stateReport.attachment_id) {
        throw new Error("State report or attachment not found");
      }

      const buffer = await request.services.upload.getAttachment({ filePath: stateReport.attachment_id });

      return buffer.toString("base64");
    },
  );

  fastify.post(
    "/state-report/upload-url",
    {
      schema: {
        body: Type.Object({ stateReportId: Type.String() }),
        response: {
          200: Type.Object({ uploadUrl: Type.String(), pdfPath: Type.String() }),
        },
      },
    },
    async (request) => {
      const { stateReportId } = request.body;
      const pdfPath = stateReportId + "/constat_d_etat_" + Math.round(Date.now() / 1000) + ".pdf";
      const uploadUrl = await request.services.upload.getPresignedUploadUrl({
        filePath: pdfPath,
        contentType: "application/pdf",
      });
      return { uploadUrl, pdfPath };
    },
  );

  fastify.post("/state-report", { schema: stateReportPdfTSchema }, async (request) => {
    const user = request.user!;
    const { stateReportId, pdfPath, alerts, needValidation } = request.body;

    debug(`Sending PDF for state report ${stateReportId} by user ${user.id}`);

    const stateReportQuery = await db
      .selectFrom("state_report")
      .leftJoin("user", "user.id", "state_report.created_by")
      .selectAll(["state_report"])
      .select(["user.name as createdByName"])
      .where("state_report.id", "=", stateReportId)
      .limit(1)
      .executeTakeFirst();

    if (!stateReportQuery) {
      throw new AppError(404, "Constat d'état non trouvé");
    }

    const pdf = await request.services.upload.getAttachment({ filePath: pdfPath }).catch((error) => {
      debug(`Failed to retrieve PDF from storage for state report ${stateReportId}: ${error}`);
      throw new AppError(500, "Le PDF n'a pas pu être récupéré depuis le stockage. Veuillez réessayer.");
    });

    await db.transaction().execute(async (tx) => {
      await tx
        .insertInto("state_report_attachment")
        .values({
          id: pdfPath,
          attachment_id: pdfPath,
          is_deprecated: false,
          state_report_id: stateReportId,
          created_at: new Date().toISOString(),
          service_id: user.service_id,
        })
        .execute();

      await tx.updateTable("state_report").set({ attachment_id: pdfPath }).where("id", "=", stateReportId).execute();
    });

    const userMail = user.email;
    const recipients = request.body.recipients
      .replaceAll(";", ",")
      .split(",")
      .map((r) => r.trim())
      .map((r) => r.toLowerCase());
    if (!recipients.includes(userMail.toLowerCase())) recipients.push(userMail.toLowerCase());

    const stateReport = stateReportQuery as Selectable<Database["state_report"]>;

    const userSettingsResult = await db
      .selectFrom("user_settings")
      .where("user_id", "=", user.id)
      .where("service_id", "=", user.service_id)
      .selectAll()
      .executeTakeFirst();

    const alertsAlreadySent = !!stateReportQuery?.alerts_sent;

    if (!alertsAlreadySent && alerts && alerts.length > 0) {
      const alertsAttachmentsQuery = await db
        .selectFrom("state_report_alert_attachment")
        .selectAll()
        .where(
          "state_report_alert_id",
          "in",
          alerts.map((a) => a.id),
        )
        .where("is_deprecated", "=", false)
        .where("is_ignored", "=", false)
        .execute();

      for (const alert of alerts) {
        if (!alert.should_send) continue;

        try {
          const mandatoryEmails = deserializeMandatoryEmails(alert.mandatory_emails || "");
          const additionalEmails = alert.additional_emails
            ? alert.additional_emails.split(",").map((e) => e.trim().toLowerCase())
            : [];

          const alertRecipients = Array.from(
            new Set([...mandatoryEmails.map((e) => e.email.toLowerCase()), ...additionalEmails]),
          );

          const alertAttachments = alertsAttachmentsQuery.filter((a) => a.state_report_alert_id === alert.id);

          await sendAlertEmail({
            to: alertRecipients.join(","),
            stateReport: stateReport!,
            alert: { ...alert, attachments: alertAttachments as any[], should_send: 1 },
            user,
          });

          debug(`Alert email sent for alert ${alert.id} to ${alertRecipients.join(",")}`);
        } catch (alertError) {
          debug(`Failed to send alert email for alert ${alert.id}: ${alertError}`);
          console.error(`Failed to send alert email for alert ${alert.id}:`, alertError);
        }
      }

      await db.updateTable("state_report").set({ alerts_sent: true }).where("id", "=", stateReportId).execute();
    }

    if (needValidation && userSettingsResult?.validation_enabled && userSettingsResult?.validation_email) {
      const token = v4();
      await db
        .insertInto("constat_validation")
        .values({
          id: v4(),
          state_report_id: stateReportId,
          token,
          token_expires_at: addDays(new Date(), 7).toISOString(),
          validator_email: userSettingsResult.validation_email,
          status: "pending",
          recipients: recipients.join(","),
          pdf_path: pdfPath,
          created_at: new Date().toISOString(),
          service_id: user.service_id,
        })
        .execute();

      await db
        .updateTable("state_report")
        .set({ validation_status: "pending" })
        .where("id", "=", stateReportId)
        .execute();

      await sendValidationRequestMail({
        validatorEmail: userSettingsResult.validation_email,
        stateReport,
        validationToken: token,
        creatorName: user.name,
      });

      const url = await generatePresignedUrl("attachment/" + pdfPath);
      return url;
    }

    await sendStateReportMail({ recipients: recipients.join(","), pdfBuffer: pdf, stateReport: stateReport!, user });

    // update mandatory emails since they might have been filled before sending
    await db.transaction().execute(async (tx) => {
      for (const alert of alerts || []) {
        if (!alert.should_send) continue;

        await tx
          .updateTable("state_report_alert")
          .set({ mandatory_emails: alert.mandatory_emails })
          .where("id", "=", alert.id)
          .execute();
      }
    });

    for (const recipient of recipients) {
      const id = v4();

      await db
        .insertInto("state_report_sent_email")
        .values({
          id,
          state_report_id: stateReportId,
          sent_to: recipient,
          sent_at: new Date().toISOString(),
          service_id: user.service_id,
        })
        .execute();

      await db
        .insertInto("suggested_email")
        .values({ id, email: recipient, service_id: user.service_id })
        .execute()
        .catch(() => {});
    }

    const url = await generatePresignedUrl("attachment/" + pdfPath);
    return url;
  });
};

export const reportPdfTSchema = {
  body: Type.Object({
    pdfPath: Type.String(),
    reportId: Type.String(),
    recipients: Type.String(),
  }),
  response: { 200: Type.String() },
};

const AlertSchema = Type.Object({
  id: Type.String(),
  alert: Type.Union([Type.String(), Type.Null()]),
  commentaires: Type.Union([Type.String(), Type.Null()]),
  show_in_report: Type.Union([Type.Boolean(), Type.Number(), Type.Null()]),
  mandatory_emails: Type.Union([Type.String(), Type.Null()]),
  additional_emails: Type.Union([Type.String(), Type.Null()]),
  objet_ou_mobilier: Type.Union([Type.String(), Type.Null()]),
  objet_ou_mobilier_name: Type.Union([Type.String(), Type.Null()]),
  probleme: Type.Union([Type.String(), Type.Null()]),
  should_send: Type.Union([Type.Boolean(), Type.Number(), Type.Null()]),
});

export const stateReportPdfTSchema = {
  body: Type.Object({
    needValidation: Type.Optional(Type.Boolean()),
    pdfPath: Type.String(),
    stateReportId: Type.String(),
    recipients: Type.String(),
    alerts: Type.Optional(Type.Array(AlertSchema)),
  }),
  response: { 200: Type.String() },
};
