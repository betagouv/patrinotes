import * as Sentry from "@sentry/node";
import { ENV, isDev } from "../envVars";

// Since SDK v11, leaving `dataCollection` unset collects users, cookies, request bodies, query data and local
// variables. This keeps the restrictive behaviour we had with `sendDefaultPii: false` (v7), everything off.
export const restrictiveDataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: {
    request: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
    response: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
  },
  httpBodies: [],
  urlQueryParams: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
  genAI: { inputs: false, outputs: false },
  mcp: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  graphQL: { document: false, variables: false },
  stackFrameVariables: false,
} satisfies Sentry.NodeOptions["dataCollection"];

// Keys whose values must never reach Sentry: credentials and personal data.
const SENSITIVE_KEY = /pass(word)?|token|secret|authorization|cookie|e-?mail|recipients?|^to$|^body$|^data$/i;

const scrub = (value: unknown, depth = 0): unknown => {
  if (!value || typeof value !== "object" || depth > 5) return value;
  if (Array.isArray(value)) return value.map((item) => scrub(item, depth + 1));
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, SENSITIVE_KEY.test(key) ? "[Filtered]" : scrub(val, depth + 1)]),
  );
};

// Error messages can embed an address (Keycloak lookups put "?email=..." in the URL of a FetchError).
const EMAIL = /[^\s@"'<>/?=&]+@[^\s@"'<>/?&]+\.[a-z]{2,}/gi;
const redactEmails = (text: string | undefined) => text?.replace(EMAIL, "[email]");

const beforeSend = <T extends Sentry.Event>(event: T): T => {
  if (event.message) event.message = redactEmails(event.message);
  for (const exception of event.exception?.values ?? []) exception.value = redactEmails(exception.value);
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.query_string;
    if (event.request.headers) event.request.headers = scrub(event.request.headers) as Record<string, string>;
  }
  delete event.user;
  if (event.extra) event.extra = scrub(event.extra) as Record<string, unknown>;
  if (event.contexts) event.contexts = scrub(event.contexts) as typeof event.contexts;
  return event;
};

/**
 * SENTRY_RELEASE when set (for instance the commit SHA passed by the CI), otherwise the commit Coolify exposes
 * for builds from a git source, otherwise the backend package version.
 */
const getRelease = () => {
  if (ENV.SENTRY_RELEASE) return ENV.SENTRY_RELEASE;
  if (process.env.SOURCE_COMMIT) return `patrinotes-backend@${process.env.SOURCE_COMMIT}`;
  if (process.env.npm_package_version) return `patrinotes-backend@${process.env.npm_package_version}`;
  return undefined;
};

isDev
  ? null
  : ENV.SENTRY_DSN
    ? Sentry.init({
        dsn: ENV.SENTRY_DSN,
        environment: ENV.SENTRY_ENVIRONMENT ?? ENV.NODE_ENV,
        release: getRelease(),
        tracesSampleRate: 0.1,
        dataCollection: restrictiveDataCollection,
        // "static" keeps transactions (and beforeSendTransaction below); the v11 default streams spans and skips it
        traceLifecycle: "static",
        // console breadcrumbs would carry our debug logs (emails, Keycloak errors) into every event
        integrations: (defaults) => defaults.filter((integration) => integration.name !== "Console"),
        beforeSend,
        beforeSendTransaction: beforeSend,
        beforeBreadcrumb: (breadcrumb) => (breadcrumb.category === "console" ? null : breadcrumb),
      })
    : null;

const sentry = isDev ? null : Sentry;

export { sentry };
