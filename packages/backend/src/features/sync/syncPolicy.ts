import type { Kysely } from "kysely";
import type { Database } from "../../db/db";

/**
 * Write rules for `/api/upload-data`, the endpoint that applies the PowerSync client's local writes to PostgreSQL.
 *
 * Every table a client may write is listed here; any other table is refused. For each table:
 * - `ops`: allowed operations;
 * - `columns`: the columns of the client schema (packages/frontend/src/db/AppSchema.ts, checked by a test);
 * - `serverColumns`: columns owned by the server (ownership, service, sending state). On PUT they take the value of
 *   `forced` (or null); on PATCH a different value is dropped, the rest of the write still applies;
 * - `immutableColumns`: set by the client on PUT, never changed afterwards (parent document, service departments);
 * - `canWrite`: who may write the row, checked against the stored row (PATCH, DELETE) or the new one (PUT).
 *
 * Edit rights follow the frontend (useCanEditReport, useIsStateReportDisabled), plus delegation:
 * a user who received a delegation from a colleague may create, edit and delete that colleague's documents.
 */

export type CrudOp = "PUT" | "PATCH" | "DELETE";
export type Row = Record<string, unknown>;
/** The database or a transaction on it */
type Trx = Kysely<Database>;

export type SyncUser = { id: string; service_id: string };

export type WriteContext = {
  trx: Trx;
  user: SyncUser;
  op: CrudOp;
  id: string;
  /** Row as stored before the write; null on PUT */
  existing: Row | null;
  /** Row as it will be after the write */
  next: Row;
};

export type TablePolicy = {
  ops: readonly CrudOp[];
  columns: readonly string[];
  serverColumns?: readonly string[];
  immutableColumns?: readonly string[];
  forced?: (user: SyncUser) => Row;
  canWrite: (ctx: WriteContext) => Promise<boolean> | boolean;
};

// --- rights -------------------------------------------------------------------------------------------------------

/** Ids of the users who delegated their documents to `userId`. */
export const getDelegatorIds = async (trx: Trx, userId: string) => {
  const rows = await trx.selectFrom("delegation").select("createdBy").where("delegatedTo", "=", userId).execute();
  return rows.map((row) => row.createdBy);
};

const hasDelegation = async (trx: Trx, fromUserId: unknown, toUserId: string) => {
  if (typeof fromUserId !== "string" || !fromUserId) return false;
  const row = await trx
    .selectFrom("delegation")
    .select("id")
    .where("createdBy", "=", fromUserId)
    .where("delegatedTo", "=", toUserId)
    .executeTakeFirst();
  return !!row;
};

const isInUserService = (row: Row | null | undefined, user: SyncUser) =>
  !!row && !!user.service_id && row.service_id === user.service_id;

/** Compte-rendu: its creator, its redactor, or someone the creator delegated to, within the creator's service. */
export const canEditReport = async (trx: Trx, user: SyncUser, report: Row | null | undefined) => {
  if (!report || !isInUserService(report, user)) return false;
  if (report.createdBy === user.id || report.redactedById === user.id) return true;
  return hasDelegation(trx, report.createdBy, user.id);
};

/** Constat d'état: its creator or someone the creator delegated to, within the creator's service. */
export const canEditStateReport = async (trx: Trx, user: SyncUser, stateReport: Row | null | undefined) => {
  if (!stateReport || !isInUserService(stateReport, user)) return false;
  if (stateReport.created_by === user.id) return true;
  return hasDelegation(trx, stateReport.created_by, user.id);
};

const findById = async (trx: Trx, table: keyof Database, id: unknown): Promise<Row | null> => {
  if (typeof id !== "string" || !id) return null;
  const row = await trx
    .selectFrom(table as any)
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  return (row as Row | undefined) ?? null;
};

export const findReport = (trx: Trx, id: unknown) => findById(trx, "report", id);
export const findStateReport = (trx: Trx, id: unknown) => findById(trx, "state_report", id);

const findStateReportOfSection = async (trx: Trx, visitedSectionId: unknown) => {
  const section = await findById(trx, "visited_section", visitedSectionId);
  return section ? findStateReport(trx, section.state_report_id) : null;
};

