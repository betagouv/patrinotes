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
import { getGroupedStateReportMailName, getStateReportMailName } from "@patrinotes/pdf/constat";
import { AppError } from "../features/errors";
import { randomInt } from "crypto";
import base62 from "base62";
import { ENV } from "../envVars";
import { sentry } from "../features/sentry";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parseHTML } from "linkedom";
import { getPDFInMailName } from "@patrinotes/pdf";
import { canEditReport, canEditStateReport, findReport, findStateReport } from "../features/sync/syncPolicy";

const debug = makeDebug("pdf-plugin");

/** A document not synced yet may get an upload URL; a stored one only for whoever may edit it. */
const assertCanEditReportIfStored = async (user: { id: string; service_id: string }, reportId: string) => {
  const report = await findReport(db, reportId);
  if (report && !(await canEditReport(db, user, report)))
    throw new AppError(403, "Vous ne pouvez pas modifier ce compte-rendu");
};

const assertCanEditStateReportIfStored = async (user: { id: string; service_id: string }, stateReportId: string) => {
  const stateReport = await findStateReport(db, stateReportId);
  if (stateReport && !(await canEditStateReport(db, user, stateReport))) {
    throw new AppError(403, "Vous ne pouvez pas modifier ce constat");
  }
};

const assertPdfPathOf = (pdfPath: string, documentId: string) => {
  if (!pdfPath.startsWith(documentId + "/") || pdfPath.includes(".."))
    throw new AppError(400, "Chemin du PDF invalide");
};

