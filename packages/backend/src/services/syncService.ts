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
      if (operation.type === "user_settings" && (operation.op === "PUT" || operation.op === "PATCH")) {
        const handled = await applyUserSettingsWrite(operation, user);
        if (handled) return { success: true };
      }

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

/**
 * Keep a single user_settings row per user and service. Two devices that create their settings
 * offline each insert their own row; the server then held two rows and the send route could read
 * the one without validation. A PUT for an existing (user, service) pair, and a PATCH on a row id
 * the server never received, are applied to the existing row instead; the device's local row is
 * replaced by the server one at its next sync.
 * Returns true when the write was applied here.
 */
const applyUserSettingsWrite = async (operation: Static<typeof crudTSchema>, user: AuthUser) => {
  const { id, op } = operation;
  const data = { ...((operation.data ?? {}) as Record<string, unknown>) };
  delete data.id;

  if (op === "PUT") {
    const userId = (data.user_id as string | undefined) ?? user.id;
    const serviceId = (data.service_id as string | undefined) ?? user.service_id;
    const existing = await db
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
      await db
        .updateTable("user_settings")
        .set(data as any)
        .where("id", "=", existing.id)
        .execute();
    }
    return true;
  }

  // PATCH
  if (Object.keys(data).length === 0) return false;
  const result = await db
    .updateTable("user_settings")
    .set(data as any)
    .where("id", "=", id)
    .executeTakeFirst();
  if (Number(result.numUpdatedRows) > 0) return true;

  debug("user_settings", id, "unknown on the server, patching the row of user", user.id, "instead");
  await db
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
