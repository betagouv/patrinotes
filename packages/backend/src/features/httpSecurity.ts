import type { FastifyInstance } from "fastify";

const toOrigin = (value: string) => {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
};

/**
 * Origins allowed to call the API from a browser: FRONTEND_URL plus the comma-separated CORS_ORIGINS.
 * In development and test, any localhost origin is also allowed (local frontend on any port).
 */
export const makeCorsOriginChecker = ({
  frontendUrl,
  extraOrigins,
  allowLocalhost,
}: {
  frontendUrl: string;
  extraOrigins?: string;
  allowLocalhost: boolean;
}) => {
  const allowed = new Set(
    [frontendUrl, ...(extraOrigins ?? "").split(",")]
      .filter((value) => value.trim())
      .map(toOrigin)
      .filter((origin): origin is string => !!origin),
  );

  return (origin: string | undefined) => {
    // no Origin header: not a cross-origin browser request (curl, server to server, same origin navigation)
    if (!origin) return true;
    if (allowed.has(origin)) return true;
    if (allowLocalhost) {
      const hostname = (() => {
        try {
          return new URL(origin).hostname;
        } catch {
          return null;
        }
      })();
      return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
    }
    return false;
  };
};

/** Security headers added to every API response. No CSP here: the API serves JSON and redirects, not pages. */
export const getSecurityHeaders = ({ hsts }: { hsts: boolean }) => ({
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  ...(hsts ? { "Strict-Transport-Security": "max-age=31536000; includeSubDomains" } : {}),
});

export const registerSecurityHeaders = (instance: FastifyInstance, options: { hsts: boolean }) => {
  const headers = getSecurityHeaders(options);
  instance.addHook("onSend", async (_request, reply, payload) => {
    for (const [name, value] of Object.entries(headers)) {
      if (!reply.hasHeader(name)) reply.header(name, value);
    }
    return payload;
  });
};
