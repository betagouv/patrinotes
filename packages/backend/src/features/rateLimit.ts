import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isTest } from "../envVars";
import { normalizeEmail } from "./email";
import { makeDebug } from "./debug";
import { AppError } from "./errors";

const debug = makeDebug("rate-limit");

/** Message shown by the login, signup and password forms (they display the `error` field of the response). */
export const RATE_LIMIT_MESSAGE = "Trop de tentatives, réessayez dans quelques minutes.";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

/**
 * Limits (SEC-06):
 * - login, signup, forgotten password: 10 attempts per 15 min per email address, and 200 per 15 min per IP;
 * - other public routes (constat validation, short links, public statistics): 60 per minute per IP;
 * - authenticated API (sync upload included): 1,200 per minute per user.
 */
export const rateLimits = {
  authEmail: { max: 10, timeWindow: FIFTEEN_MINUTES },
  authIp: { max: 200, timeWindow: FIFTEEN_MINUTES },
  public: { max: 60, timeWindow: ONE_MINUTE },
  user: { max: 1200, timeWindow: ONE_MINUTE },
} as const;

export type RateLimitName = keyof typeof rateLimits;

type Limiter = (req: FastifyRequest) => Promise<{ isAllowed: boolean; isExceeded?: boolean; ttlInSeconds?: number }>;

let limiters: Partial<Record<RateLimitName, Limiter>> = {};
const rateLimitKey = Symbol("rateLimitKey");
const userCounted = Symbol("userRateLimitCounted");

/** Thrown in the /api routes once authenticated: answered 429 with the message, without logging it as an error. */
export class RateLimitError extends AppError {
  constructor(public retryAfter: number) {
    super(429, RATE_LIMIT_MESSAGE);
  }
}

/**
 * Registers @fastify/rate-limit (no global limit) and creates one limiter per rule. Each limiter has its own store,
 * keyed by the value given by the route (email, IP, user id), so one request can be counted by several rules.
 * Disabled under NODE_ENV=test (end-to-end tests log in many times from localhost) unless `enabled` is passed.
 */
export const registerRateLimits = async (fastify: FastifyInstance, { enabled = !isTest } = {}) => {
  limiters = {};
  if (!enabled) return;

  await fastify.register(rateLimit, { global: false });
  for (const [name, { max, timeWindow }] of Object.entries(rateLimits)) {
    limiters[name as RateLimitName] = fastify.createRateLimit({
      max,
      timeWindow,
      // the key is computed by the caller and given through the request (see `consume`)
      keyGenerator: (req) => `${name}:${(req as any)[rateLimitKey]}`,
    }) as unknown as Limiter;
  }
};

/** Counts one hit for `key` against the rule; true when the limit is exceeded. */
export const consume = async (name: RateLimitName, request: FastifyRequest, key: string) => {
  const limiter = limiters[name];
  if (!limiter) return { exceeded: false, retryAfter: 0 };
  (request as any)[rateLimitKey] = key;
  const result = await limiter(request);
  return { exceeded: !result.isAllowed && !!result.isExceeded, retryAfter: result.ttlInSeconds ?? 0 };
};

const sendTooManyRequests = (reply: FastifyReply, retryAfter: number) =>
  reply
    .code(429)
    .header("Retry-After", String(Math.max(retryAfter, 1)))
    .send({ error: RATE_LIMIT_MESSAGE });

/** Email address of a login, signup or password request, normalized as stored ("" when absent). */
export const getRequestEmail = (request: FastifyRequest) => {
  const email = (request.body as { email?: unknown } | undefined)?.email;
  return typeof email === "string" ? normalizeEmail(email) : "";
};

/**
 * preHandler of the login, signup and forgotten-password routes: per IP, and per email address when the body holds
 * one (the reset form only holds the reset link, it is limited by IP). Every attempt counts, successful or not.
 */
export const authRateLimit = async (request: FastifyRequest, reply: FastifyReply) => {
  const ip = await consume("authIp", request, request.ip);
  const email = getRequestEmail(request);
  const byEmail = email ? await consume("authEmail", request, email) : { exceeded: false, retryAfter: 0 };
  if (ip.exceeded || byEmail.exceeded) {
    debug("Too many attempts on", request.routeOptions?.url, ip.exceeded ? "(IP)" : "(email)");
    return sendTooManyRequests(reply, Math.max(ip.retryAfter, byEmail.retryAfter));
  }
};

/** onRequest hook of the public routes (constat validation, short links, public statistics): per IP. */
export const publicRateLimit = async (request: FastifyRequest, reply: FastifyReply) => {
  const { exceeded, retryAfter } = await consume("public", request, request.ip);
  if (exceeded) {
    debug("Too many requests on", request.routeOptions?.url, "(IP)");
    return sendTooManyRequests(reply, retryAfter);
  }
};

/** Called once the user is authenticated (authenticate middleware), at most once per request: per user. */
export const assertUserRateLimit = async (request: FastifyRequest, userId: string) => {
  if ((request as any)[userCounted]) return;
  (request as any)[userCounted] = true;
  const { exceeded, retryAfter } = await consume("user", request, userId);
  if (exceeded) {
    debug("Too many requests on", request.routeOptions?.url, "for user", userId);
    throw new RateLimitError(retryAfter);
  }
};
