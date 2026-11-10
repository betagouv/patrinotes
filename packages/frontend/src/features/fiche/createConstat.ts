import { v4 } from "uuid";
import { db } from "../../db/db";
import type { UpSelection } from "../up/upApi";
import { getCorrectedMonumentValues, getCorrection, getUpCorrectionValues } from "./corrections";

/**
 * Creates a constat d'état on a monument from its fiche, already filled with the monument's information
 * (POP, with the service's corrections) and, for a MH complexe, the chosen unité patrimoniale.
 * Returns the new constat id.
 */
export const createConstatFromFiche = async ({
  referencePop,
  selection,
  user,
}: {
  referencePop: string;
  /** null for a monument without unités patrimoniales (or when they could not be fetched) */
  selection: UpSelection | null;
  user: { id: string; name: string | null; service_id: string | null };
}) => {
  const monument = await db.selectFrom("pop_immeubles").selectAll().where("id", "=", referencePop).executeTakeFirst();
  const monumentCorrection = await getCorrection({ target: "mh", referencePop });
  const up = selection?.up ?? null;
  const upCorrection = up ? await getCorrection({ target: "up", referencePop, upId: up.id }) : null;

  const id = v4();
  await db
    .insertInto("state_report")
    .values({
      id,
      created_by: user.id,
      created_at: new Date().toISOString(),
      disabled: 0,
      version: 2,
      service_id: user.service_id,
      redacted_by: user.name,
      date_visite: new Date().toISOString(),
      ...getCorrectedMonumentValues(monument ?? { id: referencePop }, monumentCorrection),
      // an UP has its own address and cadastre in the dataspace, the service may have corrected them
      ...(up?.adresse?.rue ? { adresse: up.adresse.rue } : {}),
      ...(up?.adresse?.commune ? { commune: up.adresse.commune } : {}),
      ...getUpCorrectionValues(upCorrection),
      up_id: up?.id ?? null,
      up_identifiant: up?.identifiant ?? null,
      up_intitule: up?.intitule ?? null,
      up_intitule_complet: up?.intituleComplet ?? null,
      up_niveau: up?.niveau ?? null,
      up_protection: up?.protection ?? null,
      up_type_immeuble: up?.typeImmeuble ?? null,
      up_monument_identifiant: selection?.monument?.identifiant ?? null,
      up_chemin: up && selection?.chemin.length ? JSON.stringify(selection.chemin) : null,
    })
    .execute();

  return id;
};
