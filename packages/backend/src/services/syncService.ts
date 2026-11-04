import { Static, TSchema, Type } from "@sinclair/typebox";
import { db } from "../db/db";
import { makeDebug } from "../features/debug";
import { v4 } from "uuid";
import { AuthUser } from "../routes/authMiddleware";
import { Decision, evaluateWrite, Row, syncPolicies } from "../features/sync/syncPolicy";
import { sentry } from "../features/sentry";

const debug = makeDebug("sync-service");

export const Nullable = <T extends TSchema>(schema: T) => Type.Optional(Type.Union([schema, Type.Null()]));

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

export const crudTSchema = Type.Object({
  op_id: Type.Number(),
  tx_id: Nullable(Type.Number()),
  id: Type.String(),
  type: Type.String(),
  op: Type.String(),
  data: Type.Optional(Type.Any()),
});
