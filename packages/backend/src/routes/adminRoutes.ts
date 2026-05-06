import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { sql } from "kysely";
import { AppError } from "../features/errors";
import { db } from "../db/db";
import { loginTSchema } from "./authRoutes";
import { userTSchema } from "../services/authService";
import { authenticateAdmin } from "./adminMiddleware";
import { makeDebug } from "../features/debug";

const debug = makeDebug("admin");

export const adminPlugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/me",
    { schema: { response: { 200: userTSchema } }, preHandler: [authenticateAdmin] },
    async (request) => {
      return request.user;
    },
  );

  fastify.get(
    "/whitelist",
    {
      schema: {
        querystring: Type.Object({
          page: Type.Optional(Type.Number({ default: 1 })),
          limit: Type.Optional(Type.Number({ default: 20 })),
        }),
        response: {
          200: Type.Object({
            data: Type.Array(
              Type.Object({
                email: Type.String(),
                createdAt: Type.String(),
                hasUser: Type.Boolean(),
                lastCreatedStateReport: Type.Union([Type.String(), Type.Null()]),
                lastFinishedStateReport: Type.Union([Type.String(), Type.Null()]),
              }),
            ),
            total: Type.Number(),
            page: Type.Number(),
            limit: Type.Number(),
          }),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async (request) => {
      const page = request.query.page ?? 1;
      const limit = request.query.limit ?? 20;
      const offset = (page - 1) * limit;
      debug("Fetching whitelist page", page, "with limit", limit);
      const [rows, countResult] = await Promise.all([
        db
          .selectFrom("whitelist")
          .select((eb) => [
            "whitelist.email",
            "whitelist.createdAt",
            eb
              .selectFrom("user")
              .whereRef("user.email", "=", "whitelist.email")
              .select(sql<boolean>`true`)
              .limit(1)
              .as("hasUser"),
            eb
              .selectFrom("state_report")
              .innerJoin("user", "user.id", "state_report.created_by")
              .whereRef("user.email", "=", "whitelist.email")
              .select(eb.fn.max("state_report.created_at"))
              .as("lastCreatedStateReport"),
            eb
              .selectFrom("state_report")
              .innerJoin("user", "user.id", "state_report.created_by")
              .innerJoin(
                "state_report_attachment",
                "state_report_attachment.state_report_id",
                "state_report.id",
              )
              .whereRef("user.email", "=", "whitelist.email")
              .where("state_report.attachment_id", "is not", null)
              .select(eb.fn.max("state_report_attachment.created_at"))
              .as("lastFinishedStateReport"),
          ])
          .orderBy("whitelist.createdAt", "desc")
          .limit(limit)
          .offset(offset)
          .execute(),
        db.selectFrom("whitelist").select(db.fn.countAll<number>().as("count")).executeTakeFirst(),
      ]);

      return {
        data: rows.map((r) => ({
          email: r.email,
          createdAt: r.createdAt!,
          hasUser: r.hasUser ?? false,
          lastCreatedStateReport: r.lastCreatedStateReport ?? null,
          lastFinishedStateReport: r.lastFinishedStateReport ?? null,
        })),
        total: Number(countResult?.count ?? 0),
        page,
        limit,
      };
    },
  );

  fastify.post(
    "/whitelist",
    {
      schema: {
        body: Type.Object({ email: Type.String() }),
        response: {
          200: Type.Object({ email: Type.String() }),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async (request) => {
      const { email } = request.body;

      const existing = await db.selectFrom("whitelist").where("email", "=", email).selectAll().executeTakeFirst();
      if (existing) {
        throw new AppError(409, "Cet email est déjà dans la whitelist");
      }

      await db.insertInto("whitelist").values({ email }).execute();

      return { email };
    },
  );

  fastify.delete(
    "/whitelist",
    {
      schema: {
        body: Type.Object({ email: Type.String() }),
        response: {
          200: Type.Object({ message: Type.String() }),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async (request) => {
      const { email } = request.body;

      const existing = await db.selectFrom("whitelist").where("email", "=", email).selectAll().executeTakeFirst();
      if (!existing) {
        throw new AppError(404, "Email non trouvé dans la whitelist");
      }

      await db.deleteFrom("whitelist").where("email", "=", email).execute();

      return { message: "Email supprimé de la whitelist" };
    },
  );

  fastify.get(
    "/whitelist/export",
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              email: Type.String(),
              createdAt: Type.String(),
            }),
          ),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async () => {
      const rows = await db.selectFrom("whitelist").selectAll().orderBy("createdAt", "desc").execute();
      return rows.map((r) => ({ email: r.email, createdAt: r.createdAt! }));
    },
  );

  fastify.get(
    "/users/export",
    {
      schema: {
        querystring: Type.Object({
          search: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.String(),
              name: Type.String(),
              email: Type.String(),
              job: Type.Union([Type.String(), Type.Null()]),
              serviceId: Type.String(),
              serviceName: Type.Union([Type.String(), Type.Null()]),
              serviceDepartment: Type.Union([Type.String(), Type.Null()]),
              role: Type.Union([Type.String(), Type.Null()]),
              createdAt: Type.String(),
            }),
          ),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async (request) => {
      const { search } = request.query;

      const rows = await db
        .selectFrom("user")
        .leftJoin("internal_user", "internal_user.userId", "user.id")
        .leftJoin("service", "service.id", "user.service_id")
        .$if(!!search, (qb) =>
          qb.where((eb) =>
            eb.or([
              eb("user.name", "ilike", `%${search}%`),
              eb("user.email", "ilike", `%${search}%`),
              eb("service.name", "ilike", `%${search}%`),
              eb("service.id", "=", search!),
            ]),
          ),
        )
        .select([
          "user.id",
          "user.name",
          "user.email",
          "user.job",
          "user.service_id as serviceId",
          "service.name as serviceName",
          "service.department as serviceDepartment",
          "internal_user.role",
          "internal_user.createdAt",
        ])
        .orderBy("internal_user.createdAt", "desc")
        .execute();

      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        job: r.job ?? null,
        serviceId: r.serviceId,
        serviceName: r.serviceName ?? null,
        serviceDepartment: r.serviceDepartment ?? null,
        role: r.role ?? null,
        createdAt: r.createdAt!,
      }));
    },
  );

  fastify.get(
    "/users",
    {
      schema: {
        querystring: Type.Object({
          page: Type.Optional(Type.Number({ default: 1 })),
          limit: Type.Optional(Type.Number({ default: 20 })),
          search: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            users: Type.Array(
              Type.Object({
                id: Type.String(),
                name: Type.String(),
                email: Type.String(),
                job: Type.Union([Type.String(), Type.Null()]),
                serviceId: Type.String(),
                serviceName: Type.Union([Type.String(), Type.Null()]),
                serviceDepartment: Type.Union([Type.String(), Type.Null()]),
                role: Type.Union([Type.String(), Type.Null()]),
                createdAt: Type.String(),
              }),
            ),
            total: Type.Number(),
            page: Type.Number(),
            limit: Type.Number(),
          }),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async (request) => {
      const page = request.query.page ?? 1;
      const limit = request.query.limit ?? 20;
      const offset = (page - 1) * limit;
      const { search } = request.query;

      const baseQuery = db
        .selectFrom("user")
        .leftJoin("internal_user", "internal_user.userId", "user.id")
        .leftJoin("service", "service.id", "user.service_id")
        .$if(!!search, (qb) =>
          qb.where((eb) =>
            eb.or([
              eb("user.name", "ilike", `%${search}%`),
              eb("user.email", "ilike", `%${search}%`),
              eb("service.name", "ilike", `%${search}%`),
              eb("service.id", "=", search!),
            ]),
          ),
        );

      const [rows, countResult] = await Promise.all([
        baseQuery
          .select([
            "user.id",
            "user.name",
            "user.email",
            "user.job",
            "user.service_id as serviceId",
            "service.name as serviceName",
            "service.department as serviceDepartment",
            "internal_user.role",
            "internal_user.createdAt",
          ])
          .orderBy("internal_user.createdAt", "desc")
          .limit(limit)
          .offset(offset)
          .execute(),
        baseQuery.select(db.fn.countAll<number>().as("count")).executeTakeFirst(),
      ]);

      return {
        users: rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          job: r.job ?? null,
          serviceId: r.serviceId,
          serviceName: r.serviceName ?? null,
          serviceDepartment: r.serviceDepartment ?? null,
          role: r.role ?? null,
          createdAt: r.createdAt!,
        })),
        total: Number(countResult?.count ?? 0),
        page,
        limit,
      };
    },
  );
};
