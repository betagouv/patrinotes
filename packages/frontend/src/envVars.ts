import { z } from "zod";

export const isDev = !z.boolean().parse(import.meta.env.PROD);

const stringOrNumberAsBoolean = z
  .enum(["true", "false"])
  .or(z.number())
  .or(z.boolean())
  .transform((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val !== 0;
    return val === "true";
  });

const envSchema = z.object({
  VITE_BACKEND_URL: z.string(),
  VITE_POWERSYNC_URL: z.string(),
  VITE_AUTH_URL: z.string(),
  VITE_AUTH_REALM: z.string(),
  VITE_AUTH_CLIENT_ID: z.string(),
});

const isSW = typeof window === "undefined";

const safeParseEnv = (env: Record<string, string>): z.infer<typeof envSchema> => {
  try {
    return envSchema.parse(env);
  } catch (e) {
    console.error("Error parsing env vars");
    return {} as any;
  }
};

export const ENV = safeParseEnv(isDev ? import.meta.env : isSW ? self.ENV : window.ENV);

declare global {
  interface Window {
    ENV: typeof ENV;
    APP_VERSION?: string;
  }
}
