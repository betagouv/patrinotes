import { describe, expect, it } from "vitest";
import { getSecurityHeaders, makeCorsOriginChecker } from "./httpSecurity";

describe("makeCorsOriginChecker", () => {
  const prod = makeCorsOriginChecker({
    frontendUrl: "https://app.patrinotes.beta.gouv.fr/",
    extraOrigins: " https://recette.example.gouv.fr , ,https://autre.example.fr/path",
    allowLocalhost: false,
  });

  it("allows FRONTEND_URL and CORS_ORIGINS, whatever their trailing slash or path", () => {
    expect(prod("https://app.patrinotes.beta.gouv.fr")).toBe(true);
    expect(prod("https://recette.example.gouv.fr")).toBe(true);
    expect(prod("https://autre.example.fr")).toBe(true);
  });

  it("refuses any other origin in production, localhost included", () => {
    expect(prod("https://evil.example.com")).toBe(false);
    expect(prod("http://app.patrinotes.beta.gouv.fr")).toBe(false);
    expect(prod("https://app.patrinotes.beta.gouv.fr.evil.com")).toBe(false);
    expect(prod("http://localhost:5173")).toBe(false);
    expect(prod("null")).toBe(false);
  });

  it("lets requests without an Origin header through", () => {
    expect(prod(undefined)).toBe(true);
  });

  it("allows localhost on any port in development and test", () => {
    const dev = makeCorsOriginChecker({ frontendUrl: "http://localhost:5173", allowLocalhost: true });
    expect(dev("http://localhost:3020")).toBe(true);
    expect(dev("http://127.0.0.1:5173")).toBe(true);
    expect(dev("https://evil.example.com")).toBe(false);
  });
});

describe("getSecurityHeaders", () => {
  it("sets HSTS only when asked", () => {
    expect(getSecurityHeaders({ hsts: true })).toHaveProperty("Strict-Transport-Security");
    expect(getSecurityHeaders({ hsts: false })).not.toHaveProperty("Strict-Transport-Security");
    expect(getSecurityHeaders({ hsts: false })).toMatchObject({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
  });
});
