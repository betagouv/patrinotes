import { FastifyRequest } from "fastify";
import { AppError } from "../features/errors";

export const authenticate = async (request: FastifyRequest) => {
  const auth = request.headers.authorization;
  if (!auth) throw new AppError(403, "Unauthorized");

  const [_, token] = auth.split(" ");

  let user: Awaited<ReturnType<typeof request.services.auth.getUserFromToken>>;
  try {
    user = await request.services.auth.getUserFromToken(token ?? "");
  } catch (e) {
    throw new AppError(403, "Unauthorized");
  }
  // revoked or expired session, or deleted user
  if (!user) throw new AppError(403, "Unauthorized");

  request.user = user;
  return user;
};

export type AuthUser = NonNullable<Awaited<ReturnType<typeof authenticate>>>;
