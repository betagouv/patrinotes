import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_URL: z.string(),
});

export const ENV = envSchema.parse(import.meta.env);
