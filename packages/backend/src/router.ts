import { TypeBoxValidatorCompiler, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { AppError } from "./features/errors";
import { userPlugin } from "./routes/userRoutes";
import { getServices } from "./services/services";
import cors from "@fastify/cors";
// import fastifySwagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger";
import fs from "node:fs/promises";
import { makeDebug } from "./features/debug";
import { staticDataPlugin } from "./routes/staticDataRoutes";
import { pdfPlugin } from "./routes/pdfRoutes";
import { uploadPlugin } from "./routes/uploadRoutes";
import { sentry } from "./features/sentry";
import { syncPlugin } from "./routes/syncRoutes";
import { authPlugin } from "./routes/authRoutes";
import { isDev } from "./envVars";
import { stateReportPlugin } from "./routes/stateReportRoutes";

const debug = makeDebug("fastify");

export const initFastify = async () => {
  const fastifyInstance = fastify({ maxParamLength: 5000 })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>();

  await fastifyInstance.register(swaggerUi, {
    prefix: "/documentation",
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Patrinotes API",
        description: "Patrinotes API Documentation",
        version: "1.0",
      },
    },
  });

  fastifyInstance.register(cors, {
    origin: "*",
  });

  fastifyInstance.addHook("onRequest", async (request) => {
    debug(request.method, request.url);
    request.services = getServices();
  });

  fastifyInstance.register(
    async (instance) => {
      instance.setErrorHandler((error, request, reply) => {
        console.error(error);
        sentry?.captureException(error, { data: { request: request.body, params: request.params } });
        if (error instanceof AppError) {
          reply.status(error.status).send({ error: error.message });
        } else {
          reply.status(500).send({
            error: "Une erreur s'est produite",
            ...(isDev ? { stack: error.stack, message: error.message } : {}),
          });
        }
      });

      await instance.register(authPlugin);
      await instance.register(userPlugin);
      await instance.register(staticDataPlugin);
      await instance.register(uploadPlugin, { prefix: "/upload" });
      await instance.register(pdfPlugin, { prefix: "/pdf" });
      await instance.register(stateReportPlugin, { prefix: "/state-report" });
      await instance.register(syncPlugin);
    },
    { prefix: "/api" },
  );

  await fastifyInstance.ready();

  return fastifyInstance;
};

export const generateOpenApi = async () => {
  const fastifyInstance = await initFastify();
  await fastifyInstance.ready();

  const swagger = fastifyInstance.swagger();

  await fs.writeFile("openapi.json", JSON.stringify(swagger));

  return fastifyInstance;
};
