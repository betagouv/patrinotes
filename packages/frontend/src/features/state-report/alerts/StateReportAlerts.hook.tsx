import { db, useDbQuery } from "../../../db/db";

export const useStateReportAlerts = (constatId: string) => {
  return useDbQuery(db.selectFrom("state_report_alert").where("state_report_id", "=", constatId).selectAll());
};
