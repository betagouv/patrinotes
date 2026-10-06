import { db } from "../db/db";

/** Normalise a department number so "01", "1" and " 1 " all compare equal (Corsica "2A"/"2B" are preserved). */
const normalizeDept = (dept: string | null | undefined) => {
  if (!dept) return null;
  const trimmed = dept.trim().toLowerCase();
  if (!trimmed) return null;
  return trimmed.replace(/^0+(?=\d)/, "");
};

const parseServiceDepts = (deptNumbers: string | null | undefined) => {
  if (!deptNumbers) return [] as string[];
  return deptNumbers
    .split(",")
    .map((d) => normalizeDept(d))
    .filter((d): d is string => !!d);
};

export class StateReportService {
  async getImagesForObjets(references: string[]) {
    return db.selectFrom("pop_images").where("reference", "in", references).selectAll().execute();
  }

  /** Department of the historic monument behind a `reference_pop` (matches `pop_immeubles.id`, falls back to `reference`). */
  async getMonumentDept(referencePop: string) {
    const monument = await db
      .selectFrom("pop_immeubles")
      .select(["departement_format_numerique"])
      .where((eb) => eb.or([eb("id", "=", referencePop), eb("reference", "=", referencePop)]))
      .executeTakeFirst();

    return normalizeDept(monument?.departement_format_numerique);
  }

  /** Whether a service (via its comma-separated `dept_numbers`) is allowed to see the monument's constats. */
  async canServiceAccessMonument(referencePop: string, serviceDeptNumbers: string | null | undefined) {
    if (!referencePop || referencePop === "CUSTOM") return false;
    const monumentDept = await this.getMonumentDept(referencePop);
    if (!monumentDept) return false;
    return parseServiceDepts(serviceDeptNumbers).includes(monumentDept);
  }

  /** Lightweight list of every non-draft, non-deleted constat made on a monument, across all services. */
  async getPreviousConstats(referencePop: string) {
    const rows = await db
      .selectFrom("state_report")
      .leftJoin("service", "service.id", "state_report.service_id")
      .where("state_report.reference_pop", "like", "%" + referencePop.trim())
      .where("state_report.attachment_id", "is not", null)
      .where((eb) => eb.or([eb("state_report.disabled", "is", null), eb("state_report.disabled", "=", false)]))
      .select([
        "state_report.id",
        "state_report.created_at",
        "state_report.nature_visite",
        "state_report.redacted_by",
        "state_report.titre_edifice",
        "state_report.pdf_size",
        "state_report.service_id",
        "service.name as service_name",
      ])
      .orderBy("state_report.created_at", "desc")
      .execute();

    return rows;
  }
}
