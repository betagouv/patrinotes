import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

console.log(`Running in ${process.env.NODE_ENV} mode`);

if (process.env.NODE_ENV === "test") {
  expand(config({ path: "../../.env.test" }));
} else {
  expand(config({ path: "../../.env" }));
}

export const isDev = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";
export const isProd = !isDev && !isTest;

const stringOrNumberAsNumber = z.string().or(z.number()).transform(Number);
const anythingAsBoolean = z.any().transform((val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.toLowerCase() === "true";
  return Boolean(val);
});

const envSchema = z.object({
  POSTGRES_PORT: stringOrNumberAsNumber.default(5432),
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  DATAGOUV_API: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string().default("development"),
  PORT: stringOrNumberAsNumber.default(3001),
  DEBUG: z.string().default("cr-vif:*"),
  FRONTEND_URL: z.string(),
  BACKEND_URL: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: stringOrNumberAsNumber.default(465),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_EMITTER: z.string(),
  MINIO_ACCESS_KEY_ID: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_URL: z.string(),
  MINIO_PUBLIC_URL: z.string().optional(),
  MINIO_BUCKET: z.string(),
  SENTRY_DSN: z.string().optional(),

  // AUTH — sessions are issued by this backend (see features/auth)
  // RS256 private key (PKCS8 PEM, "\n" escapes accepted) signing the access tokens PowerSync verifies
  // through /api/auth/jwks.json. Required in production; an ephemeral key is generated otherwise.
  AUTH_JWT_PRIVATE_KEY: z.string().optional(),
  ACCESS_TOKEN_TTL_SECONDS: stringOrNumberAsNumber.default(3600),
  // how long an agent may stay without syncing before having to sign in again (sliding)
  AUTH_SESSION_IDLE_DAYS: stringOrNumberAsNumber.default(90),
  // sign-in emails one address may request per hour
  AUTH_MAGIC_LINK_MAX_PER_HOUR: stringOrNumberAsNumber.default(5),

  // ProConnect (disabled when PROCONNECT_CLIENT_ID is not set)
  // integration: fca.integ01.dev-agentconnect.fr — production: auth.agentconnect.gouv.fr
  PROCONNECT_DOMAIN: z.string().default("fca.integ01.dev-agentconnect.fr"),
  PROCONNECT_CLIENT_ID: z.string().optional(),
  PROCONNECT_CLIENT_SECRET: z.string().optional(),
  PROCONNECT_SCOPES: z.string().default("openid email given_name usual_name uid siret"),

  // LEGACY KEYCLOAK — only to migrate sessions opened before ProConnect, remove once every agent has migrated.
  // When set, a Keycloak refresh token presented to /api/refresh-token is exchanged for a new session.
  VITE_AUTH_CLIENT_ID: z.string().optional(),
  VITE_AUTH_URL: z.string().optional(),
  VITE_AUTH_REALM: z.string().optional(),
  AUTH_CLIENT_SECRET: z.string().optional(),
  // COLLECTIF_OBJETS_DATASETTE_URL: z.string(),

  FORCE_REFETCH_POP: anythingAsBoolean.default(false),

  ASSETS_DIR: z.string().optional(),

  // Unités patrimoniales (dataspace API, only reachable from the production network)
  UP_API_MODE: z.enum(["mock", "live"]).default("mock"),
  UP_API_URL: z.string().default("https://api-ext.stg.cloud.culture.fr/dataspace/patrinote/up"),
  UP_API_KEY: z.string().optional(),
  UP_CACHE_TTL_HOURS: stringOrNumberAsNumber.default(24),
});

export const ENV = envSchema
  .refine((env) => !isProd || !!env.AUTH_JWT_PRIVATE_KEY, {
    message: "AUTH_JWT_PRIVATE_KEY is required in production (generate it with: pnpm backend auth:generate-key)",
    path: ["AUTH_JWT_PRIVATE_KEY"],
  })
  .refine((env) => !env.PROCONNECT_CLIENT_ID || !!env.PROCONNECT_CLIENT_SECRET, {
    message: "PROCONNECT_CLIENT_SECRET is required when PROCONNECT_CLIENT_ID is set",
    path: ["PROCONNECT_CLIENT_SECRET"],
  })
  .refine((env) => env.UP_API_MODE !== "live" || !!env.UP_API_KEY, {
    message: "UP_API_KEY is required when UP_API_MODE=live",
    path: ["UP_API_KEY"],
  })
  .parse(process.env);