const findStateReportOfAlert = async (trx: Trx, alertId: unknown) => {
  const alert = await findById(trx, "state_report_alert", alertId);
  return alert ? findStateReport(trx, alert.state_report_id) : null;
};

/** The row's parent reference: stored value on PATCH/DELETE (it can't change), new value on PUT. */
const parentRef = (ctx: WriteContext, column: string) => (ctx.existing ?? ctx.next)[column];

// --- policies -----------------------------------------------------------------------------------------------------

const serviceColumns = ["service_id"] as const;
const forceService = (user: SyncUser) => ({ service_id: user.service_id });

/** A row of the user's service whose parent document the user may edit. */
const documentChild = (
  columns: readonly string[],
  parentColumn: string,
  canEditParent: (ctx: WriteContext, parentId: unknown) => Promise<boolean>,
): TablePolicy => ({
  ops: ["PUT", "PATCH", "DELETE"],
  columns,
  serverColumns: serviceColumns,
  immutableColumns: [parentColumn],
  forced: forceService,
  canWrite: async (ctx) => isInUserService(ctx.next, ctx.user) && canEditParent(ctx, parentRef(ctx, parentColumn)),
});

const editStateReport = async (ctx: WriteContext, id: unknown) =>
  canEditStateReport(ctx.trx, ctx.user, await findStateReport(ctx.trx, id));

