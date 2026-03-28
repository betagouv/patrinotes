import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { db } from "../db/db";
import { sql } from "kysely";
import { authenticateAdmin } from "./adminMiddleware";

export const statsPlugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/public",
    {
      schema: {
        querystring: Type.Object({
          from: Type.Optional(Type.String()),
          to: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            totalConstats: Type.Number(),
            totalReports: Type.Number(),
            totalUsers: Type.Number(),
            usersWithNoDocuments: Type.Number(),
            activeUsersInPeriod: Type.Number(),
            periodFrom: Type.String(),
            periodTo: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const now = new Date();
      const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      const periodFrom = request.query.from ?? defaultFrom.toISOString().slice(0, 10);
      const periodTo = request.query.to ?? now.toISOString().slice(0, 10);

      const [
        totalConstatsResult,
        totalReportsResult,
        totalUsersResult,
        usersWithNoDocumentsResult,
        activeUsersResult,
      ] = await Promise.all([
        db
          .selectFrom("state_report")
          .where("disabled", "is not", true)
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db
          .selectFrom("report")
          .where("disabled", "is not", true)
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db
          .selectFrom("user")
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db
          .selectFrom("user")
          .where((eb) =>
            eb.and([
              eb.not(
                eb.exists(
                  eb.selectFrom("report").whereRef("report.createdBy", "=", "user.id").select("report.id"),
                ),
              ),
              eb.not(
                eb.exists(
                  eb
                    .selectFrom("state_report")
                    .whereRef("state_report.created_by", "=", "user.id")
                    .select("state_report.id"),
                ),
              ),
            ]),
          )
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db
          .selectFrom(
            sql<{ user_id: string }>`(
              SELECT r."createdBy" AS user_id
              FROM sent_email se
              JOIN report r ON r.id = se.report_id
              WHERE se.sent_at::date >= ${periodFrom}::date AND se.sent_at::date <= ${periodTo}::date
              UNION
              SELECT sr.created_by AS user_id
              FROM state_report_sent_email srse
              JOIN state_report sr ON sr.id = srse.state_report_id
              WHERE srse.sent_at::date >= ${periodFrom}::date AND srse.sent_at::date <= ${periodTo}::date
            )`.as("active_users"),
          )
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),
      ]);

      return {
        totalConstats: Number(totalConstatsResult?.count ?? 0),
        totalReports: Number(totalReportsResult?.count ?? 0),
        totalUsers: Number(totalUsersResult?.count ?? 0),
        usersWithNoDocuments: Number(usersWithNoDocumentsResult?.count ?? 0),
        activeUsersInPeriod: Number(activeUsersResult?.count ?? 0),
        periodFrom,
        periodTo,
      };
    },
  );

  fastify.get(
    "/admin",
    {
      schema: {
        response: {
          200: Type.Object({
            constatsByService: Type.Array(
              Type.Object({
                serviceId: Type.String(),
                serviceName: Type.Union([Type.String(), Type.Null()]),
                sentConstats: Type.Number(),
              }),
            ),
            abandonedConstats: Type.Number(),
          }),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async () => {
      const [constatsByService, abandonedResult] = await Promise.all([
        db
          .selectFrom("service")
          .leftJoin("state_report", (join) =>
            join
              .onRef("state_report.service_id", "=", "service.id")
              .on("state_report.alerts_sent", "=", true)
              .on("state_report.disabled", "is not", true),
          )
          .groupBy(["service.id", "service.name"])
          .orderBy(sql`COUNT(DISTINCT state_report.id)`, "desc")
          .select([
            "service.id as serviceId",
            "service.name as serviceName",
            db.fn.count<number>("state_report.id").distinct().as("sentConstats"),
          ])
          .execute(),

        db
          .selectFrom("state_report")
          .where("alerts_sent", "=", false)
          .where("disabled", "is not", true)
          .where("created_at", "<", sql<string>`NOW() - INTERVAL '21 days'`)
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),
      ]);

      return {
        constatsByService: constatsByService.map((r) => ({
          serviceId: r.serviceId,
          serviceName: r.serviceName ?? null,
          sentConstats: Number(r.sentConstats),
        })),
        abandonedConstats: Number(abandonedResult?.count ?? 0),
      };
    },
  );
};
