import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { attachmentQueue, db, powerSyncDb, useDbQuery } from "../../db/db";
import type { StateReport } from "../../db/AppSchema";
import { getIsStateReportDisabled } from "../state-report/utils";
import type { UpSelection } from "./upApi";

/**
 * Rapport groupé (MH complexe): the constats of several unités patrimoniales of one monument share a `rapport_id`
 * and are sent together, in one PDF (one chapter per UP) and one email.
 *
 * - The group is created by « Finaliser le constat » → « Commencer un nouveau constat »: the current constat gets a
 *   `rapport_id` and the new one (another UP of the same monument) shares it.
 * - Sending any constat of the group sends every constat of the group that is not sent yet.
 * - Once sent, the constats are read-only, so the group is closed: nothing can be added to it anymore.
 */

/** Monument fields copied from the current constat into the next one of the rapport. */
const monumentFields = [
  "version",
  "reference_pop",
  "titre_edifice",
  "nature_edifice",
  "adresse",
  "commune",
  "code_postal",
  "commune_historique",
  "coordonnees",
  "reference_cadastrale",
  "periode_construction",
  "nature_protection",
  "parties_protegees",
  "description",
  "up_monument_identifiant",
] as const satisfies readonly (keyof StateReport)[];

/** « Contexte de la visite »: prefilled in the next constat, each constat keeps its own afterwards. */
export const rapportContextFields = [
  "nature_visite",
  "visite_partielle_details",
  "visite_details",
  "date_visite",
  "personnes_presentes",
  "redacted_by",
  "proprietaire",
  "proprietaire_email",
  "proprietaire_representant",
  "proprietaire_representant_email",
] as const satisfies readonly (keyof StateReport)[];

/** Constats of a rapport (deleted ones excluded), in creation order, which is the order of the PDF chapters. */
export const rapportMembersQuery = (rapportId: string) =>
  db
    .selectFrom("state_report")
    .selectAll()
    .where("rapport_id", "=", rapportId)
    .where((eb) => eb.or([eb("disabled", "=", 0), eb("disabled", "is", null)]))
    .orderBy("created_at", "asc");

export const useRapportMembers = (rapportId: string | null | undefined) => {
  const query = useDbQuery(rapportMembersQuery(rapportId ?? "__none__"));
  return rapportId ? (query.data ?? []) : [];
};

/** A constat still waiting to be sent (a declined validation reopens it). */
export const isConstatPending = (stateReport: Pick<StateReport, "attachment_id" | "validation_status">) =>
  !getIsStateReportDisabled(stateReport);

/** Constats of the rapport still to be sent: they all go in the same PDF. */
export const getPendingMembers = <T extends Pick<StateReport, "attachment_id" | "validation_status">>(members: T[]) =>
  members.filter(isConstatPending);

/** UP already covered by the rapport (null = ensemble du monument), so they are not offered again. */
export const getRapportUpIds = (members: Pick<StateReport, "up_id">[]) => new Set(members.map((m) => m.up_id ?? null));

/**
 * « Commencer un nouveau constat »: creates the constat of another UP in the same rapport,
 * with the monument and the visit context of the current constat.
 */
export const createNextRapportConstat = async ({
  current,
  selection,
  user,
}: {
  current: StateReport;
  selection: UpSelection;
  user: { id: string; service_id: string | null; name: string };
}) => {
  const rapportId = current.rapport_id || v4();
  if (!current.rapport_id) {
    await db.updateTable("state_report").set({ rapport_id: rapportId }).where("id", "=", current.id).execute();
  }

  const up = selection.up;
  const id = v4();
  const values: Partial<StateReport> = {};
  for (const field of [...monumentFields, ...rapportContextFields]) {
    (values as any)[field] = current[field] ?? null;
  }

  await db
    .insertInto("state_report")
    .values({
      ...values,
      id,
      rapport_id: rapportId,
      up_id: up?.id ?? null,
      up_identifiant: up?.identifiant ?? null,
      up_intitule: up?.intitule ?? null,
      up_intitule_complet: up?.intituleComplet ?? null,
      up_niveau: up?.niveau ?? null,
      up_protection: up?.protection ?? null,
      up_type_immeuble: up?.typeImmeuble ?? null,
      up_monument_identifiant: selection.monument?.identifiant ?? current.up_monument_identifiant ?? null,
      up_chemin: up && selection.chemin.length ? JSON.stringify(selection.chemin) : null,
      version: current.version ?? 2,
      created_by: user.id,
      created_at: new Date().toISOString(),
      service_id: user.service_id,
      disabled: 0,
      redacted_by: current.redacted_by ?? user.name,
    })
    .execute();

  return { id, rapportId };
};

/**
 * Constats that go into the same PDF as `current`: the constats of its rapport still to be sent,
 * or, for a rapport already sent, those sent with it (same PDF).
 */
export const getRapportPartIds = (
  current: Pick<StateReport, "id" | "rapport_id" | "attachment_id" | "validation_status">,
  members: Pick<StateReport, "id" | "attachment_id" | "validation_status">[],
) => {
  if (!current.rapport_id) return [current.id];
  const currentIsPending = isConstatPending(current);
  const ids = members
    .filter((m) =>
      currentIsPending ? isConstatPending(m) : !!current.attachment_id && m.attachment_id === current.attachment_id,
    )
    .map((m) => m.id);
  return ids.includes(current.id) ? ids : [...ids, current.id];
};

/**
 * Subscribes to the attachments of the other constats of a rapport (pictures, plans) so they can go in the PDF.
 * Does not wait forever: offline, the constats created on this device already have their files.
 */
export const useRapportAttachmentStreams = (stateReportIds: string[]) => {
  const key = stateReportIds.join(",");
  const [readyKey, setReadyKey] = useState<string | null>(stateReportIds.length ? null : "");

  useEffect(() => {
    if (!stateReportIds.length) {
      setReadyKey("");
      return;
    }
    let cancelled = false;
    const subscriptions: { unsubscribe: () => void }[] = [];

    const subscribeAll = Promise.all(
      stateReportIds.map(async (id) => {
        const subscription = await powerSyncDb
          .syncStream("state_report_attachments_stream", { state_report_id: id })
          .subscribe();
        if (cancelled) return subscription.unsubscribe();
        subscriptions.push(subscription);
        await subscription.waitForFirstSync();
      }),
    );
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 8000));

    void (async () => {
      try {
        await Promise.race([subscribeAll, timeout]);
        if (cancelled) return;
        // Wait for remote images/files to be materialized locally before PDF queries read local_uri.
        await attachmentQueue.syncStorage();
      } catch (error) {
        console.error("Failed to synchronize grouped-report attachments", error);
      } finally {
        if (!cancelled) setReadyKey(key);
      }
    })();

    return () => {
      cancelled = true;
      subscriptions.forEach((s) => s.unsubscribe());
    };
  }, [key]);

  return readyKey === key;
};