export const syncPolicies: Record<string, TablePolicy> = {
  report: {
    ops: ["PUT", "PATCH", "DELETE"],
    columns: [
      "title",
      "projectDescription",
      "redactedBy",
      "meetDate",
      "applicantName",
      "applicantAddress",
      "projectCadastralRef",
      "projectSpaceType",
      "decision",
      "precisions",
      "contacts",
      "furtherInformation",
      "createdBy",
      "createdAt",
      "serviceInstructeur",
      "pdf",
      "attachment_id",
      "disabled",
      "service_id",
      "redactedById",
      "applicantEmail",
      "city",
      "zipCode",
      "personnes_presentes",
      "pdf_size",
    ],
    // attachment_id and pdf_size are set by the backend when the PDF is sent
    serverColumns: ["service_id", "createdBy", "attachment_id", "pdf_size"],
    forced: (user) => ({ service_id: user.service_id, createdBy: user.id }),
    canWrite: async ({ trx, user, op, existing, next }) => {
      if (op !== "PUT" && !(await canEditReport(trx, user, existing))) return false;
      if (op === "PUT" && !isInUserService(next, user)) return false;
      // the redactor is the user, someone who delegated to them, or unchanged
      const redactor = next.redactedById;
      if (redactor == null || redactor === user.id || redactor === existing?.redactedById) return true;
      return (await getDelegatorIds(trx, user.id)).includes(redactor as string);
    },
  },

  report_attachment: documentChild(
    ["report_id", "label", "attachment_id", "is_deprecated", "is_ignored", "service_id", "created_at"],
    "report_id",
    async (ctx, reportId) => canEditReport(ctx.trx, ctx.user, await findReport(ctx.trx, reportId)),
  ),

  pdf_snapshot: {
    ops: ["PUT", "PATCH", "DELETE"],
    columns: ["report_id", "html", "report", "user_id"],
    serverColumns: ["user_id"],
    forced: (user) => ({ user_id: user.id }),
    canWrite: ({ user, next }) => next.user_id === user.id,
  },

  state_report: {
    ops: ["PUT", "PATCH", "DELETE"],
    columns: [
      "version",
      "nature_edifice",
      "reference_pop",
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
      "observations",
      "titre_edifice",
      "up_id",
      "up_identifiant",
      "up_intitule",
      "up_intitule_complet",
      "up_niveau",
      "up_protection",
      "up_type_immeuble",
      "up_monument_identifiant",
      "up_chemin",
      "rapport_id",
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
      "etat_general",
      "proportion_dans_cet_etat",
      "taux_degradation",
      "vitesse_degradation",
      "etat_commentaires",
      "preconisations",
      "preconisations_commentaires",
      "notes",
      "pdf_size",
      "attachment_id",
      "bilan_quinquennal",
      "service_id",
      "created_by",
      "created_at",
      "disabled",
      "validation_status",
    ],
    // attachment_id, pdf_size and validation_status are set by the backend when sending and validating
    serverColumns: ["service_id", "created_by", "attachment_id", "pdf_size", "validation_status"],
    forced: (user) => ({ service_id: user.service_id, created_by: user.id }),
    canWrite: async ({ trx, user, op, existing, next }) =>
      op === "PUT" ? isInUserService(next, user) : canEditStateReport(trx, user, existing),
  },

  visited_section: documentChild(
    [
      "state_report_id",
      "section",
      "etat_general",
      "proportion_dans_cet_etat",
      "niveau_degradation",
      "commentaires",
      "preconisations",
      "service_id",
      "localisation_pins",
      "localisation_drawings",
      "localisation_zone",
    ],
    "state_report_id",
    editStateReport,
  ),

  state_report_attachment: documentChild(
    ["state_report_id", "attachment_id", "is_deprecated", "is_ignored", "label", "type", "service_id", "created_at"],
    "state_report_id",
    editStateReport,
  ),

  state_report_alert: documentChild(
    [
      "state_report_id",
      "alert",
      "commentaires",
      "show_in_report",
      "should_send",
      "service_id",
      "objet_ou_mobilier",
      "objet_ou_mobilier_name",
      "probleme",
      "mandatory_emails",
      "additional_emails",
    ],
    "state_report_id",
    editStateReport,
  ),

  visited_section_attachment: documentChild(
    ["visited_section_id", "attachment_id", "is_deprecated", "is_ignored", "label", "created_at", "service_id"],
    "visited_section_id",
    async (ctx, sectionId) => canEditStateReport(ctx.trx, ctx.user, await findStateReportOfSection(ctx.trx, sectionId)),
  ),

  state_report_alert_attachment: documentChild(
    ["state_report_alert_id", "attachment_id", "is_deprecated", "is_ignored", "label", "created_at", "service_id"],
    "state_report_alert_id",
    async (ctx, alertId) => canEditStateReport(ctx.trx, ctx.user, await findStateReportOfAlert(ctx.trx, alertId)),
  ),

  delegation: {
    // a user grants or withdraws their own delegations, to colleagues of their service
    ops: ["PUT", "DELETE"],
    columns: ["createdBy", "delegatedTo"],
    serverColumns: ["createdBy"],
    forced: (user) => ({ createdBy: user.id }),
    canWrite: async ({ trx, user, op, next }) => {
      if (next.createdBy !== user.id) return false;
      if (op === "DELETE") return true;
      if (next.delegatedTo === user.id) return false;
      const delegate = await findById(trx, "user", next.delegatedTo);
      return isInUserService(delegate, user);
    },
  },

  user_settings: {
    ops: ["PUT", "PATCH"],
    columns: [
      "user_id",
      "default_emails",
      "service_id",
      "validation_enabled",
      "validation_email",
      "validation_nom",
      "validation_prenom",
    ],
    serverColumns: ["user_id", "service_id"],
    forced: (user) => ({ user_id: user.id, service_id: user.service_id }),
    canWrite: ({ user, next }) => next.user_id === user.id,
  },

  user: {
    // own profile only; the service is changed through /api/change-service
    ops: ["PATCH"],
    columns: ["name", "service_id", "job"],
    immutableColumns: ["service_id"],
    canWrite: ({ user, id }) => id === user.id,
  },

  service: {
    // any member may edit their service's settings (decision of 2026-11-04); its departments are managed elsewhere
    ops: ["PATCH"],
    columns: [
      "department",
      "dept_numbers",
      "completeCoords",
      "visible",
      "name",
      "address",
      "zipCode",
      "city",
      "phone",
      "email",
      "marianne_text",
      "drac_text",
      "service_text",
      "courriel_crmh",
      "courriel_caoa",
      "courriel_dreal",
      "courriel_sra",
      "courriel_udap",
      "courriel_ofb",
    ],
    immutableColumns: ["dept_numbers"],
    canWrite: ({ user, id }) => !!user.service_id && id === user.service_id,
  },

  service_instructeurs: {
    ops: ["PUT", "PATCH", "DELETE"],
    columns: ["full_name", "short_name", "email", "tel", "service_id"],
    serverColumns: serviceColumns,
    forced: forceService,
    canWrite: ({ user, next }) => isInUserService(next, user),
  },

  suggested_email: {
    // created by the backend when a document is sent; members may remove suggestions
    ops: ["DELETE"],
    columns: ["email", "service_id"],
    canWrite: ({ user, next }) => isInUserService(next, user),
  },
};

