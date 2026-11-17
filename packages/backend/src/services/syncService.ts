import { Static, TSchema, Type } from "@sinclair/typebox";
import { db } from "../db/db";
import { makeDebug } from "../features/debug";
import { v4 } from "uuid";
import { AuthUser } from "../routes/authMiddleware";
import { Decision, evaluateWrite, Row, syncPolicies } from "../features/sync/syncPolicy";
import { sentry } from "../features/sentry";
import type { Kysely } from "kysely";
import type { Database } from "../db/db";

const debug = makeDebug("sync-service");

export const Nullable = <T extends TSchema>(schema: T) => Type.Optional(Type.Union([schema, Type.Null()]));

type Trx = Kysely<Database>;

// Tables belonging to a state report (constat d'état), with how to reach its state_report_id.
// Reports (compte-rendus) are intentionally not listed: they stay editable after sending.
const stateReportChildTables: Record<string, { column: string; parent?: { table: string; column: string } }> = {
  visited_section: { column: "state_report_id" },
  state_report_alert: { column: "state_report_id" },
  state_report_attachment: { column: "state_report_id" },
  visited_section_attachment: {
    column: "visited_section_id",
    parent: { table: "visited_section", column: "state_report_id" },
  },
  state_report_alert_attachment: {
    column: "state_report_alert_id",
    parent: { table: "state_report_alert", column: "state_report_id" },
  },
};

// Fields a client may still change on a sent state report ("disabled" removes it from the list).
const stateReportFieldsEditableWhenLocked = ["disabled"];

// Same rule as the frontend's getIsStateReportDisabled: once the PDF exists the report is
// read-only, unless the validator declined it.
export const isStateReportLocked = (stateReport: {
  attachment_id: string | null;
  validation_status: string | null;
}) => !!stateReport.attachment_id && stateReport.validation_status !== "declined";

const findStateReportId = async (trx: Trx, operation: Static<typeof crudTSchema>): Promise<string | null> => {
  const { type, id, op } = operation;
  const data = (operation.data ?? {}) as Record<string, unknown>;

  if (type === "state_report") return id;

  const mapping = stateReportChildTables[type];
  if (!mapping) return null;

  // A PUT carries its foreign key; a PATCH/DELETE must look the existing row up
  // (a PATCH could also try to move the row to another report: check the stored one).
  let foreignId: string | null = null;
  if (op === "PUT") {
    foreignId = (data[mapping.column] as string | undefined) ?? null;
  } else {
    const row = await trx
      .selectFrom(type as any)
      .select(mapping.column as any)
      .where("id", "=", id)
      .executeTakeFirst();
    foreignId = ((row as any)?.[mapping.column] as string | undefined) ?? null;
  }
  if (!foreignId) return null;

  if (!mapping.parent) return foreignId;

  const parentRow = await trx
    .selectFrom(mapping.parent.table as any)
    .select(mapping.parent.column as any)
    .where("id", "=", foreignId)
    .executeTakeFirst();
  return ((parentRow as any)?.[mapping.parent.column] as string | undefined) ?? null;
};

const isForbiddenOnLockedStateReport = async (trx: Trx, operation: Static<typeof crudTSchema>) => {
  const stateReportId = await findStateReportId(trx, operation);
  if (!stateReportId) return false;

  const stateReport = await trx
    .selectFrom("state_report")
    .select(["attachment_id", "validation_status"])
    .where("id", "=", stateReportId)
    .executeTakeFirst();
  if (!stateReport || !isStateReportLocked(stateReport)) return false;

  if (operation.type === "state_report" && operation.op === "PATCH") {
    const changedFields = Object.keys((operation.data ?? {}) as object);
    return changedFields.some((field) => !stateReportFieldsEditableWhenLocked.includes(field));
  }

  return true;
};