const createAttachmentRedirection = async ({
  s3Key,
  createdBy,
  sentTo,
  name,
}: {
  s3Key: string;
  createdBy: string;
  sentTo: string;
  name?: string;
}) => {
  const id = base62.encode(randomInt(1, 281474976710655));
  await db
    .insertInto("attachment_redirection")
    .values({ id, s3_key: s3Key, created_at: new Date().toISOString(), created_by: createdBy, sent_to: sentTo, name })
    .execute();
  return `${ENV.BACKEND_URL}/attachment/${id}${name ? `/${name}` : ""}`;
};

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
      await assertCanEditReportIfStored(request.user!, reportId);
      const pdfPath = reportId + "/compte_rendu_" + Math.round(Date.now() / 1000) + ".pdf";
      const uploadUrl = await request.services.upload.getPresignedUploadUrl({
        filePath: pdfPath,
        contentType: "application/pdf",
      });
      return { uploadUrl, pdfPath };
    },
  );

  fastify.post(
    "/state-report/log-download",
    {
      schema: {
        body: Type.Object({ stateReportId: Type.String() }),
        response: { 200: Type.Object({ ok: Type.Boolean() }) },
      },
    },
    async (request) => {
      const { stateReportId } = request.body;
      await db
        .insertInto("constat_pdf_download")
        .values({
          id: v4(),
          user_id: request.user.id,
          state_report_id: stateReportId,
          created_at: new Date().toISOString(),
        })
        .execute();
      return { ok: true };
    },
  );

  fastify.post(
    "/state-report/share-link",
    {
      schema: {
        body: Type.Object({ stateReportId: Type.String(), pdfPath: Type.String() }),
        response: { 200: Type.Object({ url: Type.String() }) },
      },
    },
    async (request) => {
      const { stateReportId, pdfPath } = request.body;

      if (!pdfPath.startsWith(stateReportId + "/")) {
        throw new AppError(400, "Chemin du PDF invalide");
      }

      const stateReport = await db
        .selectFrom("state_report")
        .where("id", "=", stateReportId)
        .selectAll()
        .executeTakeFirst();
      if (!stateReport) throw new AppError(404, "Constat d'état non trouvé");

      if (stateReport.service_id !== request.user!.service_id) {
        const canAccess =
          !!stateReport.reference_pop &&
          (await request.services.stateReport.canServiceAccessMonument(
            stateReport.reference_pop,
            request.user!.service?.dept_numbers,
          ));
        if (!canAccess) throw new AppError(403, "Accès non autorisé à ce constat");
      }

      const url = await createAttachmentRedirection({
        s3Key: "attachment/" + pdfPath,
        createdBy: request.user!.id,
        sentTo: "",
        name: getStateReportMailName({ titre_edifice: stateReport.titre_edifice }),
      });

      return { url };
    },
  );

  fastify.post("/report", { schema: reportPdfTSchema }, async (request) => {
    const { reportId, pdfPath, pdfSize, recipients: rawRecipients } = request.body;
    const { service_id } = request.user!;

    assertPdfPathOf(pdfPath, reportId);
    if (!(await canEditReport(db, request.user!, await findReport(db, reportId)))) {
      throw new AppError(403, "Vous ne pouvez pas envoyer ce compte-rendu");
    }

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
      await tx
        .updateTable("report")
        .set({ attachment_id: pdfPath, pdf_size: pdfSize ?? null })
        .where("id", "=", reportId)
        .execute();
    });

    const userMail = request.user!.email;
    const recipients = rawRecipients
      .replaceAll(";", ",")
      .split(",")
      .map((r) => r.trim());
    if (!recipients.includes(userMail)) recipients.push(userMail);

    const reportsQuery = await db.selectFrom("report").where("id", "=", reportId).selectAll().execute();
    const report = reportsQuery[0] as Selectable<Database["report"]>;

    const pdfMailUrl = await createAttachmentRedirection({
      s3Key: "attachment/" + pdfPath,
      createdBy: request.user.id,
      sentTo: recipients.join(","),
      name: getPDFInMailName(report),
    });

    await sendReportMail({ recipients: recipients.join(","), pdfUrl: pdfMailUrl, report: report! });

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
      const report = await findReport(db, reportId);
      if (!report) throw new AppError(404, "Compte-rendu non trouvé");
      if (report.service_id !== request.user!.service_id)
        throw new AppError(403, "Accès non autorisé à ce compte-rendu");
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

      // A constat from another service can only be downloaded if it belongs to the same
      // historic monument as one of the caller's service departments.
      if (stateReport.service_id !== request.user!.service_id) {
        const canAccess =
          !!stateReport.reference_pop &&
          (await request.services.stateReport.canServiceAccessMonument(
            stateReport.reference_pop,
            request.user!.service?.dept_numbers,
          ));
        if (!canAccess) throw new AppError(403, "Accès non autorisé à ce constat");
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
      await assertCanEditStateReportIfStored(request.user!, stateReportId);
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
    assertPdfPathOf(pdfPath, stateReportId);
    if (!(await canEditStateReport(db, user, stateReportQuery))) {
      throw new AppError(403, "Vous ne pouvez pas envoyer ce constat");
    }

    // rapport groupé (MH complexe): the PDF holds every constat of the rapport, all of them are sent with it
    const groupedReports = await getGroupedStateReports({
      principal: stateReportQuery,
      stateReportIds: request.body.stateReportIds,
      serviceId: user.service_id,
    });
    const isGrouped = groupedReports.length > 1;

    await db.transaction().execute(async (tx) => {
      for (const report of groupedReports) {
        await tx
          .insertInto("state_report_attachment")
          .values({
            id: report.id === stateReportId ? pdfPath : `${pdfPath}#${report.id}`,
            attachment_id: pdfPath,
            is_deprecated: false,
            state_report_id: report.id,
            created_at: new Date().toISOString(),
            service_id: user.service_id,
          })
          .execute();
      }

      await tx
        .updateTable("state_report")
        .set({
          attachment_id: pdfPath,
          pdf_size: request.body.pdfSize ?? null,
          // A declined group may be sent again without validation; clear the old decline in either send path.
          validation_status: null,
        })
        .where(
          "id",
          "in",
          groupedReports.map((r) => r.id),
        )
        .where((eb) => eb.or([eb("attachment_id", "is", null), eb("validation_status", "=", "declined")]))
        .executeTakeFirst()
        .then((result) => {
          if (Number(result.numUpdatedRows) !== groupedReports.length) {
            throw new AppError(409, "Un ou plusieurs constats du rapport ont déjà été envoyés");
          }
        });
    });

    const pdfName = getGroupedStateReportMailName(groupedReports);

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

    // a constat's alerts are sent once; in a rapport groupé, each alert is sent with its own constat
    const reportsById = new Map(groupedReports.map((r) => [r.id, r]));
    const alertsToSend = alerts?.length
      ? await db
          .selectFrom("state_report_alert")
          .select(["id", "state_report_id"])
          .where(
            "id",
            "in",
            alerts.map((a) => a.id),
          )
          .execute()
      : [];
    const alertReportIds = new Map(alertsToSend.map((a) => [a.id, a.state_report_id]));
    // an alert not uploaded yet by the client belongs to the constat being sent, as before rapports groupés
    const getAlertReport = (alertId: string) =>
      alertReportIds.has(alertId) ? (reportsById.get(alertReportIds.get(alertId)!) ?? null) : stateReportQuery;
    const unsentAlerts = (alerts || []).filter((alert) => {
      const report = getAlertReport(alert.id);
      return !!report && !report.alerts_sent;
    });

    if (unsentAlerts.length > 0) {
      const alertsAttachmentsQuery = await db
        .selectFrom("state_report_alert_attachment")
        .selectAll()
        .where(
          "state_report_alert_id",
          "in",
          unsentAlerts.map((a) => a.id),
        )
        .where("is_deprecated", "=", false)
        .where("is_ignored", "=", false)
        .execute();

      for (const alert of unsentAlerts) {
        if (!alert.should_send) continue;
        const alertStateReport = getAlertReport(alert.id)! as Selectable<Database["state_report"]>;

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
            stateReport: alertStateReport,
            alert: { ...alert, attachments: alertAttachments as any[], should_send: 1 },
            user,
          });

          debug(`Alert email sent for alert ${alert.id} to ${alertRecipients.join(",")}`);
        } catch (alertError) {
          sentry?.captureException(alertError, { extra: { alertId: alert.id } });
          console.error(`Failed to send alert email for alert ${alert.id}:`, alertError);
        }
      }

      await db
        .updateTable("state_report")
        .set({ alerts_sent: true })
        .where("id", "in", Array.from(new Set(unsentAlerts.map((a) => getAlertReport(a.id)!.id))))
        .execute();
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
        .where(
          "id",
          "in",
          groupedReports.map((r) => r.id),
        )
        .execute();

      await sendValidationRequestMail({
        validatorEmail: userSettingsResult.validation_email,
        stateReport,
        groupedReports: isGrouped ? groupedReports : undefined,
        validationToken: token,
        creatorName: user.name,
      });

      const url = await createAttachmentRedirection({
        s3Key: "attachment/" + pdfPath,
        createdBy: user.id,
        sentTo: userSettingsResult.validation_email,
        name: pdfName,
      });
      return url;
    }

    const pdfMailUrl = await createAttachmentRedirection({
      s3Key: "attachment/" + pdfPath,
      createdBy: user.id,
      sentTo: recipients.join(","),
      name: pdfName,
    });
    await sendStateReportMail({
      recipients: recipients.join(","),
      pdfUrl: pdfMailUrl,
      stateReport: stateReport!,
      groupedReports: isGrouped ? groupedReports : undefined,
      user,
    });

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

      for (const report of groupedReports) {
        await db
          .insertInto("state_report_sent_email")
          .values({
            id: report.id === stateReportId ? id : v4(),
            state_report_id: report.id,
            sent_to: recipient,
            sent_at: new Date().toISOString(),
            service_id: user.service_id,
          })
          .execute();
      }

      await db
        .insertInto("suggested_email")
        .values({ id, email: recipient, service_id: user.service_id })
        .execute()
        .catch(() => {});
    }

    const url = await createAttachmentRedirection({
      s3Key: "attachment/" + pdfPath,
      createdBy: user.id,
      sentTo: recipients.join(","),
      name: pdfName,
    });
    return url;
  });
};

