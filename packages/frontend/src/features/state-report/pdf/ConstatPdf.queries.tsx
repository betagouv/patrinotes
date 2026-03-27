import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { attachmentLocalStorage, db, getAttachmentUrl } from "../../../db/db";
import { AlertWithAttachments, SendConstatForm } from "./ConstatPdfContext";
import { api } from "../../../api";
import { MinimalAlert } from "@cr-vif/pdf/constat";

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
        const extraAttachmentIds = [
          stateReport.plan_edifice,
          stateReport.plan_situation,
          ...(stateReport.vue_generale?.split(";").filter((id) => id.trim() !== "") || []),
        ];
        const attachmentQuery = await db
          .selectFrom("state_report_attachment")
          .leftJoin("attachments", "attachments.id", "state_report_attachment.attachment_id")
          .select([
            "state_report_attachment.id",
            "state_report_attachment.attachment_id",
            "state_report_attachment.label",
            "attachments.local_uri",
            "attachments.state",
            "attachments.media_type",
            "state_report_attachment.created_at",
            "state_report_attachment.service_id",
            "state_report_attachment.is_deprecated",
            "state_report_attachment.is_ignored",
            "state_report_attachment.state_report_id",
          ])
          .where("state_report_attachment.is_deprecated", "=", 0)
          .where((eb) =>
            eb.or([
              eb("state_report_attachment.state_report_id", "=", constatId),
              eb(
                "state_report_attachment.attachment_id",
                "in",
                extraAttachmentIds.filter((id): id is string => !!id),
              ),
            ]),
          )
          .execute();

        const attachmentsWithFiles = await Promise.all(
          attachmentQuery.map(async (attachment) => {
            const file = await attachmentLocalStorage.readFile(attachment.local_uri!);
            const url = URL.createObjectURL(new Blob([file], { type: attachment.media_type || undefined }));

            return {
              ...attachment,
              file: url,
            };
          }),
        );

        return {
          ...stateReport,
          attachments: attachmentsWithFiles,
        };
      },
      refetchOnWindowFocus: false,
      gcTime: 0,
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
          .leftJoin("attachments", "attachments.id", "visited_section_attachment.attachment_id")
          .select([
            "visited_section_attachment.id",
            "visited_section_attachment.attachment_id",
            "visited_section_attachment.label",
            "visited_section_attachment.visited_section_id",
            "visited_section_attachment.is_deprecated",
            "visited_section_attachment.is_ignored",
            "visited_section_attachment.created_at",
            "visited_section_attachment.service_id",
            "attachments.local_uri",
            "attachments.state",
            "attachments.media_type",
          ])
          .where(
            "visited_section_id",
            "in",
            visitedSections.map((vs) => vs.id),
          )
          .where("is_deprecated", "=", 0)
          .execute();

        const attachments = await Promise.all(
          visitedSectionAttachments.map(async (attachment) => {
            if (!attachment.local_uri) {
              return {
                ...attachment,
                file: null,
              };
            }
            const file = await attachmentLocalStorage.readFile(attachment.local_uri!);
            const url = URL.createObjectURL(new Blob([file], { type: attachment.media_type || undefined }));
            return {
              ...attachment,
              file: url,
            };
          }),
        );

        return visitedSections.map((section) => ({
          ...section,
          attachments: attachments.filter((att) => att.visited_section_id === section.id),
        }));
      },
      refetchOnWindowFocus: false,
      gcTime: 0,
      throwOnError: true,
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
          .leftJoin("attachments", "attachments.id", "state_report_alert_attachment.attachment_id")
          .select([
            "state_report_alert_attachment.id",
            "state_report_alert_attachment.attachment_id",
            "state_report_alert_attachment.label",
            "state_report_alert_attachment.state_report_alert_id",
            "attachments.local_uri",
            "attachments.state",
            "attachments.media_type",
            "state_report_alert_attachment.is_deprecated",
            "state_report_alert_attachment.is_ignored",
            "state_report_alert_attachment.created_at",
            "state_report_alert_attachment.service_id",
          ])
          .where(
            "state_report_alert_id",
            "in",
            alerts.map((alert) => alert.id),
          )
          .where("is_deprecated", "=", 0)
          .execute();

        const attachments = await Promise.all(
          alertAttachments.map(async (attachment) => {
            const file = await attachmentLocalStorage.readFile(attachment.local_uri!);
            const url = URL.createObjectURL(new Blob([file], { type: attachment.media_type || undefined }));
            return {
              ...attachment,
              file: url,
            };
          }),
        );

        return alerts.map((alert) => ({
          ...alert,
          attachments: attachments.filter((att) => att.state_report_alert_id === alert.id),
        }));
      },
      refetchOnWindowFocus: false,
      gcTime: 0,
    }),
};

export const constatPdfMutations = {
  send: ({ constatId }: { constatId: string }) =>
    mutationOptions({
      mutationKey: ["send-constat-pdf", constatId],
      mutationFn: async ({ alerts, htmlString, recipients }: SendConstatForm) => {
        await api.post("/api/pdf/state-report", {
          body: {
            stateReportId: constatId,
            htmlString: htmlString!,
            recipients: recipients.join(","),
            alerts: alerts,
          },
        });
      },
    }),
};
