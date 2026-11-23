import * as Sentry from "@sentry/react";
import { ENV, isDev } from "../envVars";

// Keys whose values must never reach Sentry: credentials and personal data.
const SENSITIVE_KEY = /pass(word)?|token|secret|authorization|cookie|e-?mail|recipients?|^to$|^body$|^data$/i;

const scrub = (value: unknown, depth = 0): unknown => {
  if (!value || typeof value !== "object" || depth > 5) return value;
  if (Array.isArray(value)) return value.map((item) => scrub(item, depth + 1));
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, SENSITIVE_KEY.test(key) ? "[Filtered]" : scrub(val, depth + 1)]),
  );
};

isDev
  ? null
  : ENV.VITE_SENTRY_DSN
    ? Sentry.init({
        dsn: ENV.VITE_SENTRY_DSN,
        environment: ENV.VITE_SENTRY_ENVIRONMENT ?? "production",
        // version.js, written at build time (scripts/setVersion.ts)
        release: typeof window !== "undefined" && window.APP_VERSION ? `patrinotes-frontend@${window.APP_VERSION}` : undefined,
        tracesSampleRate: 0.1,
        // Since SDK v11, leaving `dataCollection` unset collects users, cookies, bodies and local variables:
        // keep the restrictive behaviour we had with `sendDefaultPii: false`.
        dataCollection: {
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
        },
        traceLifecycle: "static",
        // no console logs or console breadcrumbs: they used to carry tokens and synced data
        // (since SDK v11 console breadcrumbs come from the separate default "Console" integration)
        integrations: (defaults) => defaults.filter((integration) => integration.name !== "Console"),
        beforeSend: (event) => {
          delete event.user;
          if (event.extra) event.extra = scrub(event.extra) as Record<string, unknown>;
          return event;
        },
        beforeBreadcrumb: (breadcrumb) => (breadcrumb.category === "console" ? null : breadcrumb),
      })
    : null;

const sentry = isDev ? null : Sentry;

export { sentry };