type StateReportRow = Selectable<Database["state_report"]> & { createdByName?: string | null };

/**
 * Constats sent in one PDF: the principal one and every active member of its rapport.
 * The client IDs define the chapter order only; membership and sendability are authoritative on the server.
 */
export const getGroupedStateReports = async ({
  principal,
  stateReportIds,
  serviceId,
}: {
  principal: StateReportRow;
  stateReportIds?: string[];
  serviceId: string;
}): Promise<StateReportRow[]> => {
  if (principal.service_id !== serviceId) throw new AppError(403, "Vous ne pouvez pas envoyer ce constat");
  if (principal.attachment_id && principal.validation_status !== "declined") {
    throw new AppError(409, "Ce constat a déjà été envoyé");
  }

  if (!principal.rapport_id) {
    if ((stateReportIds ?? []).some((id) => id !== principal.id)) {
      throw new AppError(400, "Ce constat ne fait pas partie d'un rapport groupé");
    }
    return [principal];
  }

  const members = await db
    .selectFrom("state_report")
    .selectAll()
    .where("rapport_id", "=", principal.rapport_id)
    .where("service_id", "=", serviceId)
    .where((eb) => eb.or([eb("disabled", "=", false), eb("disabled", "is", null)]))
    .execute();

  if (!members.some((member) => member.id === principal.id)) {
    throw new AppError(400, "Le constat ne fait pas partie de ce rapport");
  }

  const requestedIds = Array.from(new Set(stateReportIds ?? []));
  const memberIds = new Set(members.map((member) => member.id));
  if (
    requestedIds.length !== memberIds.size ||
    requestedIds.some((id) => !memberIds.has(id)) ||
    Array.from(memberIds).some((id) => !requestedIds.includes(id))
  ) {
    throw new AppError(409, "Le rapport a changé. Rechargez la page avant de l'envoyer.");
  }

  if (members.some((member) => !!member.attachment_id && member.validation_status !== "declined")) {
    throw new AppError(409, "Un ou plusieurs constats du rapport ont déjà été envoyés");
  }

  const order = new Map(requestedIds.map((id, index) => [id, index]));
  return members.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
};

export const reportPdfTSchema = {
  body: Type.Object({
    pdfPath: Type.String(),
    pdfSize: Type.Optional(Type.Number()),
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
    pdfSize: Type.Optional(Type.Number()),
    stateReportId: Type.String(),
    /** rapport groupé: every constat in the PDF, in chapter order (stateReportId included) */
    stateReportIds: Type.Optional(Type.Array(Type.String())),
    recipients: Type.String(),
    alerts: Type.Optional(Type.Array(AlertSchema)),
  }),
  response: { 200: Type.String() },
};
