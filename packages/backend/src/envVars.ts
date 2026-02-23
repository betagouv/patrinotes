import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

export const isDev = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";
export const isProd = !isDev && !isTest;

expand(config({ path: `../../${isTest ? ".env.test" : ".env"}` }));

const stringOrNumberAsNumber = z.string().or(z.number()).transform(Number);

const envSchema = z.object({
  POSTGRES_PORT: stringOrNumberAsNumber.default(5432),
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  DATAGOUV_API: z.string(),
  TOKEN_LIFETIME: z.string().default("60m"),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  NODE_ENV: z.string().default("development"),
  PORT: stringOrNumberAsNumber.default(3001),
  DEBUG: z.string().default("cr-vif:*"),
  FRONTEND_URL: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: stringOrNumberAsNumber.default(465),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_EMITTER: z.string(),
  MINIO_ACCESS_KEY_ID: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_URL: z.string(),
  MINIO_BUCKET: z.string(),
  SENTRY_DSN: z.string().optional(),
  VITE_AUTH_CLIENT_ID: z.string(),
  VITE_AUTH_URL: z.string(),
  VITE_AUTH_REALM: z.string(),
  AUTH_ADMIN_CLIENT_ID: z.string(),
  AUTH_ADMIN_CLIENT_SECRET: z.string(),
  AUTH_CLIENT_SECRET: z.string(),
  // COLLECTIF_OBJETS_DATASETTE_URL: z.string(),

  VITE_ALERTES_MH_ENABLED: z.string().optional(),
});

export const ENV = envSchema.parse(process.env);
