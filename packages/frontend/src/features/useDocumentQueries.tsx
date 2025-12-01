import { db, useDbQuery } from "../db/db";

const reportQueries = {
  base: db
    .selectFrom("report")
    .where("disabled", "=", 0)
    .orderBy("meetDate", "desc")
    .orderBy("createdAt", "desc")
    .leftJoin("user", "user.id", "report.createdBy")
    .selectAll(["report"])
    .select(["user.name as createdByName"]),
  count: db.selectFrom("report").where("disabled", "=", 0).select(db.fn.countAll().as("count")),
};

type ReportQueries = {
  baseQuery: typeof reportQueries.base;
  countQuery: typeof reportQueries.count;
};

export const getReportQueries = (
  scope: "my" | "all",
  page: number,
  user: { id: string; service_id: string | null },
): ReportQueries => {
  let baseQuery = reportQueries.base.offset(page * 20).limit(20);
  let countQuery = reportQueries.count;

  if (scope === "my") {
    baseQuery = baseQuery.where((eb) => eb.or([eb("createdBy", "=", user.id), eb("redactedById", "=", user.id)]));
    countQuery = countQuery.where((eb) => eb.or([eb("createdBy", "=", user.id), eb("redactedById", "=", user.id)]));
  } else {
    baseQuery = baseQuery.where("report.service_id", "=", user.service_id);
    countQuery = countQuery.where("report.service_id", "=", user.service_id);
  }

  return { baseQuery, countQuery };
};

const stateReportQueries = {
  base: db
    .selectFrom("state_report")
    .where("disabled", "=", 0)
    .orderBy("created_at", "desc")
    .leftJoin("user", "user.id", "state_report.created_by")
    .selectAll(["state_report"])
    .select(["user.name as createdByName"]),
  count: db.selectFrom("state_report").where("disabled", "=", 0).select(db.fn.countAll().as("count")),
};

type StateReportQueries = {
  baseQuery: typeof stateReportQueries.base;
  countQuery: typeof stateReportQueries.count;
};
export const getStateReportQueries = (
  scope: "my" | "all",
  page: number,
  user: { id: string; service_id: string | null },
): StateReportQueries => {
  let baseQuery = stateReportQueries.base.offset(page * 20).limit(20);

  let countQuery = stateReportQueries.count;

  if (scope === "my") {
    baseQuery = baseQuery.where("created_by", "=", user.id);
    countQuery = countQuery.where("created_by", "=", user.id);
  } else {
    baseQuery = baseQuery.where("state_report.service_id", "=", user.service_id);
    countQuery = countQuery.where("state_report.service_id", "=", user.service_id);
  }

  return { baseQuery, countQuery };
};