export class SyncService {
  async applyCrud(operation: Static<typeof crudTSchema>, user: AuthUser) {
    if (!user) return { success: false, error: "Unauthorized" };

    await db
      .insertInto("transactions")
      .values({
        id: v4(),
        entity_id: operation.id,
        type: operation.type,
        op_id: operation.op_id,
        tx_id: operation.tx_id,
        data: JSON.stringify(operation.data),
        op: operation.op,
        created_at: new Date().toISOString(),
        user_id: user.id,
      })
      .execute();

    const { type: table, id, op } = operation;
    const data = (operation.data ?? {}) as Row;
    const syncUser = { id: user.id, service_id: user.service_id };

    const refuse = (reason: string) => {
      // Refused writes are answered with 200, like other failures: a 4xx would block the client's upload queue.
      // The client gets the stored row back at its next sync.
      debug("Refused", op, "on", table, id, "for user", user.id, ":", reason);
      sentry?.captureMessage("Écriture de synchronisation refusée", {
        level: "warning",
        extra: { table, op, id, userId: user.id, reason },
      });
      return { success: false, error: "Forbidden" };
    };

    // unknown tables are refused before any query, so their name never reaches SQL
    if (!Object.hasOwn(syncPolicies, table)) return refuse(`table ${table} non modifiable`);

    try {
      return await db.transaction().execute(async (trx) => {
        const existing = (await trx
          .selectFrom(table as any)
          .selectAll()
          .where("id", "=", id)
          .forUpdate()
          .executeTakeFirst()) as Row | undefined;

        const decision: Decision = await evaluateWrite({
          trx,
          user: syncUser,
          table,
          op,
          id,
          data,
          existing: existing ?? null,
        });

        if (!decision.allowed) return refuse(decision.reason);

        if (decision.dropped.length) {
          debug("Ignored server-owned columns", decision.dropped, "on", table, id, "for user", user.id);
        }

        if (await isForbiddenOnLockedStateReport(trx, operation)) {
          debug("Rejecting", op, "on", table, id, ": state report already sent");
          // Answer 200 so the client drops the operation instead of retrying it forever;
          // PowerSync then syncs the server state back, undoing the local change.
          return { success: false, error: "Ce constat d'état a été envoyé et ne peut plus être modifié" };
        }

        if (table === "user_settings" && (op === "PUT" || op === "PATCH")) {
          // On a PATCH of a row the server never received, the policy has nothing to check: keep the client columns
          // minus the server-owned ones, and apply them to the user's own row.
          const serverColumns = syncPolicies.user_settings?.serverColumns ?? [];
          const values =
            op === "PATCH" && !existing
              ? Object.fromEntries(Object.entries(data).filter(([column]) => column !== "id" && !serverColumns.includes(column)))
              : decision.values;
          const handled = await applyUserSettingsWrite(trx, operation, user, values);
          if (handled) return { success: true };
        }

        if (op === "DELETE") {
          debug("Deleting row on table", table, "with id", id);
          await trx
            .deleteFrom(table as any)
            .where("id", "=", id)
            .execute();
        }
        if (op === "PATCH" && Object.keys(decision.values).length) {
          debug("Patching row on table", table, "with id", id);
          await trx
            .updateTable(table as any)
            .set(decision.values as any)
            .where("id", "=", id)
            .execute();
        }
        if (op === "PUT") {
          debug("Inserting row on table", table);
          await trx
            .insertInto(table as any)
            .values({ ...decision.values, id } as any)
            .execute();
        }

        return { success: true };
      });
    } catch (e) {
      debug("Error on applyCrud", e);

      return { success: false, error: e };
    }
  }
}

/**
 * Keep a single user_settings row per user and service. Two devices that create their settings
 * offline each insert their own row; the server then held two rows and the send route could read
 * the one without validation. A PUT for an existing (user, service) pair, and a PATCH on a row id
 * the server never received, are applied to the existing row instead; the device's local row is
 * replaced by the server one at its next sync.
 * Returns true when the write was applied here.
 */
const applyUserSettingsWrite = async (
  trx: Trx,
  operation: Static<typeof crudTSchema>,
  user: AuthUser,
  data: Record<string, unknown>,
) => {
  const { id, op } = operation;

  if (op === "PUT") {
    const userId = (data.user_id as string | undefined) ?? user.id;
    const serviceId = (data.service_id as string | undefined) ?? user.service_id;
    const existing = await trx
      .selectFrom("user_settings")
      .select("id")
      .where("user_id", "=", userId)
      .where("service_id", "=", serviceId)
      .where("id", "!=", id)
      .orderBy("id")
      .executeTakeFirst();
    if (!existing) return false;

    debug("user_settings already exists for this user and service, updating", existing.id, "instead of inserting", id);
    if (Object.keys(data).length > 0) {
      await trx
        .updateTable("user_settings")
        .set(data as any)
        .where("id", "=", existing.id)
        .execute();
    }
    return true;
  }

  // PATCH
  if (Object.keys(data).length === 0) return false;
  const result = await trx
    .updateTable("user_settings")
    .set(data as any)
    .where("id", "=", id)
    .executeTakeFirst();
  if (Number(result.numUpdatedRows) > 0) return true;

  debug("user_settings", id, "unknown on the server, patching the row of user", user.id, "instead");
  await trx
    .updateTable("user_settings")
    .set(data as any)
    .where("id", "=", (eb) =>
      eb
        .selectFrom("user_settings")
        .select("id")
        .where("user_id", "=", user.id)
        .where("service_id", "=", user.service_id)
        .orderBy("id")
        .limit(1),
    )
    .execute();
  return true;
};

export const crudTSchema = Type.Object({
  op_id: Type.Number(),
  tx_id: Nullable(Type.Number()),
  id: Type.String(),
  type: Type.String(),
  op: Type.String(),
  data: Type.Optional(Type.Any()),
});
