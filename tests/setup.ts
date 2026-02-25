import { exec, execSync, spawnSync } from "child_process";
import { db, makeDb } from "../packages/backend/src/db/db";
import { mockServices, mockUsers } from "./utils";
import { deleteUserByEmail } from "../packages/backend/src/features/auth/keycloak";

export default async function setup() {
  console.log("Setting up database...");

  // delete keycloak users
  for (const user of mockUsers) {
    try {
      await deleteUserByEmail(user.email);
    } catch {}
  }

  // delete and re-insert test data
  await db.deleteFrom("internal_user").execute();
  await db.deleteFrom("user").execute();
  await db
    .deleteFrom("service")
    .where(
      "id",
      "in",
      mockServices.map((s) => s.id),
    )
    .execute();
  await db.deleteFrom("whitelist").execute();

  await db.insertInto("service").values(mockServices).execute();
  await db
    .insertInto("whitelist")
    .values(mockUsers.map((u) => ({ email: u.email })))
    .execute();

  const usersCount = await db
    .selectFrom("user")
    .select((eb) => eb.fn.count("id").as("count"))
    .executeTakeFirstOrThrow();
  console.log(`Users count: ${usersCount.count}`);

  const servicesCount = await db
    .selectFrom("service")
    .select((eb) => eb.fn.count("id").as("count"))
    .executeTakeFirstOrThrow();
  console.log(`Services count: ${servicesCount.count}`);

  console.log("Database setup completed");
}

const ref: { backend?: ReturnType<typeof exec> } = {};
