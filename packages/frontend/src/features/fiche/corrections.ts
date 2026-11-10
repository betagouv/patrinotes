import { v7 } from "uuid";
import { MonumentCorrection, PopImmeuble } from "../../db/AppSchema";
import { db, useDbQuery } from "../../db/db";
import type { StateReportFormType } from "../state-report/utils";

/** What a correction is about: the monument, one of its unités patrimoniales, or one of its objets mobiliers. */
export type CorrectionTarget =
  | { target: "mh"; referencePop: string }
  | { target: "up"; referencePop: string; upId: string }
  | { target: "objet"; referencePop: string; objetReference: string };

export type CorrectionField = Exclude<
  keyof MonumentCorrection,
  "id" | "target" | "reference_pop" | "up_id" | "objet_reference" | "updated_at" | "updated_by" | "service_id"
>;

/** Fields a service may correct on each kind of fiche, with their labels. */
export const correctionFields: Record<CorrectionTarget["target"], { field: CorrectionField; label: string; multiline?: boolean }[]> =
  {
    mh: [
      { field: "nature_edifice", label: "Nature de l’édifice" },
      { field: "adresse", label: "Adresse" },
      { field: "commune", label: "Commune" },
      { field: "commune_historique", label: "Commune historique" },
      { field: "reference_cadastrale", label: "Référence cadastrale" },
      { field: "periode_construction", label: "Périodes de construction" },
      { field: "nature_protection", label: "Nature de la protection" },
      { field: "parties_protegees", label: "Parties protégées", multiline: true },
      { field: "description", label: "Description", multiline: true },
    ],
    up: [
      { field: "adresse", label: "Adresse" },
      { field: "commune", label: "Commune" },
      { field: "commune_historique", label: "Commune historique" },
      { field: "reference_cadastrale", label: "Référence cadastrale" },
    ],
    objet: [{ field: "emplacement", label: "Emplacement de l’objet" }],
  };

const correctionQuery = (target: CorrectionTarget) => {
  let query = db
    .selectFrom("monument_correction")
    .selectAll()
    .where("target", "=", target.target)
    .where("reference_pop", "=", target.referencePop);
  if (target.target === "up") query = query.where("up_id", "=", target.upId);
  if (target.target === "objet") query = query.where("objet_reference", "=", target.objetReference);
  // two devices may have created one offline: the latest wins
  return query.orderBy("updated_at", "desc").limit(1);
};

/** The service's correction of a fiche, if any (synced with the service). */
export const useCorrection = (target: CorrectionTarget | null) => {
  const key = target ? JSON.stringify(target) : "";
  const query = useDbQuery(
    target ? correctionQuery(target) : db.selectFrom("monument_correction").selectAll().where("id", "=", "__none__"),
    [key],
  );
  return { correction: (query.data?.[0] ?? null) as MonumentCorrection | null, isLoading: query.isLoading };
};

export const getCorrection = async (target: CorrectionTarget) =>
  ((await correctionQuery(target).execute())[0] ?? null) as MonumentCorrection | null;

/** A corrected value replaces the original one; an emptied field stays empty (""), null = not corrected. */
export const corrected = <T extends string | null | undefined>(original: T, value: string | null | undefined) =>
  value !== null && value !== undefined ? value : original;

export const saveCorrection = async ({
  target,
  values,
  existing,
  userId,
  serviceId,
}: {
  target: CorrectionTarget;
  values: Partial<Record<CorrectionField, string | null>>;
  existing: MonumentCorrection | null;
  userId: string;
  serviceId: string | null;
}) => {
  const now = new Date().toISOString();
  if (existing) {
    await db
      .updateTable("monument_correction")
      .set({ ...values, updated_at: now })
      .where("id", "=", existing.id)
      .execute();
    return;
  }

  await db
    .insertInto("monument_correction")
    .values({
      id: v7(),
      target: target.target,
      reference_pop: target.referencePop,
      up_id: target.target === "up" ? target.upId : null,
      objet_reference: target.target === "objet" ? target.objetReference : null,
      ...values,
      updated_at: now,
      updated_by: userId,
      service_id: serviceId,
    })
    .execute();
};

/** Monument fields of a constat, from POP (see immeubleMapping) with the service's corrections of the monument. */
export const getCorrectedMonumentValues = (
  monument: Partial<PopImmeuble>,
  correction: MonumentCorrection | null,
): Partial<StateReportFormType> => ({
  reference_pop: monument.id ?? monument.reference ?? null,
  titre_edifice: monument.titre_editorial_de_la_notice ?? null,
  nature_edifice: corrected(monument.denomination_de_l_edifice ?? null, correction?.nature_edifice),
  adresse: corrected(monument.adresse_forme_index ?? null, correction?.adresse),
  commune: corrected(monument.commune_forme_editoriale ?? null, correction?.commune),
  commune_historique: corrected(monument.commune_forme_index ?? null, correction?.commune_historique),
  reference_cadastrale: corrected(monument.cadastre ?? null, correction?.reference_cadastrale),
  periode_construction: corrected(
    monument.siecle_de_la_campagne_principale_de_construction ?? null,
    correction?.periode_construction,
  ),
  nature_protection: corrected(monument.typologie_de_la_protection ?? null, correction?.nature_protection),
  parties_protegees: corrected(monument.precision_de_la_protection ?? null, correction?.parties_protegees),
  description: corrected(monument.description_de_l_edifice ?? null, correction?.description),
});

/** Values of an unité patrimoniale correction that override the monument's in a constat on that UP. */
export const getUpCorrectionValues = (correction: MonumentCorrection | null): Partial<StateReportFormType> => {
  if (!correction) return {};
  const values: Partial<StateReportFormType> = {};
  for (const { field } of correctionFields.up) {
    const value = correction[field];
    if (value !== null && value !== undefined) (values as any)[field] = value;
  }
  return values;
};
