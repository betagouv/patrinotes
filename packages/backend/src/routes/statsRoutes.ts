import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { db } from "../db/db";
import { sql } from "kysely";
import { authenticateAdmin } from "./adminMiddleware";

const regionCodes: Record<string, string> = {
  "Île-de-France": "IDF",
  "Centre-Val de Loire": "CVL",
  "Bourgogne-Franche-Comté": "BFC",
  Normandie: "NOR",
  "Hauts-de-France": "HDF",
  "Grand Est": "GES",
  "Pays de la Loire": "PDL",
  Bretagne: "BRE",
  "Nouvelle-Aquitaine": "NAQ",
  Occitanie: "OCC",
  "Auvergne-Rhône-Alpes": "ARA",
  "Provence-Alpes-Côte d'Azur": "PAC",
  Corse: "20R",
  Guadeloupe: "971",
  Martinique: "972",
  Guyane: "973",
  "La Réunion": "974",
  Mayotte: "976",
};

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
            sentConstats: Type.Number(),
            sentReports: Type.Number(),
            totalUsers: Type.Number(),
            usersWithNoDocuments: Type.Number(),
            activeUsersInPeriod: Type.Number(),
            deployedUdapCount: Type.Number(),
            deployedCrmhCount: Type.Number(),
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
        sentConstatsResult,
        sentReportsResult,
        totalUsersResult,
        usersWithNoDocumentsResult,
        activeUsersResult,
        deployedUdapResult,
        deployedCrmhResult,
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
          .selectFrom("state_report")
          .where("disabled", "is not", true)
          .where("attachment_id", "is not", null)
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db
          .selectFrom("report")
          .where("disabled", "is not", true)
          .where("attachment_id", "is not", null)
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db.selectFrom("user").select(db.fn.countAll<number>().as("count")).executeTakeFirst(),

        db
          .selectFrom("user")
          .where((eb) =>
            eb.and([
              eb.not(
                eb.exists(eb.selectFrom("report").whereRef("report.createdBy", "=", "user.id").select("report.id")),
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

        db
          .selectFrom("service")
          .where("id", "ilike", "%udap%")
          .where((eb) =>
            eb.exists(
              eb
                .selectFrom("state_report")
                .whereRef("state_report.service_id", "=", "service.id")
                .select("state_report.id"),
            ),
          )
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db
          .selectFrom("service")
          .where("id", "ilike", "%crmh%")
          .where((eb) =>
            eb.exists(
              eb
                .selectFrom("state_report")
                .whereRef("state_report.service_id", "=", "service.id")
                .select("state_report.id"),
            ),
          )
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),
      ]);

      return {
        totalConstats: Number(totalConstatsResult?.count ?? 0),
        totalReports: Number(totalReportsResult?.count ?? 0),
        sentConstats: Number(sentConstatsResult?.count ?? 0),
        sentReports: Number(sentReportsResult?.count ?? 0),
        totalUsers: Number(totalUsersResult?.count ?? 0),
        usersWithNoDocuments: Number(usersWithNoDocumentsResult?.count ?? 0),
        activeUsersInPeriod: Number(activeUsersResult?.count ?? 0),
        deployedUdapCount: Number(deployedUdapResult?.count ?? 0),
        deployedCrmhCount: Number(deployedCrmhResult?.count ?? 0),
        periodFrom,
        periodTo,
      };
    },
  );

  fastify.get(
    "/accounts",
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              month: Type.String(),
              year: Type.Number(),
              count: Type.Number(),
            }),
          ),
        },
        querystring: Type.Object({
          from: Type.Optional(Type.String()),
          to: Type.Optional(Type.String()),
        }),
      },
    },
    async ({ query }) => {
      const from = query.from ? new Date(query.from) : new Date(new Date().getFullYear(), 0, 1);
      const to = query.to ? new Date(query.to) : new Date();

      const result = await db
        .selectFrom("user")
        .leftJoin("internal_user", "internal_user.userId", "user.id")
        .where(sql`internal_user."createdAt"`, ">=", from.toISOString())
        .where(sql`internal_user."createdAt"`, "<=", to.toISOString())
        .select([
          sql<string>`TO_CHAR(internal_user."createdAt", 'YYYY-MM')`.as("month"),
          sql<number>`EXTRACT(YEAR FROM internal_user."createdAt")`.as("year"),
          db.fn.countAll<number>().as("count"),
        ])
        .groupBy(["month", "year"])
        .orderBy(["year", "month"])
        .execute();

      return result;
    },
  );

  fastify.get(
    "/documents",
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              month: Type.String(),
              year: Type.Number(),
              totalReports: Type.Number(),
              totalStateReports: Type.Number(),

              sentReports: Type.Number(),
              sentStateReports: Type.Number(),
            }),
          ),
        },
        querystring: Type.Object({
          from: Type.Optional(Type.String()),
          to: Type.Optional(Type.String()),
        }),
      },
    },
    async ({ query }) => {
      const from = query.from ? new Date(query.from) : new Date(new Date().getFullYear(), 0, 1);
      const to = query.to ? new Date(query.to) : new Date();

      const totalReportsPromisePerMonth = db
        .selectFrom("report")
        .where("disabled", "is not", true)
        .where(sql`report."createdAt"`, ">=", from.toISOString())
        .where(sql`report."createdAt"`, "<=", to.toISOString())
        .select([
          sql<string>`TO_CHAR(report."createdAt", 'YYYY-MM')`.as("month"),
          sql<number>`EXTRACT(YEAR FROM report."createdAt")`.as("year"),
          db.fn.countAll<number>().as("totalReports"),
        ])
        .groupBy(["month", "year"])
        .orderBy(["year", "month"])
        .execute();

      const sentReportsPromisePerMonth = db
        .selectFrom("report")
        .where("disabled", "is not", true)
        .where(sql`report."createdAt"`, ">=", from.toISOString())
        .where(sql`report."createdAt"`, "<=", to.toISOString())
        .where("attachment_id", "is not", null)
        .select([
          sql<string>`TO_CHAR(report."createdAt", 'YYYY-MM')`.as("month"),
          sql<number>`EXTRACT(YEAR FROM report."createdAt")`.as("year"),
          db.fn.countAll<number>().as("sentReports"),
        ])
        .groupBy(["month", "year"])
        .orderBy(["year", "month"])
        .execute();

      const totalStateReportsPromisePerMonth = db
        .selectFrom("state_report")
        .where("disabled", "is not", true)
        .where(sql`state_report.created_at`, ">=", from.toISOString())
        .where(sql`state_report.created_at`, "<=", to.toISOString())
        .select([
          sql<string>`TO_CHAR(state_report.created_at, 'YYYY-MM')`.as("month"),
          sql<number>`EXTRACT(YEAR FROM state_report.created_at)`.as("year"),
          db.fn.countAll<number>().as("totalStateReports"),
        ])
        .groupBy(["month", "year"])
        .orderBy(["year", "month"])
        .execute();

      const sentStateReportsPromisePerMonth = db
        .selectFrom("state_report")
        .where("disabled", "is not", true)
        .where(sql`state_report.created_at`, ">=", from.toISOString())
        .where(sql`state_report.created_at`, "<=", to.toISOString())
        .where("attachment_id", "is not", null)
        .select([
          sql<string>`TO_CHAR(state_report.created_at, 'YYYY-MM')`.as("month"),
          sql<number>`EXTRACT(YEAR FROM state_report.created_at)`.as("year"),
          db.fn.countAll<number>().as("sentStateReports"),
        ])
        .groupBy(["month", "year"])
        .orderBy(["year", "month"])
        .execute();

      const [totalReportsPerMonth, sentReportsPerMonth, totalStateReportsPerMonth, sentStateReportsPerMonth] =
        await Promise.all([
          totalReportsPromisePerMonth,
          sentReportsPromisePerMonth,
          totalStateReportsPromisePerMonth,
          sentStateReportsPromisePerMonth,
        ]);

      const monthYear = new Set<string>();

      totalReportsPerMonth.forEach((r) => monthYear.add(r.month));
      sentReportsPerMonth.forEach((r) => monthYear.add(r.month));
      sentStateReportsPerMonth.forEach((r) => monthYear.add(r.month));
      totalStateReportsPerMonth.forEach((r) => monthYear.add(r.month));

      const resultMap: Record<
        string,
        {
          month: string;
          year: number;
          totalReports: number;
          sentReports: number;
          totalStateReports: number;
          sentStateReports: number;
        }
      > = {};

      monthYear.forEach((my) => {
        const [year, month] = my.split("-");

        resultMap[my] = {
          month: month!,
          year: Number(year),
          totalReports: 0,
          sentReports: 0,
          totalStateReports: 0,
          sentStateReports: 0,
        };
      });

      totalReportsPerMonth.forEach((r) => {
        resultMap[r.month]!.totalReports = Number(r.totalReports);
      });
      sentReportsPerMonth.forEach((r) => {
        resultMap[r.month]!.sentReports = Number(r.sentReports);
      });
      totalStateReportsPerMonth.forEach((r) => {
        resultMap[r.month]!.totalStateReports = Number(r.totalStateReports);
      });
      sentStateReportsPerMonth.forEach((r) => {
        resultMap[r.month]!.sentStateReports = Number(r.sentStateReports);
      });

      return Object.values(resultMap).sort((a, b) => {
        if (a.year === b.year) {
          return a.month.localeCompare(b.month);
        }
        return a.year - b.year;
      });
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
                totalConstats: Type.Number(),
              }),
            ),
            abandonedConstats: Type.Number(),
            abandonedReports: Type.Number(),
            totalConstats: Type.Number(),
            totalReports: Type.Number(),
            totalUsers: Type.Number(),
          }),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async () => {
      const [
        constatsByService,
        abandonedConstatsResult,
        abandonedReportsResult,
        totalConstatsResult,
        totalReportsResult,
        totalUsersResult,
      ] = await Promise.all([
        db
          .selectFrom("service")
          .leftJoin("state_report", (join) =>
            join.onRef("state_report.service_id", "=", "service.id").on("state_report.disabled", "is not", true),
          )
          .groupBy(["service.id", "service.name"])
          .orderBy(
            sql`COUNT(DISTINCT CASE WHEN state_report.attachment_id IS NOT NULL THEN state_report.id END)`,
            "desc",
          )
          .select([
            "service.id as serviceId",
            "service.name as serviceName",
            sql<number>`COUNT(DISTINCT CASE WHEN state_report.attachment_id IS NOT NULL THEN state_report.id END)`.as(
              "sentConstats",
            ),
            db.fn.count<number>("state_report.id").distinct().as("totalConstats"),
          ])
          .execute(),

        db
          .selectFrom("state_report")
          .where("disabled", "is not", true)
          .where("created_at", "<", sql<string>`NOW() - INTERVAL '21 days'`)
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

        db
          .selectFrom("report")
          .where("disabled", "is not", true)
          .where(sql`report."createdAt"`, "<", sql<string>`NOW() - INTERVAL '21 days'`)
          .select(db.fn.countAll<number>().as("count"))
          .executeTakeFirst(),

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

        db.selectFrom("user").select(db.fn.countAll<number>().as("count")).executeTakeFirst(),
      ]);

      return {
        constatsByService: constatsByService.map((r) => ({
          serviceId: r.serviceId,
          serviceName: r.serviceName ?? null,
          sentConstats: Number(r.sentConstats),
          totalConstats: Number(r.totalConstats),
        })),
        abandonedConstats: Number(abandonedConstatsResult?.count ?? 0),
        abandonedReports: Number(abandonedReportsResult?.count ?? 0),
        totalConstats: Number(totalConstatsResult?.count ?? 0),
        totalReports: Number(totalReportsResult?.count ?? 0),
        totalUsers: Number(totalUsersResult?.count ?? 0),
      };
    },
  );

  fastify.get(
    "/udap",
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              department: Type.String(),
              totalStateReports: Type.Number(),
              sentStateReports: Type.Number(),
              totalReports: Type.Number(),
              sentReports: Type.Number(),
              usersCount: Type.Number(),
            }),
          ),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async () => {
      const [ceByDept, crByDept, usersByDept] = await Promise.all([
        db
          .selectFrom("state_report")
          .innerJoin("service", "service.id", "state_report.service_id")
          .where("service.id", "ilike", "%udap%")
          .where("state_report.disabled", "is not", true)
          .where("service.dept_numbers", "is not", null)
          .groupBy(sql`TRIM(SPLIT_PART(service.dept_numbers, ',', 1))`)
          .select([
            sql<string>`TRIM(SPLIT_PART(service.dept_numbers, ',', 1))`.as("department"),
            db.fn.countAll<number>().as("totalStateReports"),
            sql<number>`COUNT(CASE WHEN state_report.attachment_id IS NOT NULL THEN 1 END)`.as("sentStateReports"),
          ])
          .execute(),

        db
          .selectFrom("report")
          .innerJoin("service", "service.id", "report.service_id")
          .where("service.id", "ilike", "%udap%")
          .where("report.disabled", "is not", true)
          .where("service.dept_numbers", "is not", null)
          .groupBy(sql`TRIM(SPLIT_PART(service.dept_numbers, ',', 1))`)
          .select([
            sql<string>`TRIM(SPLIT_PART(service.dept_numbers, ',', 1))`.as("department"),
            db.fn.countAll<number>().as("totalReports"),
            sql<number>`COUNT(CASE WHEN report.attachment_id IS NOT NULL THEN 1 END)`.as("sentReports"),
          ])
          .execute(),

        db
          .selectFrom("user")
          .innerJoin("service", "service.id", "user.service_id")
          .where("service.id", "ilike", "%udap%")
          .where("service.dept_numbers", "is not", null)
          .groupBy(sql`TRIM(SPLIT_PART(service.dept_numbers, ',', 1))`)
          .select([
            sql<string>`TRIM(SPLIT_PART(service.dept_numbers, ',', 1))`.as("department"),
            db.fn.countAll<number>().as("usersCount"),
          ])
          .execute(),
      ]);

      const deptMap: Record<
        string,
        {
          department: string;
          totalStateReports: number;
          sentStateReports: number;
          totalReports: number;
          sentReports: number;
          usersCount: number;
        }
      > = {};

      for (const row of ceByDept) {
        if (!row.department) continue;
        deptMap[row.department] = {
          department: row.department,
          totalStateReports: Number(row.totalStateReports),
          sentStateReports: Number(row.sentStateReports),
          totalReports: 0,
          sentReports: 0,
          usersCount: 0,
        };
      }

      for (const row of crByDept) {
        if (!row.department) continue;
        if (!deptMap[row.department]) {
          deptMap[row.department] = {
            department: row.department,
            totalStateReports: 0,
            sentStateReports: 0,
            totalReports: 0,
            sentReports: 0,
            usersCount: 0,
          };
        }
        deptMap[row.department]!.totalReports = Number(row.totalReports);
        deptMap[row.department]!.sentReports = Number(row.sentReports);
      }

      for (const row of usersByDept) {
        if (!row.department) continue;
        if (!deptMap[row.department]) {
          deptMap[row.department] = {
            department: row.department,
            totalStateReports: 0,
            sentStateReports: 0,
            totalReports: 0,
            sentReports: 0,
            usersCount: 0,
          };
        }
        deptMap[row.department]!.usersCount = Number(row.usersCount);
      }

      return Object.values(deptMap).sort((a, b) => a.department.localeCompare(b.department));
    },
  );

  fastify.get(
    "/crmh",
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              region: Type.String(),
              totalStateReports: Type.Number(),
              sentStateReports: Type.Number(),
              totalReports: Type.Number(),
              sentReports: Type.Number(),
              usersCount: Type.Number(),
            }),
          ),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async () => {
      const [ceByService, crByService, usersByService] = await Promise.all([
        db
          .selectFrom("state_report")
          .innerJoin("service", "service.id", "state_report.service_id")
          .where("service.id", "ilike", "%crmh%")
          .where("state_report.disabled", "is not", true)
          .groupBy("service.department")
          .select([
            "service.department as firstDept",
            db.fn.countAll<number>().as("totalStateReports"),
            sql<number>`COUNT(CASE WHEN state_report.attachment_id IS NOT NULL THEN 1 END)`.as("sentStateReports"),
          ])
          .execute(),

        db
          .selectFrom("report")
          .innerJoin("service", "service.id", "report.service_id")
          .where("service.id", "ilike", "%crmh%")
          .where("report.disabled", "is not", true)
          .groupBy("service.department")
          .select([
            "service.department as firstDept",
            db.fn.countAll<number>().as("totalReports"),
            sql<number>`COUNT(CASE WHEN report.attachment_id IS NOT NULL THEN 1 END)`.as("sentReports"),
          ])
          .execute(),

        db
          .selectFrom("user")
          .innerJoin("service", "service.id", "user.service_id")
          .where("service.id", "ilike", "%crmh%")
          .groupBy("service.department")
          .select(["service.department as firstDept", db.fn.countAll<number>().as("usersCount")])
          .execute(),
      ]);

      const regionMap: Record<
        string,
        {
          region: string;
          totalStateReports: number;
          sentStateReports: number;
          totalReports: number;
          sentReports: number;
          usersCount: number;
        }
      > = {};

      for (const row of ceByService) {
        const region = regionCodes[row.firstDept];
        if (!region) continue;
        regionMap[region] = {
          region,
          totalStateReports: Number(row.totalStateReports),
          sentStateReports: Number(row.sentStateReports),
          totalReports: 0,
          sentReports: 0,
          usersCount: 0,
        };
      }

      for (const row of crByService) {
        const region = regionCodes[row.firstDept];
        if (!region) continue;
        if (!regionMap[region]) {
          regionMap[region] = {
            region,
            totalStateReports: 0,
            sentStateReports: 0,
            totalReports: 0,
            sentReports: 0,
            usersCount: 0,
          };
        }
        regionMap[region]!.totalReports = Number(row.totalReports);
        regionMap[region]!.sentReports = Number(row.sentReports);
      }

      for (const row of usersByService) {
        const region = regionCodes[row.firstDept];
        if (!region) continue;
        if (!regionMap[region]) {
          regionMap[region] = {
            region,
            totalStateReports: 0,
            sentStateReports: 0,
            totalReports: 0,
            sentReports: 0,
            usersCount: 0,
          };
        }
        regionMap[region]!.usersCount = Number(row.usersCount);
      }

      return Object.values(regionMap).sort((a, b) => a.region.localeCompare(b.region));
    },
  );

  fastify.get(
    "/jobs",
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              job: Type.Union([Type.String(), Type.Null()]),
              count: Type.Number(),
            }),
          ),
        },
      },
      preHandler: [authenticateAdmin],
    },
    async () => {
      const result = await db
        .selectFrom("user")
        .select(["user.job", db.fn.countAll<number>().as("count")])
        .groupBy("user.job")
        .orderBy("count", "desc")
        .execute();

      return result.map((r) => ({ job: r.job ?? null, count: Number(r.count) }));
    },
  );
};
