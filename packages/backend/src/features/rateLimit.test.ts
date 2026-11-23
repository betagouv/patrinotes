import fastify from "fastify";
import { describe, expect, it } from "vitest";
import {
  assertUserRateLimit,
  authRateLimit,
  publicRateLimit,
  RATE_LIMIT_MESSAGE,
  RateLimitError,
  registerRateLimits,
} from "./rateLimit";

const makeApp = async () => {
  const app = fastify({ trustProxy: (_address, hop) => hop < 1 });
  await registerRateLimits(app, { enabled: true });
  app.post("/login", { preHandler: authRateLimit }, async () => ({ ok: true }));
  app.get("/public", { onRequest: publicRateLimit }, async () => ({ ok: true }));
  app.get("/api", async (request) => {
    await assertUserRateLimit(request, String(request.headers["x-user"]));
    return { ok: true };
  });
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof RateLimitError) return reply.status(429).send({ error: error.message });
    return reply.status(500).send({ error: "?" });
  });
  await app.ready();
  return app;
};

const login = (app: Awaited<ReturnType<typeof makeApp>>, email: string, ip = "203.0.113.1") =>
  app.inject({ method: "POST", url: "/login", payload: { email, password: "x" }, headers: { "x-forwarded-for": ip } });

describe("rate limits (SEC-06)", () => {
  it("allows 10 attempts per email address in 15 minutes, whatever its case or spaces", async () => {
    const app = await makeApp();
    for (let i = 0; i < 10; i++) {
      expect((await login(app, i % 2 ? "Agent@Culture.gouv.fr " : "agent@culture.gouv.fr", `203.0.113.${i}`)).statusCode).toBe(200);
    }
    const refused = await login(app, "AGENT@culture.gouv.fr", "198.51.100.7");
    expect(refused.statusCode).toBe(429);
    expect(refused.json()).toEqual({ error: RATE_LIMIT_MESSAGE });
    expect(Number(refused.headers["retry-after"])).toBeGreaterThan(0);
    // another address is not affected
    expect((await login(app, "autre@culture.gouv.fr", "198.51.100.7")).statusCode).toBe(200);
  });

  it("allows 50 attempts per IP in 15 minutes, whatever the address", async () => {
    const app = await makeApp();
    for (let i = 0; i < 50; i++) {
      expect((await login(app, `agent${i}@culture.gouv.fr`)).statusCode).toBe(200);
    }
    expect((await login(app, "agent50@culture.gouv.fr")).statusCode).toBe(429);
    // the client IP comes from the last proxy hop: another client is not affected
    expect((await login(app, "agent50@culture.gouv.fr", "203.0.113.2")).statusCode).toBe(200);
  });

  it("reads the client IP from the proxy hop, not from an address chosen by the client", async () => {
    const app = await makeApp();
    for (let i = 0; i < 50; i++) await login(app, `a${i}@culture.gouv.fr`, `10.0.0.${i}, 203.0.113.9`);
    // the forged first address changes, the address seen by the proxy stays the same
    expect((await login(app, "b@culture.gouv.fr", "10.9.9.9, 203.0.113.9")).statusCode).toBe(429);
  });

  it("allows 60 requests per minute per IP on public routes", async () => {
    const app = await makeApp();
    const get = () => app.inject({ method: "GET", url: "/public", headers: { "x-forwarded-for": "203.0.113.5" } });
    for (let i = 0; i < 60; i++) expect((await get()).statusCode).toBe(200);
    const refused = await get();
    expect(refused.statusCode).toBe(429);
    expect(refused.json()).toEqual({ error: RATE_LIMIT_MESSAGE });
  });

  it("allows 1,200 requests per minute per user on the authenticated API", async () => {
    const app = await makeApp();
    const get = (user: string) => app.inject({ method: "GET", url: "/api", headers: { "x-user": user } });
    for (let i = 0; i < 1200; i++) expect((await get("user-a")).statusCode).toBe(200);
    expect((await get("user-a")).statusCode).toBe(429);
    expect((await get("user-b")).statusCode).toBe(200);
  });

  it("does nothing when disabled (end-to-end tests)", async () => {
    const app = fastify();
    await registerRateLimits(app, { enabled: false });
    app.get("/public", { onRequest: publicRateLimit }, async () => ({ ok: true }));
    for (let i = 0; i < 100; i++) expect((await app.inject({ method: "GET", url: "/public" })).statusCode).toBe(200);
  });
});
