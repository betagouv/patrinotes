import { sql } from "kysely";
import { db } from "../db/db";
import { checkStorage } from "../services/uploadService";

const CHECK_TIMEOUT_MS = 3000;

type CheckStatus = "ok" | "error";

const runCheck = async (name: string, check: (signal: AbortSignal) => Promise<unknown>): Promise<CheckStatus> => {
  const controller = new AbortController();
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`timeout after ${CHECK_TIMEOUT_MS} ms`));
    }, CHECK_TIMEOUT_MS);
  });
  try {
    await Promise.race([check(controller.signal), timeout]);
    return "ok";
  } catch (error) {
    // the reason stays in the server logs: the probe is public and must not describe the infrastructure
    console.error(`readiness check "${name}" failed:`, (error as Error)?.message ?? error);
    return "error";
  } finally {
    clearTimeout(timer);
  }
};

export const checkReadiness = async () => {
  const [database, storage] = await Promise.all([
    runCheck("database", () => sql`select 1`.execute(db)),
    runCheck("storage", (signal) => checkStorage({ abortSignal: signal })),
  ]);
  const checks = { database, storage };
  return { ready: database === "ok" && storage === "ok", checks };
};
