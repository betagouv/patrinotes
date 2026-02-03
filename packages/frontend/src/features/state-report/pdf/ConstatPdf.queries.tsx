import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { db, getAttachmentUrl } from "../../../db/db";

export const constatPdfQueries = {
  stateReport: ({ constatId }: { constatId: string }) =>
    queryOptions({
      queryKey: ["state-report-with-user-and-attachments", constatId],
      queryFn: async () => {
        const stateReportQuery = await db
          .selectFrom("state_report")
          .leftJoin("user", "user.id", "state_report.created_by")
          .selectAll(["state_report"])
          .select(["user.name as createdByName"])
          .where("state_report.id", "=", constatId)
          .limit(1)
          .execute();

        if (stateReportQuery.length === 0) {
          return null;
        }

        const stateReport = stateReportQuery[0];

        const attachmentQuery = await db
          .selectFrom("state_report_attachment")
          .selectAll()
          .where("state_report_id", "=", constatId)
          .execute();

        const attachmentsWithFiles = await Promise.all(
          attachmentQuery.map(async (attachment) => {
            const file = await getAttachmentUrl(attachment.id);
            return {
              ...attachment,
              file,
            };
          }),
        );

        return {
          ...stateReport,
          attachments: attachmentsWithFiles,
        };
      },
      refetchOnWindowFocus: false,
    }),

  sections: ({ constatId }: { constatId: string }) =>
    queryOptions({
      queryKey: ["visited-sections-with-attachments", constatId],
      queryFn: async () => {
        const visitedSections = await db
          .selectFrom("visited_section")
          .selectAll()
          .where("state_report_id", "=", constatId)
          .execute();

        const visitedSectionAttachments = await db
          .selectFrom("visited_section_attachment")
          .selectAll()
          .where(
            "visited_section_id",
            "in",
            visitedSections.map((vs) => vs.id),
          )
          .where("is_deprecated", "=", 0)
          .execute();

        const attachments = await Promise.all(
          visitedSectionAttachments.map(async (attachment) => {
            const file = await getAttachmentUrl(attachment.id);
            return {
              ...attachment,
              file,
            };
          }),
        );

        return visitedSections.map((section) => ({
          ...section,
          attachments: attachments.filter((att) => att.visited_section_id === section.id),
        }));
      },
      refetchOnWindowFocus: false,
    }),

  alerts: ({ constatId }: { constatId: string }) =>
    queryOptions({
      queryKey: ["state-report-alerts", constatId],
      queryFn: async () => {
        const alerts = await db
          .selectFrom("state_report_alert")
          .selectAll()
          .where("state_report_id", "=", constatId)
          .execute();

        const alertAttachments = await db
          .selectFrom("state_report_alert_attachment")
          .selectAll()
          .where(
            "state_report_alert_id",
            "in",
            alerts.map((alert) => alert.id),
          )
          .where("is_deprecated", "=", 0)
          .execute();

        const attachments = await Promise.all(
          alertAttachments.map(async (attachment) => {
            const file = await getAttachmentUrl(attachment.id);
            return {
              ...attachment,
              file,
            };
          }),
        );

        return alerts.map((alert) => ({
          ...alert,
          attachments: attachments.filter((att) => att.state_report_alert_id === alert.id),
        }));
      },
      refetchOnWindowFocus: false,
    }),
};

export const constatPdfMutations = {
  send: ({ constatId }: { constatId: string }) =>
    mutationOptions({
      mutationKey: ["send-constat-pdf", constatId],
      mutationFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      },
    }),
};
