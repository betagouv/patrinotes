import "./envVars";
import { onHmr, registerViteHmrServerRestart } from "./hmr";

import { ENV, isTest } from "./envVars";
import { generateOpenApi, initFastify } from "./router";
import { makeDebug } from "./features/debug";
import { fetchPopCSV, initPopImages, initPopImmeubles, initPopObjets } from "./features/data/pop";
import { db } from "./db/db";

const debug = makeDebug("index");

const start = async () => {
  await registerViteHmrServerRestart();
  await initEmptyService();

  if (!isTest) {
    await initPopImmeubles();
    await initPopObjets();
  }

  // await initPopImages();
  debug("Starting fastify server in", ENV.NODE_ENV, "mode");

  const fastifyInstance = await initFastify();
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
