import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { AppError } from "../features/errors";
import { db } from "../db/db";
import { loginTSchema } from "./authRoutes";
import { userTSchema } from "../services/authService";
import { authenticateAdmin } from "./adminMiddleware";

export const adminPlugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post("/login-user", { schema: loginTSchema }, async (request) => {
    const result = await request.services.auth.loginUser(request.body);

    const internalUser = await db
      .selectFrom("internal_user")
      .where("email", "=", request.body.email)
      .select("role")
      .executeTakeFirst();

    if (internalUser?.role !== "admin") {
      throw new AppError(403, "Accès refusé");
    }

    return result;
  });

  fastify.get(
    "/me",
    { schema: { response: { 200: userTSchema } }, preHandler: [authenticateAdmin] },
    async (request) => {
      return request.user;
    },
  );
};
