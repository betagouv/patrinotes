import { useWatch } from "react-hook-form";
import { db, useDbQuery } from "../../../db/db";
import { useStateReportFormContext } from "../utils";
import { useQuery } from "@tanstack/react-query";

export const useStateReportAlerts = (constatId: string) => {
  return useDbQuery(db.selectFrom("state_report_alert").where("state_report_id", "=", constatId).selectAll());
};

export const useMHObjetsQuery = (constatId: string) => {
  const stateReportForm = useStateReportFormContext();
  const referencePop = useWatch({ control: stateReportForm.control, name: "reference_pop" });

  const objetsQuery = useQuery({
    queryKey: ["stateReportAlerts", "objets", referencePop],
    enabled: !!referencePop,
    queryFn: async () => {
      const objets = await db
        .selectFrom("pop_objets")
        .select(["titre_editorial", "reference"])
        .where("reference_a_une_notice_merimee_mh", "like", "%" + referencePop?.trim() + "%")
        .execute();
      return objets;
    },
    refetchOnWindowFocus: false,
  });

  return objetsQuery;
};
