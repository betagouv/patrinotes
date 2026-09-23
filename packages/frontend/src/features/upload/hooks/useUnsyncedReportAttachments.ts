import { AttachmentState } from "@powersync/web";
import { db, useDbQuery } from "../../../db/db";

export function useUnsyncedReportAttachments(reportId: string | null | undefined) {
  const safeId = reportId ?? "";

  const reportAttachmentsResult = useDbQuery(
    db
      .selectFrom("report_attachment")
      .leftJoin("attachments", "attachments.id", "report_attachment.attachment_id")
      .where("report_attachment.report_id", "=", safeId)
      .where("report_attachment.is_deprecated", "=", 0)
      .where("report_attachment.is_ignored", "=", 0)
      .select(["report_attachment.id", "report_attachment.attachment_id as attachmentId", "attachments.state"]),
  );

  if (!reportId) return [];

  return (reportAttachmentsResult.data ?? []).filter(
    (row) => row.attachmentId != null && row.state === AttachmentState.QUEUED_DOWNLOAD,
  );
}
