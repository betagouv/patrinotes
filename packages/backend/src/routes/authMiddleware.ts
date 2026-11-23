import { FastifyRequest } from "fastify";
import { AppError } from "../features/errors";
import jwt from "jsonwebtoken";
import { assertUserRateLimit } from "../features/rateLimit";

export const authenticate = async (request: FastifyRequest) => {
  const auth = request.headers.authorization;
  if (!auth) throw new AppError(403, "Unauthorized");

  const [_, token] = auth.split(" ");

  let user;
  try {
    user = await request.services.auth.getUserFromToken(token ?? "");
    request.user = user!;
  } catch (e) {
    throw new AppError(403, "Unauthorized");
  }
  await assertUserRateLimit(request, user!.id);
  return user!;
};

export type AuthUser = Awaited<ReturnType<typeof authenticate>>;
