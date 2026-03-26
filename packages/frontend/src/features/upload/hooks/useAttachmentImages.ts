import { useMutation } from "@tanstack/react-query";
import { v7 } from "uuid";
import { attachmentLocalStorage, attachmentQueue, db, useDbQuery } from "../../../db/db";
import { useLiveUser } from "../../../contexts/AuthContext";
import { processImage } from "../UploadReportImage";
import { MinimalAttachment } from "../UploadImage";

type AttachmentTableConfig =
  | { table: "report_attachment"; fkColumn: "report_id"; fkValue: string }
  | { table: "visited_section_attachment"; fkColumn: "visited_section_id"; fkValue: string }
  | { table: "state_report_alert_attachment"; fkColumn: "state_report_alert_id"; fkValue: string };

function buildQuery(config: AttachmentTableConfig) {
  switch (config.table) {
    case "report_attachment":
      return db
        .selectFrom("report_attachment")
        .leftJoin("attachments", "attachments.id", "report_attachment.attachment_id")
        .where("report_attachment.report_id", "=", config.fkValue)
        .where("report_attachment.is_deprecated", "=", 0)
        .select((eb) => [
          "report_attachment.id",
          eb.val(null).as("label"),
          "attachments.local_uri",
          "attachments.state",
          eb.ref("attachments.media_type").as("mediaType"),
        ])
        .orderBy("report_attachment.created_at", "asc");

    case "visited_section_attachment":
      return db
        .selectFrom("visited_section_attachment")
        .leftJoin("attachments", "attachments.id", "visited_section_attachment.attachment_id")
        .where("visited_section_attachment.visited_section_id", "=", config.fkValue)
        .where("visited_section_attachment.is_deprecated", "=", 0)
        .select((eb) => [
          "visited_section_attachment.id",
          "visited_section_attachment.label",
          "attachments.local_uri",
          "attachments.state",
          eb.ref("attachments.media_type").as("mediaType"),
        ])
        .orderBy("visited_section_attachment.created_at", "asc");

    case "state_report_alert_attachment":
      return db
        .selectFrom("state_report_alert_attachment")
        .leftJoin("attachments", "attachments.id", "state_report_alert_attachment.attachment_id")
        .where("state_report_alert_attachment.state_report_alert_id", "=", config.fkValue)
        .where("state_report_alert_attachment.is_deprecated", "=", 0)
        .select((eb) => [
          "state_report_alert_attachment.id",
          "state_report_alert_attachment.label",
          "attachments.local_uri",
          "attachments.state",
          eb.ref("attachments.media_type").as("mediaType"),
        ])
        .orderBy("state_report_alert_attachment.created_at", "asc");
  }
}

export function useAttachmentImages(config: AttachmentTableConfig, parentId: string) {
  const user = useLiveUser()!;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = useDbQuery(buildQuery(config) as any);
  const attachments = (result.data ?? []) as MinimalAttachment[];

  const addMutation = useMutation({
    mutationFn: async (file: File) => {
      const attachmentId = `${parentId}/images/${v7()}.jpg`;
      const processedFile = await processImage(file);

      await attachmentQueue.saveFile({
        id: attachmentId,
        fileExtension: "jpg",
        data: processedFile,
        mediaType: "image/jpeg",
      });

      switch (config.table) {
        case "report_attachment":
          await db
            .insertInto("report_attachment")
            .values({
              id: attachmentId,
              attachment_id: attachmentId,
              report_id: config.fkValue,
              service_id: user.service_id,
              created_at: new Date().toISOString(),
              is_deprecated: 0,
            })
            .execute();
          break;
        case "visited_section_attachment":
          await db
            .insertInto("visited_section_attachment")
            .values({
              id: attachmentId,
              attachment_id: attachmentId,
              visited_section_id: config.fkValue,
              label: "",
              service_id: user.service_id,
              created_at: new Date().toISOString(),
              is_deprecated: 0,
            })
            .execute();
          break;
        case "state_report_alert_attachment":
          await db
            .insertInto("state_report_alert_attachment")
            .values({
              id: attachmentId,
              attachment_id: attachmentId,
              state_report_alert_id: config.fkValue,
              label: "",
              service_id: user.service_id,
              created_at: new Date().toISOString(),
              is_deprecated: 0,
            })
            .execute();
          break;
      }

      return attachmentId;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await attachmentLocalStorage.deleteFile(id);
      await db.updateTable(config.table).set({ is_deprecated: 1 }).where("id", "=", id).execute();
    },
  });

  const onLabelChange = async (attachmentId: string, label: string) => {
    if (config.table === "report_attachment") return;
    await db.updateTable(config.table).set({ label }).where("id", "=", attachmentId).execute();
  };

  return { attachments, addMutation, deleteMutation, onLabelChange };
}
