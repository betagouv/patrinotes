import { FastifyRequest } from "fastify";
import { AppError } from "../features/errors";
import { authenticate } from "./authMiddleware";
import { db } from "../db/db";

export const authenticateAdmin = async (request: FastifyRequest) => {
  const user = await authenticate(request);

  const internalUser = await db
    .selectFrom("internal_user")
    .where("userId", "=", user.id)
    .select("role")
    .executeTakeFirst();

  if (internalUser?.role !== "admin") {
    throw new AppError(403, "Accès refusé");
  }
};
