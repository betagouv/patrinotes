import { sql } from "kysely";
import { db, useDbQuery } from "../db/db";

const ACCENT_REPLACEMENTS: [string, string][] = [
  ["é", "e"], ["è", "e"], ["ê", "e"], ["ë", "e"],
  ["É", "e"], ["È", "e"], ["Ê", "e"], ["Ë", "e"],
  ["à", "a"], ["â", "a"], ["ä", "a"],
  ["À", "a"], ["Â", "a"], ["Ä", "a"],
  ["î", "i"], ["ï", "i"], ["Î", "i"], ["Ï", "i"],
  ["ô", "o"], ["ö", "o"], ["Ô", "o"], ["Ö", "o"],
  ["ù", "u"], ["û", "u"], ["ü", "u"],
  ["Ù", "u"], ["Û", "u"], ["Ü", "u"],
  ["ç", "c"], ["Ç", "c"],
  ["æ", "ae"], ["Æ", "ae"], ["œ", "oe"], ["Œ", "oe"],
];

const normalizeForSearch = (str: string) =>
  str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const normalizedLike = (column: string, normalizedSearch: string) => {
  let expr = `"${column}"`;
  for (const [from, to] of ACCENT_REPLACEMENTS) {
    expr = `REPLACE(${expr}, '${from}', '${to}')`;
  }
  return sql<boolean>`LOWER(${sql.raw(expr)}) LIKE ${"%" + normalizedSearch + "%"}`;
};

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

export const getSearchReportQueries = (
  search: string,
  scope: "my" | "all",
  user: { id: string; service_id: string | null },
) => {
  const normalized = normalizeForSearch(search);
  const searchConditions = (eb: any) =>
    eb.or([
      normalizedLike("title", normalized),
      normalizedLike("redactedBy", normalized),
      normalizedLike("applicantName", normalized),
      normalizedLike("applicantAddress", normalized),
      normalizedLike("city", normalized),
      normalizedLike("zipCode", normalized),
    ]);
  let baseQuery = reportQueries.base.where(searchConditions);
  let countQuery = reportQueries.count.where(searchConditions);
  if (scope === "my") {
    baseQuery = baseQuery.where((eb) => eb.or([eb("createdBy", "=", user.id), eb("redactedById", "=", user.id)]));
    countQuery = countQuery.where((eb) => eb.or([eb("createdBy", "=", user.id), eb("redactedById", "=", user.id)]));
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

export const getSearchStateReportQueries = (
  search: string,
  scope: "my" | "all",
  user: { id: string; service_id: string | null },
) => {
  const normalized = normalizeForSearch(search);
  const searchConditions = (eb: any) =>
    eb.or([
      normalizedLike("titre_edifice", normalized),
      normalizedLike("redacted_by", normalized),
      normalizedLike("commune", normalized),
      normalizedLike("commune_historique", normalized),
      normalizedLike("reference_pop", normalized),
      normalizedLike("code_postal", normalized),
    ]);
  let baseQuery = stateReportQueries.base.where(searchConditions);
  let countQuery = stateReportQueries.count.where(searchConditions);
  if (scope === "my") {
    baseQuery = baseQuery.where("created_by", "=", user.id);
    countQuery = countQuery.where("created_by", "=", user.id);
  }

  return { baseQuery, countQuery };
};
