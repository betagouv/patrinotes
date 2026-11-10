import { serializeMandatoryEmails } from "@patrinotes/pdf/utils";
import { v7 } from "uuid";
import { MonumentAlert, MonumentAlertAttachment, Service } from "../../../db/AppSchema";
import { attachmentLocalStorage, db, useDbQuery } from "../../../db/db";
import { getEmailsForSection } from "../../state-report/alerts/StateReportAlert.utils";

/** Where an alert or annotation made from a fiche is: monument, unité patrimoniale and/or objet mobilier. */
export type MonumentAlertContext = {
  referencePop: string;
  titreEdifice: string | null;
  commune: string | null;
  upId?: string | null;
  upIntitule?: string | null;
  objetReference?: string | null;
  objetTitre?: string | null;
  /** constat during which an annotation is made: it is reopened from that constat's objets */
  stateReportId?: string | null;
};

export type MonumentAlertKind = "alerte" | "annotation";

/** Starts a draft: it holds the photos while the user fills the form, and is deleted if they cancel. */
export const createMonumentAlertDraft = async ({
  kind,
  alert,
  context,
  user,
  service,
}: {
  kind: MonumentAlertKind;
  /** section of the alert (as in constats), e.g. "Objets et mobiliers" */
  alert: string;
  context: MonumentAlertContext;
  user: { id: string; name: string | null; service_id: string | null };
  service: Service | null;
}) => {
  const id = v7();
  await db
    .insertInto("monument_alert")
    .values({
      id,
      kind,
      status: "draft",
      reference_pop: context.referencePop,
      titre_edifice: context.titreEdifice,
      commune: context.commune,
      up_id: context.upId ?? null,
      up_intitule: context.upIntitule ?? null,
      objet_reference: context.objetReference ?? null,
      objet_titre: context.objetTitre ?? null,
      alert,
      commentaires: "",
      // an annotation is only emailed when the user asks for it
      should_send: kind === "alerte" ? 1 : 0,
      mandatory_emails: serializeMandatoryEmails(service ? getEmailsForSection(alert, service) : []),
      additional_emails: "",
      created_by: user.id,
      created_by_name: user.name,
      created_at: new Date().toISOString(),
      service_id: user.service_id,
      state_report_id: context.stateReportId ?? null,
    })
    .execute();
  return id;
};

export const updateMonumentAlertDraft = (id: string, values: Partial<MonumentAlert>) =>
  db.updateTable("monument_alert").set(values).where("id", "=", id).where("status", "=", "draft").execute();

/** Validates the draft: it is kept, and emailed by the outbox once synced (if `should_send`). */
export const submitMonumentAlert = (id: string, values: Partial<MonumentAlert>) =>
  db
    .updateTable("monument_alert")
    .set({ ...values, status: "submitted", submitted_at: new Date().toISOString() })
    .where("id", "=", id)
    .execute();

/** Cancels a draft and its photos. */
export const discardMonumentAlertDraft = async (id: string) => {
  const attachments = await db
    .selectFrom("monument_alert_attachment")
    .select(["id", "attachment_id"])
    .where("monument_alert_id", "=", id)
    .execute();
  for (const attachment of attachments) {
    await attachmentLocalStorage.deleteFile(attachment.attachment_id!).catch(() => {});
  }
  await db.deleteFrom("monument_alert_attachment").where("monument_alert_id", "=", id).execute();
  await db.deleteFrom("monument_alert").where("id", "=", id).where("status", "=", "draft").execute();
};

export type MonumentAlertWithAttachments = MonumentAlert & {
  attachments: Pick<MonumentAlertAttachment, "id" | "attachment_id" | "label">[];
};

/** Submitted alerts and annotations of a monument (synced with the user's service), newest first. */
export const useMonumentAlerts = (referencePop: string | null | undefined) => {
  const reference = referencePop ?? "__none__";
  const alertsQuery = useDbQuery(
    db
      .selectFrom("monument_alert")
      .selectAll()
      .where("reference_pop", "=", reference)
      .where("status", "=", "submitted")
      .orderBy("submitted_at", "desc"),
    [reference],
  );
  const attachmentsQuery = useDbQuery(
    db
      .selectFrom("monument_alert_attachment")
      .innerJoin("monument_alert", "monument_alert.id", "monument_alert_attachment.monument_alert_id")
      .select([
        "monument_alert_attachment.id",
        "monument_alert_attachment.attachment_id",
        "monument_alert_attachment.label",
        "monument_alert_attachment.monument_alert_id",
        "monument_alert_attachment.created_at",
      ])
      .where("monument_alert.reference_pop", "=", reference)
      .where("monument_alert_attachment.is_deprecated", "=", 0)
      .orderBy("monument_alert_attachment.created_at", "asc"),
    [reference],
  );

  const attachments = attachmentsQuery.data ?? [];
  const alerts: MonumentAlertWithAttachments[] = (alertsQuery.data ?? []).map((alert) => ({
    ...alert,
    attachments: attachments.filter((attachment) => attachment.monument_alert_id === alert.id),
  }));
  return { alerts, isLoading: alertsQuery.isLoading };
};
