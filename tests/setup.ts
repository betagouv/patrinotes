import { exec, execSync, spawnSync } from "child_process";
import { db, makeDb } from "../packages/backend/src/db/db";
import { mockServices, mockUsers } from "./utils";

export default async function setup() {
  execSync("docker compose -p patrinotes-test -f docker-compose.test.yaml --env-file ./.env.test up --wait", {
    env: {
      ...process.env,
      NODE_ENV: "test",
    },
    stdio: "inherit",
  });

  execSync(`pnpm migration:up`, {
    env: {
      ...process.env,
      NODE_ENV: "test",
    },
    stdio: "inherit",
  });

  ref.backend = exec(
    "pnpm backend dev",
    {
      env: {
        ...process.env,
        NODE_ENV: "test",
      },
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting backend: ${error}`);
        return;
      }
      if (stdout) {
        console.log(`Backend stdout: ${stdout}`);
      }
      if (stderr) {
        console.error(`Backend stderr: ${stderr}`);
      }
    },
  );

  console.log("Setting up database...");

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
