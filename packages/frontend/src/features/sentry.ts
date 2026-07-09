import * as Sentry from "@sentry/react";
import { ENV, isDev } from "../envVars";

isDev
  ? null
  : ENV.VITE_SENTRY_DSN
    ? Sentry.init({
        dsn: ENV.VITE_SENTRY_DSN,
        tracesSampleRate: 1.0,
        enableLogs: true,
        integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "info", "warn", "error"] })],
      })
    : null;

const sentry = isDev ? null : Sentry;

export { sentry };
