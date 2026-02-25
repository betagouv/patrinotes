import { defineConfig } from "drizzle-kit";
import { ENV, isDev, isProd } from "./src/envVars";

export const config = {
  port: ENV.POSTGRES_PORT,
  host: ENV.POSTGRES_HOST,
  user: ENV.POSTGRES_USER,
  password: ENV.POSTGRES_PASSWORD,
  database: ENV.POSTGRES_DB,
};

export const usersDatabaseUrl = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "../../db",
  dialect: "postgresql",
  dbCredentials: { ...config, ssl: isProd },
});
