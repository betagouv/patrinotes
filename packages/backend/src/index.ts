import "./envVars";
import { onHmr, registerViteHmrServerRestart } from "./hmr";

import { ENV, isTest } from "./envVars";
import { generateOpenApi, initFastify } from "./router";
import { makeDebug } from "./features/debug";
import { initPopImmeubles, initPopObjets } from "./features/data/pop";
import { db } from "./db/db";

const debug = makeDebug("index");

let server: Awaited<ReturnType<typeof initFastify>> | undefined;

const start = async () => {
  await registerViteHmrServerRestart();
  await initEmptyService();

  if (ENV.FORCE_REFETCH_POP) {
    await initPopImmeubles();
    await initPopObjets();
  }

  debug("Starting fastify server in", ENV.NODE_ENV, "mode");

  const fastifyInstance = await initFastify();
  server = fastifyInstance;
  await fastifyInstance.listen({ port: ENV.PORT, host: "0.0.0.0" });

  debug(`Server listening on ${ENV.PORT}`);

  onHmr(async () => {
    await fastifyInstance.close();
  });
};

const initEmptyService = async () => {
  debug("Initializing empty service...");
  const existing = await db.selectFrom("service").selectAll().where("id", "=", "no-service").executeTakeFirst();
  if (existing) return;
  return db.insertInto("service").values({ id: "no-service", visible: false, department: "" }).execute();
};

const shouldCreateOnly = process.argv.includes("--create-only");

if (shouldCreateOnly) {
  debug("Generating openapi.json");
  await generateOpenApi();

  debug("openapi.json generated");
  process.exit(0);
} else {
  start();
}

const onSIGINT = () => process.exit();
process.on("SIGINT", onSIGINT);
onHmr(() => process.off("SIGINT", onSIGINT));

// In the container node is PID 1: without a handler SIGTERM is ignored and the orchestrator has to SIGKILL it.
// Stop accepting connections, let in-flight requests finish (8 s at most, under the 10 s default of docker stop), then exit.
const onSIGTERM = () => {
  debug("SIGTERM received, closing server");
  setTimeout(() => process.exit(1), 8_000).unref();
  Promise.resolve(server?.close()).finally(() => process.exit(0));
};
process.on("SIGTERM", onSIGTERM);
onHmr(() => process.off("SIGTERM", onSIGTERM));
