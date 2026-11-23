import { TypeBoxValidatorCompiler, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify, { type FastifyError } from "fastify";
import { FetchError } from "ofetch";
import { AppError, isValidationError, VALIDATION_ERROR_MESSAGE } from "./features/errors";
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
import { ENV, isDev, isProd } from "./envVars";
import { makeCorsOriginChecker, registerSecurityHeaders } from "./features/httpSecurity";
import { stateReportPlugin } from "./routes/stateReportRoutes";
import { upPlugin } from "./routes/upRoutes";
import { monumentAlertPlugin } from "./routes/monumentAlertRoutes";
import { validationPlugin } from "./routes/validationRoutes";
import { adminPlugin } from "./routes/adminRoutes";
import { statsPlugin } from "./routes/statsRoutes";
import { attachmentRedirectPlugin } from "./routes/attachmentRedirectRoutes";
import { checkReadiness } from "./features/health";
import { RateLimitError, registerRateLimits } from "./features/rateLimit";

const debug = makeDebug("fastify");

export const initFastify = async () => {
  const fastifyInstance = fastify({
    routerOptions: { maxParamLength: 5000 },
    // Behind Traefik: request.ip is the address Traefik saw (last X-Forwarded-For hop), not Traefik's own.
    // Trusting a hop count rather than every proxy keeps a client from choosing its IP with its own header.
    trustProxy: (_address, hop) => hop < ENV.TRUST_PROXY_HOPS,
  })
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

  const isAllowedOrigin = makeCorsOriginChecker({
    frontendUrl: ENV.FRONTEND_URL,
    extraOrigins: ENV.CORS_ORIGINS,
    allowLocalhost: !isProd,
  });
  fastifyInstance.register(cors, {
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    // @fastify/cors >= 10 only allows GET, HEAD and POST by default; keep the methods the frontend uses
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  registerSecurityHeaders(fastifyInstance, { hsts: isProd });

  await registerRateLimits(fastifyInstance);

  fastifyInstance.addHook("onRequest", async (request) => {
    // route pattern only: the URL may hold validation tokens, attachment ids, reset links or query parameters
    debug(request.method, request.routeOptions?.url ?? "(unknown route)");
    request.services = getServices();
  });

  fastifyInstance.get("/health", async (_, reply) => {
    reply.status(200).send({ status: "ok" });
  });

  // Readiness: PostgreSQL and S3 answer. /health stays a liveness probe (the process answers).
  fastifyInstance.get("/health/ready", async (_, reply) => {
    const { ready, checks } = await checkReadiness();
    reply.status(ready ? 200 : 503).send({ status: ready ? "ok" : "error", checks });
  });

  fastifyInstance.register(
    async (instance) => {
      instance.setErrorHandler((error: FastifyError, request, reply) => {
        if (error instanceof RateLimitError) {
          // expected under load or abuse: not an application error, not sent to Sentry
          return reply.status(429).header("Retry-After", String(Math.max(error.retryAfter, 1))).send({ error: error.message });
        }
        if (isValidationError(error)) {
          // malformed request (schema): a client error, not sent to Sentry; the route pattern is enough to debug it
          console.warn("[validation]", request.method, request.routeOptions?.url, error.message);
          return reply.status(400).send({ error: VALIDATION_ERROR_MESSAGE });
        }
        if ((error as unknown) instanceof FetchError) {
          // the message holds the full upstream URL, which may contain an email (Keycloak user lookups)
          const fetchError = error as unknown as FetchError;
          const upstream = String(fetchError.request ?? "").split("?")[0];
          console.error("[fetch]", fetchError.status, upstream, fetchError.data?.error ?? "");
        } else {
          console.error(error);
        }
        // route pattern only: the body may hold passwords or document data, params may hold tokens
        sentry?.captureException(error, { extra: { method: request.method, route: request.routeOptions?.url } });
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
      await instance.register(upPlugin, { prefix: "/up" });
      await instance.register(monumentAlertPlugin, { prefix: "/monument-alert" });
      await instance.register(validationPlugin);
      await instance.register(syncPlugin);
      await instance.register(adminPlugin, { prefix: "/admin" });
      await instance.register(statsPlugin, { prefix: "/stats" });
    },
    { prefix: "/api" },
  );

  await fastifyInstance.register(attachmentRedirectPlugin);

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
