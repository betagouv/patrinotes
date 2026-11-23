import { sql, type Selectable } from "kysely";
import { db, type Database } from "../db/db";
import { getServices } from "../services/services";
import type { AuthUser } from "../routes/authMiddleware";
import { AppError } from "./errors";
import { makeDebug } from "./debug";
import { sendAlertEmail, sendMonumentAlertEmail } from "./mail";
import { sentry } from "./sentry";
import { assertRecipientLimit, parseRecipients } from "./recipients";
import { getAlertRecipients, getMonumentAlertRecipients } from "./alertRecipients";

const debug = makeDebug("alert-delivery");

/** The job runs every 15 minutes; an alert email is tried at most this many times by the server. */
export const ALERT_DELIVERY_INTERVAL_MS = 15 * 60 * 1000;
export const MAX_SEND_ATTEMPTS = 5;
/** A constat alert whose send was attempted less than this ago may still be in progress (direct send). */
const ATTEMPT_GRACE_MS = 10 * 60 * 1000;
/** A fiche alert whose photos never reach the storage (device lost) is sent with the photos stored after this. */
const MONUMENT_ALERT_PHOTOS_WAIT_MS = 24 * 60 * 60 * 1000;

/** The author of an alert, as the user its email is signed by (name, email, service). */
const getAuthor = async (userId: string | null | undefined): Promise<AuthUser | null> => {
  if (!userId) return null;
  const user = await db.selectFrom("user").selectAll().where("id", "=", userId).executeTakeFirst();
  if (!user) return null;
  const service = await db.selectFrom("service").selectAll().where("id", "=", user.service_id).executeTakeFirst();
  return { ...user, service: service! } as AuthUser;
};

const isMissing = (error: unknown) => error instanceof AppError && error.status === 404;

// --- fiche alerts (DAT-10) ----------------------------------------------------------------------------------------

export type MonumentAlertDelivery = "sent" | "pending" | "not_sent";

/**
 * Emails a fiche alert or annotation once it is submitted and its photos are stored. Called by the author's browser
 * (POST /api/monument-alert/send), when the submitted row arrives through sync, and by the periodic job: whoever comes
 * first claims the send with `sent_at`, so the email leaves once.
 * `sender`: user the email is signed by (the requester for the browser call), the author otherwise.
 */
