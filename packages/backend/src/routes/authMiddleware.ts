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
  } catch (e) {
    throw new AppError(403, "Unauthorized");
  }
  // a valid token whose account has no row in the database (account deleted): refused like a bad token
  if (!user) throw new AppError(403, "Unauthorized");
  request.user = user;
  await assertUserRateLimit(request, user.id);
  return user;
};

export type AuthUser = Awaited<ReturnType<typeof authenticate>>;
