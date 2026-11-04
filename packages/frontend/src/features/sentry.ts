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
        tracesSampleRate: 0.1,
        sendDefaultPii: false,
        // no console logs or console breadcrumbs: they used to carry tokens and synced data
        integrations: [Sentry.breadcrumbsIntegration({ console: false })],
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