export const deliverMonumentAlert = async (
  id: string,
  { sender, fromJob = false }: { sender?: AuthUser; fromJob?: boolean } = {},
): Promise<{ status: MonumentAlertDelivery; sentAt?: string }> => {
  const alert = await db.selectFrom("monument_alert").selectAll().where("id", "=", id).executeTakeFirst();
  if (!alert || alert.status !== "submitted") return { status: "pending" };
  if (!alert.should_send) return { status: "not_sent" };
  if (alert.sent_at) return { status: "sent", sentAt: alert.sent_at };

  const recipients = getMonumentAlertRecipients(alert);
  if (!recipients.length) throw new AppError(400, "Aucun destinataire valide pour cette alerte");
  assertRecipientLimit(recipients);

  const user = sender ?? (await getAuthor(alert.created_by));
  if (!user) throw new AppError(404, "Auteur de l'alerte introuvable");

  const allAttachments = await db
    .selectFrom("monument_alert_attachment")
    .selectAll()
    .where("monument_alert_id", "=", id)
    .where((eb) => eb.or([eb("is_deprecated", "is", null), eb("is_deprecated", "=", false)]))
    .execute();

  // photos are uploaded by the attachment queue, independently: wait until every one is stored
  const { upload } = getServices();
  const stored: typeof allAttachments = [];
  for (const attachment of allAttachments) {
    try {
      await upload.getAttachmentSize({ filePath: attachment.attachment_id });
      stored.push(attachment);
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
  }
  const submittedAt = alert.submitted_at ? new Date(alert.submitted_at).getTime() : Date.now();
  const waitedEnough = fromJob && Date.now() - submittedAt > MONUMENT_ALERT_PHOTOS_WAIT_MS;
  if (stored.length < allAttachments.length) {
    if (!waitedEnough) return { status: "pending" };
    sentry?.captureMessage("Alerte de fiche envoyée sans ses photos non reçues", {
      level: "warning",
      extra: { monumentAlertId: id, missing: allAttachments.length - stored.length },
    });
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
  if (!claimed) return { status: "sent", sentAt };

  try {
    await sendMonumentAlertEmail({ to: recipients.join(","), alert: { ...alert, sent_at: sentAt }, attachments: stored, user });
    debug(`Monument alert ${id} sent to ${recipients.length} recipient(s)`);
  } catch (error) {
    await db
      .updateTable("monument_alert")
      .set((eb) => ({ sent_at: null, send_attempts: fromJob ? eb("send_attempts", "+", 1) : eb.ref("send_attempts") }))
      .where("id", "=", id)
      .execute();
    sentry?.captureException(error, { extra: { monumentAlertId: id } });
    throw error;
  }

  return { status: "sent", sentAt };
};

/** After a sync write on a fiche alert: email it from the server, without waiting for the author's browser. */
export const scheduleMonumentAlertDelivery = (id: string) => {
  setImmediate(() => {
    deliverMonumentAlert(id).catch((error) => {
      // the job and the browser will try again
      debug("Could not send monument alert", id, "after sync:", error?.message ?? error);
    });
  });
};

const deliverPendingMonumentAlerts = async () => {
  const pending = await db
    .selectFrom("monument_alert")
    .select(["id", "send_attempts"])
    .where("status", "=", "submitted")
    .where("should_send", "=", true)
    .where("sent_at", "is", null)
    .where("send_attempts", "<", MAX_SEND_ATTEMPTS)
    .execute();

  for (const { id, send_attempts } of pending) {
    try {
      await deliverMonumentAlert(id, { fromJob: true });
    } catch (error) {
      if (send_attempts + 1 >= MAX_SEND_ATTEMPTS) {
        sentry?.captureMessage("Alerte de fiche abandonnée après plusieurs essais d'envoi", {
          level: "error",
          extra: { monumentAlertId: id, attempts: send_attempts + 1 },
        });
      }
      if (!(error instanceof AppError)) continue;
      // a refusal (no recipient, unknown author) will not change: count it as a failed attempt
      await db
        .updateTable("monument_alert")
        .set((eb) => ({ send_attempts: eb("send_attempts", "+", 1) }))
        .where("id", "=", id)
        .execute();
    }
  }
};

// --- constat alerts (DAT-08) --------------------------------------------------------------------------------------

type StateReportAlertRow = Selectable<Database["state_report_alert"]>;
type StateReportRow = Selectable<Database["state_report"]>;

/**
 * Sends one alert of a constat and records it: `send_attempts` and `last_send_attempt_at` before sending, `sent_at`
 * once sent. Returns false when the alert is already sent (or being sent) by someone else.
 * The alert row may not be stored yet (sent with the constat before its sync): it is then sent untracked.
 */
export const sendStateReportAlert = async ({
  alert,
  stateReport,
  user,
}: {
  alert: Pick<StateReportAlertRow, "id" | "mandatory_emails" | "additional_emails"> & Record<string, any>;
  stateReport: StateReportRow;
  user: AuthUser;
}) => {
  const stored = await db
    .selectFrom("state_report_alert")
    .select(["sent_at", "send_attempts"])
    .where("id", "=", alert.id)
    .executeTakeFirst();
  if (stored?.sent_at) return false;

  if (stored) {
    const claimed = await db
      .updateTable("state_report_alert")
      .set({ send_attempts: stored.send_attempts + 1, last_send_attempt_at: new Date().toISOString() })
      .where("id", "=", alert.id)
      .where("sent_at", "is", null)
      .where("send_attempts", "=", stored.send_attempts)
      .returning("id")
      .executeTakeFirst();
    if (!claimed) return false;
  }

  const attachments = await db
    .selectFrom("state_report_alert_attachment")
    .selectAll()
    .where("state_report_alert_id", "=", alert.id)
    .where("is_deprecated", "=", false)
    .where("is_ignored", "=", false)
    .execute();

  const recipients = getAlertRecipients(alert);
  await sendAlertEmail({
    to: recipients.join(","),
    stateReport,
    alert: { ...alert, attachments: attachments as any[], should_send: 1 } as any,
    user,
  });

  await db.updateTable("state_report_alert").set({ sent_at: new Date().toISOString() }).where("id", "=", alert.id).execute();
  return true;
};

/**
 * Retries the alerts of sent constats that could not be emailed (SMTP error): alerts tried before and not sent,
 * MAX_SEND_ATTEMPTS times at most, never one already sent. Once none is left, the constat is marked alerts_sent.
 */
const retryFailedStateReportAlerts = async () => {
  const graceLimit = new Date(Date.now() - ATTEMPT_GRACE_MS).toISOString();
  const alerts = await db
    .selectFrom("state_report_alert")
    .innerJoin("state_report", "state_report.id", "state_report_alert.state_report_id")
    .selectAll("state_report_alert")
    .where("state_report.attachment_id", "is not", null)
    .where(sql<boolean>`coalesce(state_report.alerts_sent, false) = false`)
    .where(sql<boolean>`coalesce(state_report.disabled, false) = false`)
    .where("state_report_alert.should_send", "=", true)
    .where("state_report_alert.sent_at", "is", null)
    .where("state_report_alert.send_attempts", ">", 0)
    .where("state_report_alert.send_attempts", "<", MAX_SEND_ATTEMPTS)
    .where("state_report_alert.last_send_attempt_at", "<", graceLimit)
    .execute();

  const reportIds = new Set<string>();
  for (const alert of alerts) {
    reportIds.add(alert.state_report_id);
    try {
      const stateReport = await db
        .selectFrom("state_report")
        .selectAll()
        .where("id", "=", alert.state_report_id)
        .executeTakeFirstOrThrow();
      const user = await getAuthor(stateReport.created_by);
      if (!user || parseRecipients(getAlertRecipients(alert)).length === 0) {
        // will not change by waiting: give up now
        await db
          .updateTable("state_report_alert")
          .set({ send_attempts: MAX_SEND_ATTEMPTS })
          .where("id", "=", alert.id)
          .execute();
        throw new Error(user ? "Alerte sans destinataire" : "Auteur du constat introuvable");
      }
      const sent = await sendStateReportAlert({ alert, stateReport, user });
      if (sent) debug(`Alert ${alert.id} of constat ${stateReport.id} sent on retry`);
    } catch (error) {
      sentry?.captureException(error, { extra: { alertId: alert.id, attempt: alert.send_attempts + 1 } });
      const { send_attempts } = (await db
        .selectFrom("state_report_alert")
        .select("send_attempts")
        .where("id", "=", alert.id)
        .executeTakeFirst()) ?? { send_attempts: MAX_SEND_ATTEMPTS };
      if (send_attempts >= MAX_SEND_ATTEMPTS) {
        sentry?.captureMessage("Alerte de constat abandonnée après plusieurs essais d'envoi", {
          level: "error",
          extra: { alertId: alert.id, stateReportId: alert.state_report_id, attempts: send_attempts },
        });
      }
    }
  }

  for (const stateReportId of reportIds) await markAlertsSentIfDone(stateReportId);
};

/** alerts_sent once no alert of the constat that was tried is still unsent. */
export const markAlertsSentIfDone = async (stateReportId: string) => {
  const unsent = await db
    .selectFrom("state_report_alert")
    .select("id")
    .where("state_report_id", "=", stateReportId)
    .where("should_send", "=", true)
    .where("sent_at", "is", null)
    .where("send_attempts", ">", 0)
    .executeTakeFirst();
  if (!unsent) await db.updateTable("state_report").set({ alerts_sent: true }).where("id", "=", stateReportId).execute();
};

// --- job ----------------------------------------------------------------------------------------------------------

let isRunning = false;

export const runAlertDelivery = async () => {
  if (isRunning) return;
  isRunning = true;
  try {
    await retryFailedStateReportAlerts();
    await deliverPendingMonumentAlerts();
  } catch (error) {
    sentry?.captureException(error, { extra: { job: "alert-delivery" } });
    console.error("[alert-delivery]", error);
  } finally {
    isRunning = false;
  }
};

/** Starts the periodic job (first run one minute after startup); returns a function that stops it. */
export const startAlertDeliveryJob = () => {
  const first = setTimeout(runAlertDelivery, 60_000);
  const interval = setInterval(runAlertDelivery, ALERT_DELIVERY_INTERVAL_MS);
  first.unref();
  interval.unref();
  return () => {
    clearTimeout(first);
    clearInterval(interval);
  };
};