/** Tables of the client schema that are read-only for clients (filled by the backend or by imports). */
export const readOnlyClientTables = [
  "clause_v2",
  "pictures",
  "transactions",
  "sent_email",
  "state_report_sent_email",
  "pop_immeubles",
  "pop_objets",
  "pop_images",
] as const;

// --- evaluation ---------------------------------------------------------------------------------------------------

export type Decision = { allowed: true; values: Row; dropped: string[] } | { allowed: false; reason: string };

/**
 * Checks one client operation and returns the values to write.
 * `existing` is the stored row (null if none); `data` is what the client sent.
 */
export const evaluateWrite = async ({
  trx,
  user,
  table,
  op,
  id,
  data,
  existing,
}: {
  trx: Trx;
  user: SyncUser;
  table: string;
  op: string;
  id: string;
  data: Row;
  existing: Row | null;
}): Promise<Decision> => {
  const policy = Object.hasOwn(syncPolicies, table) ? syncPolicies[table] : undefined;
  if (!policy) return { allowed: false, reason: `table ${table} non modifiable` };
  if (!policy.ops.includes(op as CrudOp)) return { allowed: false, reason: `opération ${op} interdite sur ${table}` };

  // Tables that declare `id` in the client schema (state_report) get it repeated in the data: it must be the row's id.
  if ("id" in data) {
    if (data.id !== id) return { allowed: false, reason: "id différent de celui de l'opération" };
    data = Object.fromEntries(Object.entries(data).filter(([column]) => column !== "id"));
  }

  const unknown = Object.keys(data).filter((column) => !policy.columns.includes(column));
  if (unknown.length) return { allowed: false, reason: `colonnes inconnues : ${unknown.join(", ")}` };

  const serverColumns = policy.serverColumns ?? [];
  const lockedColumns = [...serverColumns, ...(policy.immutableColumns ?? [])];
  const dropped: string[] = [];
  let values: Row;

  if (op === "PUT") {
    if (existing) return { allowed: false, reason: "la ligne existe déjà" };
    values = { ...data };
    for (const column of serverColumns) values[column] = null;
    Object.assign(values, policy.forced?.(user));
    for (const column of serverColumns) {
      if (data[column] != null && !sameValue(data[column], values[column])) dropped.push(column);
    }
  } else {
    if (!existing) return { allowed: true, values: {}, dropped }; // nothing to change, as before
    values = {};
    for (const [column, value] of Object.entries(data)) {
      if (lockedColumns.includes(column) && !sameValue(value, existing[column])) {
        dropped.push(column);
        continue;
      }
      values[column] = value;
    }
  }

  const next = op === "DELETE" ? existing! : { ...(existing ?? {}), ...values, id };
  const allowed = await policy.canWrite({ trx, user, op: op as CrudOp, id, existing, next });
  if (!allowed) return { allowed: false, reason: `droits insuffisants sur ${table}` };

  return { allowed: true, values, dropped };
};

/** SQLite stores booleans and dates differently from PostgreSQL: compare loosely. */
const sameValue = (a: unknown, b: unknown) => {
  if (a == null || b == null) return a == null && b == null;
  if (b instanceof Date) return new Date(a as string).getTime() === b.getTime();
  if (typeof b === "boolean") return Boolean(Number(a)) === b || a === b;
  return String(a) === String(b);
};
