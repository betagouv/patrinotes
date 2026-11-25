import type { FastifyRequest } from "fastify";
import { describe, expect, it } from "vitest";
import { AppError } from "../features/errors";
import { authenticate } from "./authMiddleware";

const makeRequest = (getUserFromToken: (token: string) => Promise<unknown>) =>
  ({
    headers: { authorization: "Bearer token" },
    services: { auth: { getUserFromToken } },
  }) as unknown as FastifyRequest;

const expectRefused = async (promise: Promise<unknown>) => {
  const error = await promise.catch((e) => e);
  expect(error).toBeInstanceOf(AppError);
  expect((error as AppError).status).toBe(403);
};

describe("authenticate", () => {
  it("refuses a valid token whose account no longer exists, instead of failing with a 500", async () => {
    await expectRefused(authenticate(makeRequest(async () => null)));
  });

  it("refuses an invalid token", async () => {
    await expectRefused(
      authenticate(
        makeRequest(async () => {
          throw new Error("invalid token");
        }),
      ),
    );
  });

  it("refuses a request without an Authorization header", async () => {
    const request = { headers: {}, services: {} } as unknown as FastifyRequest;
    await expectRefused(authenticate(request));
  });

  it("returns the user and attaches it to the request", async () => {
    const user = { id: "user-1", email: "agent@culture.gouv.fr" };
    const request = makeRequest(async () => user);
    await expect(authenticate(request)).resolves.toBe(user);
    expect(request.user).toBe(user);
  });
});
