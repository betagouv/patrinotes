import { Static, TSchema, Type } from "@sinclair/typebox";
import { db } from "../db/db";
import { makeDebug } from "../features/debug";
import { v4 } from "uuid";
import { AuthUser } from "../routes/authMiddleware";
import { ENV } from "../envVars";

const debug = makeDebug("sync-service");

export const Nullable = <T extends TSchema>(schema: T) => Type.Optional(Type.Union([schema, Type.Null()]));

const blackListedTables = ["internal_user"];

const getBlackListedTables = () => {
  const base = [...blackListedTables];

  return base;
};

export class SyncService {
  async applyCrud(operation: Static<typeof crudTSchema>, user: AuthUser) {
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

    if (getBlackListedTables().includes(operation.type)) {
      return { error: "Unauthorized" };
    }

    try {
      if (operation.op === "DELETE") {
        debug("Deleting row on table", operation.type, "with id", operation.id);
        const { type, id } = operation;
        await db
          .deleteFrom(type as any)
          .where("id", "=", id)
          .execute();
      }
      if (operation.op === "PATCH") {
        debug("Patching row on table", operation.type, "with id", operation.id);
        const { type, id, data } = operation;
        await db
          .updateTable(type as any)
          .set(data as any)
          .where("id", "=", id)
          .execute();
      }
      if (operation.op === "PUT") {
        debug("Inserting row on table", operation.type);
        const { type, data, id } = operation;
        await db
          .insertInto(type as any)
          .values({ id, ...data } as any)
          .execute();
      }
    } catch (e) {
      debug("Error on applyCrud", e);

      return { success: false, error: e };
    }

    return { success: true };
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
