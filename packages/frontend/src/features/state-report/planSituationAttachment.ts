import { v7 } from "uuid";
import { attachmentQueue, db } from "../../db/db";
import { generatePlanSituationSnapshot } from "../map/planSituationSnapshot";
import { geocode } from "../map/MapLibre";

export type EnsurePlanSituationResult =
  | { status: "exists"; attachmentId: string }
  | { status: "generated"; attachmentId: string }
  | { status: "no-data" };

/**
 * Resolves the point to use for the plan de situation when the user never explicitly
 * moved/validated the pin (the common case: the monument's own coordinates are enough).
 * Mirrors the fallback chain MapLibre.tsx uses to center the interactive map.
 */
export async function resolveCoordonnees({
  coordonnees,
  referencePop,
  adresse,
}: {
  coordonnees: string | null;
  referencePop: string | null;
  adresse: string | null;
}): Promise<string | null> {
  if (coordonnees) return coordonnees;

  if (referencePop && referencePop !== "CUSTOM") {
    const popMH = await db
      .selectFrom("pop_immeubles")
      .select(["coordonnees_au_format_wgs84", "adresse_forme_editoriale"])
      .where("id", "=", referencePop)
      .executeTakeFirst();

    if (popMH?.coordonnees_au_format_wgs84) return popMH.coordonnees_au_format_wgs84;

    const popAdresse = popMH?.adresse_forme_editoriale ?? adresse;
    if (popAdresse) {
      const coords = await geocode(popAdresse);
      if (coords) return `${coords[1]},${coords[0]}`;
    }
    return null;
  }

  if (adresse) {
    const coords = await geocode(adresse);
    if (coords) return `${coords[1]},${coords[0]}`;
  }

  return null;
}

/**
 * Returns the current plan_situation attachment for a state report, generating and
 * persisting one from the saved point + selected cadastre if none exists yet.
 * Lets PlanSituationOfflineError bubble up so callers can show an offline message.
 */
export async function ensurePlanSituationAttachment({
  stateReportId,
  serviceId,
  coordonnees,
  referenceCadastrale,
  referencePop,
  adresse,
}: {
  stateReportId: string;
  serviceId: string;
  coordonnees: string | null;
  referenceCadastrale: string | null;
  referencePop: string | null;
  adresse: string | null;
}): Promise<EnsurePlanSituationResult> {
  const existing = await db
    .selectFrom("state_report_attachment")
    .select("attachment_id")
    .where("state_report_id", "=", stateReportId)
    .where("type", "=", "plan_situation")
    .where((eb) => eb.or([eb("is_deprecated", "=", 0), eb("is_deprecated", "is", null)]))
    .executeTakeFirst();

  if (existing?.attachment_id) return { status: "exists", attachmentId: existing.attachment_id };

  const resolvedCoordonnees = await resolveCoordonnees({ coordonnees, referencePop, adresse });
  if (!resolvedCoordonnees) return { status: "no-data" };

  const blob = await generatePlanSituationSnapshot({ coordonnees: resolvedCoordonnees, referenceCadastrale });
  const data = await blob.arrayBuffer();
  const attachmentId = `${stateReportId}/images/${v7()}.jpg`;

  await attachmentQueue.saveFile({ id: attachmentId, fileExtension: "jpg", data, mediaType: "image/jpeg" });
  await db
    .insertInto("state_report_attachment")
    .values({
      id: v7(),
      attachment_id: attachmentId,
      state_report_id: stateReportId,
      service_id: serviceId,
      label: "Échelle 1/5000",
      created_at: new Date().toISOString(),
      is_deprecated: 0,
      type: "plan_situation",
    })
    .execute();

  return { status: "generated", attachmentId };
}

/** Marks the current plan_situation attachment (if any) as deprecated so the next
 * ensurePlanSituationAttachment call regenerates it from the updated point/cadastre. */
export async function invalidatePlanSituationAttachment(stateReportId: string) {
  await db
    .updateTable("state_report_attachment")
    .set({ is_deprecated: 1 })
    .where("state_report_id", "=", stateReportId)
    .where("type", "=", "plan_situation")
    .execute();
}
