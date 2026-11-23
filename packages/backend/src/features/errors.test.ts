import { Type } from "@sinclair/typebox";
import fastify from "fastify";
import { describe, expect, it } from "vitest";
import { AppError, isValidationError } from "./errors";

describe("isValidationError", () => {
  it("recognises a schema validation error raised by Fastify", async () => {
    const app = fastify();
    let caught: unknown;
    app.setErrorHandler((error, _request, reply) => {
      caught = error;
      return reply.status(400).send();
    });
    app.post("/", { schema: { body: Type.Object({ email: Type.String() }) } }, async () => ({ ok: true }));
    await app.ready();

    await app.inject({ method: "POST", url: "/", payload: {} });

    expect(isValidationError(caught)).toBe(true);
  });

  it("leaves application and unexpected errors alone", () => {
    expect(isValidationError(new AppError(400, "Le courriel n'est pas valide"))).toBe(false);
    expect(isValidationError(new Error("boom"))).toBe(false);
    expect(isValidationError(undefined)).toBe(false);
  });
});
