import { AttachmentState } from "@powersync/web";
import { db, useDbQuery } from "../../../db/db";

export type UnsyncedAttachment = {
  id: string;
  attachmentId: string;
  label: string | null;
  state: number | null;
  table: "state_report_attachment" | "visited_section_attachment" | "state_report_alert_attachment";
};

export function useUnsyncedAttachments(stateReportId: string | null | undefined): UnsyncedAttachment[] {
  const safeId = stateReportId ?? "";

  const stateReportAttachmentsResult = useDbQuery(
    db
      .selectFrom("state_report_attachment")
      .leftJoin("attachments", "attachments.id", "state_report_attachment.attachment_id")
      .where("state_report_attachment.state_report_id", "=", safeId)
      .where("state_report_attachment.is_deprecated", "=", 0)
      .where("state_report_attachment.is_ignored", "=", 0)
      .select([
        "state_report_attachment.id",
        "state_report_attachment.attachment_id as attachmentId",
        "state_report_attachment.label",
        "attachments.state",
      ]),
  );

  const visitedSectionAttachmentsResult = useDbQuery(
    db
      .selectFrom("visited_section_attachment")
      .leftJoin("attachments", "attachments.id", "visited_section_attachment.attachment_id")
      .where("visited_section_attachment.visited_section_id", "in", (qb) =>
        qb.selectFrom("visited_section").select("id").where("state_report_id", "=", safeId),
      )
      .where("visited_section_attachment.is_deprecated", "=", 0)
      .where("visited_section_attachment.is_ignored", "=", 0)
      .select([
        "visited_section_attachment.id",
        "visited_section_attachment.attachment_id as attachmentId",
        "visited_section_attachment.label",
        "attachments.state",
      ]),
  );

  const alertAttachmentsResult = useDbQuery(
    db
      .selectFrom("state_report_alert_attachment")
      .leftJoin("attachments", "attachments.id", "state_report_alert_attachment.attachment_id")
      .where("state_report_alert_attachment.state_report_alert_id", "in", (qb) =>
        qb.selectFrom("state_report_alert").select("id").where("state_report_id", "=", safeId),
      )
      .where("state_report_alert_attachment.is_deprecated", "=", 0)
      .where("state_report_alert_attachment.is_ignored", "=", 0)
      .select([
        "state_report_alert_attachment.id",
        "state_report_alert_attachment.attachment_id as attachmentId",
        "state_report_alert_attachment.label",
        "attachments.state",
      ]),
  );

  if (!stateReportId) return [];

  return [
    ...(stateReportAttachmentsResult.data ?? [])
      .filter((row) => row.attachmentId != null)
      .map((row) => ({ ...row, attachmentId: row.attachmentId!, table: "state_report_attachment" as const })),
    ...(visitedSectionAttachmentsResult.data ?? [])
      .filter((row) => row.attachmentId != null)
      .map((row) => ({ ...row, attachmentId: row.attachmentId!, table: "visited_section_attachment" as const })),
    ...(alertAttachmentsResult.data ?? [])
      .filter((row) => row.attachmentId != null)
      .map((row) => ({ ...row, attachmentId: row.attachmentId!, table: "state_report_alert_attachment" as const })),
  ];
}
