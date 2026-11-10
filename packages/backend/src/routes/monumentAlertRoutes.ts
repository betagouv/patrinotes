import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { deserializeMandatoryEmails } from "@patrinotes/pdf/utils";
import { db } from "../db/db";
import { AppError } from "../features/errors";
import { sendMonumentAlertEmail } from "../features/mail";
import { makeDebug } from "../features/debug";
import { sentry } from "../features/sentry";
import { authenticate } from "./authMiddleware";

const debug = makeDebug("monument-alert");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Recipients of an alert: its mandatory services' emails and the additional ones, deduplicated. */
export const getMonumentAlertRecipients = (alert: {
  mandatory_emails: string | null;
  additional_emails: string | null;
}) => {
  const mandatory = deserializeMandatoryEmails(alert.mandatory_emails ?? "").map((e) => e.email);
  const additional = (alert.additional_emails ?? "").split(",");
  return Array.from(
    new Set([...mandatory, ...additional].map((email) => email.trim().toLowerCase()).filter((e) => emailPattern.test(e))),
  );
};

/**
 * Alerts and annotations made from a fiche are written offline through PowerSync; once the row and its photos are
 * uploaded, the client asks the server to email it. Sending is claimed with `sent_at`, so a retry never sends twice.
 */
export const monumentAlertPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.addHook("preHandler", authenticate);

  fastify.post("/send", { schema: sendMonumentAlertSchema }, async (request) => {
    const user = request.user!;
    const { id } = request.body;

    const alert = await db.selectFrom("monument_alert").selectAll().where("id", "=", id).executeTakeFirst();
    // not uploaded yet: the client will try again
    if (!alert) return { status: "pending" as const };
    if (!user.service_id || alert.service_id !== user.service_id) throw new AppError(403, "Accès non autorisé");
    if (alert.status !== "submitted") return { status: "pending" as const };
    if (!alert.should_send) return { status: "not_sent" as const };
    if (alert.sent_at) return { status: "sent" as const, sentAt: alert.sent_at };

    const recipients = getMonumentAlertRecipients(alert);
    if (!recipients.length) throw new AppError(400, "Aucun destinataire valide pour cette alerte");

    const attachments = await db
      .selectFrom("monument_alert_attachment")
      .selectAll()
      .where("monument_alert_id", "=", id)
      .where((eb) => eb.or([eb("is_deprecated", "is", null), eb("is_deprecated", "=", false)]))
      .execute();

    // photos are uploaded by the attachment queue, independently: wait until every one is stored
    const { upload } = request.services;
    for (const attachment of attachments) {
      try {
        await upload.getAttachmentSize({ filePath: attachment.attachment_id });
      } catch (error) {
        if (error instanceof AppError && error.status === 404) return { status: "pending" as const };
        throw error;
      }
    }

    const sentAt = new Date().toISOString();
    const claimed = await db
      .updateTable("monument_alert")
      .set({ sent_at: sentAt })
      .where("id", "=", id)
      .where("sent_at", "is", null)
      .returning("id")
      .executeTakeFirst();
    // sent meanwhile by another request
    if (!claimed) return { status: "sent" as const, sentAt };

    try {
      await sendMonumentAlertEmail({ to: recipients.join(","), alert: { ...alert, sent_at: sentAt }, attachments, user });
      debug(`Monument alert ${id} sent to ${recipients.join(",")}`);
    } catch (error) {
      await db.updateTable("monument_alert").set({ sent_at: null }).where("id", "=", id).execute();
      sentry?.captureException(error, { extra: { monumentAlertId: id } });
      throw error;
    }

    return { status: "sent" as const, sentAt };
  });
};

export const sendMonumentAlertSchema = {
  body: Type.Object({ id: Type.String() }),
  response: {
    200: Type.Object({
      status: Type.Union([Type.Literal("sent"), Type.Literal("pending"), Type.Literal("not_sent")]),
      sentAt: Type.Optional(Type.String()),
    }),
  },
};
