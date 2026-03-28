import { useCallback, useRef } from "react";
import { useActorRef, useSelector } from "@xstate/react";
import { attachmentLocalStorage, attachmentQueue, db, useDbQuery } from "../../../db/db";
import { useLiveUser } from "../../../contexts/AuthContext";
import { attachmentUploadMachine } from "../machines/attachmentUploadMachine";
import { MinimalAttachment } from "../UploadImage";
import { v7 } from "uuid";

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

  // Keep the latest insert implementation in a ref so the stable callback never goes stale.
  const insertRecordImplRef = useRef<(attachmentId: string) => Promise<void>>(null!);
  insertRecordImplRef.current = async (attachmentId: string) => {
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
  };

  // Stable callback wrapping the ref — safe to pass as machine input.
  const stableInsertRecord = useCallback((id: string) => insertRecordImplRef.current(id), []);

  const uploadActorRef = useActorRef(attachmentUploadMachine, {
    input: { parentId, insertRecord: stableInsertRecord },
  });

  const uploadState = useSelector(uploadActorRef, (snap) => snap.value);
  const uploadError = useSelector(uploadActorRef, (snap) => snap.context.error);

  // Exposes a mutateAsync-compatible API so callers don't need to change.
  const mutateAsync = useCallback(
    (file: File): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        // Send the event first so the machine leaves idle before subscribe fires.
        uploadActorRef.send({ type: "UPLOAD_FILE", file });

        const sub = uploadActorRef.subscribe((snap) => {
          if (snap.matches("idle")) {
            sub.unsubscribe();
            resolve();
          } else if (snap.matches("failed")) {
            sub.unsubscribe();
            reject(new Error(snap.context.error ?? "Upload failed"));
          }
        });
      });
    },
    [uploadActorRef],
  );

  const isUploading = uploadState === "compressing" || uploadState === "saving" || uploadState === "inserting";

  const addMutation = {
    mutateAsync,
    isPending: isUploading,
    isError: uploadState === "failed",
    error: uploadError,
    retry: () => uploadActorRef.send({ type: "RETRY" }),
    dismiss: () => uploadActorRef.send({ type: "DISMISS" }),
  };

  const deleteMutation = {
    mutate: async ({ id }: { id: string }) => {
      await attachmentLocalStorage.deleteFile(id);
      await db.updateTable(config.table).set({ is_deprecated: 1 }).where("id", "=", id).execute();
    },
  };

  const onLabelChange = async (attachmentId: string, label: string) => {
    if (config.table === "report_attachment") return;
    await db.updateTable(config.table).set({ label }).where("id", "=", attachmentId).execute();
  };

  /**
   * Replaces an existing attachment with a new composite image generated locally.
   * Saves the blob to IndexedDB immediately so the thumbnail never goes blank,
   * then creates the new linking record and deprecates the old one.
   * Returns the new attachment ID so the caller can write picture_lines with newAttachmentId.
   */
  const replaceAttachment = useCallback(
    async (oldId: string, data: ArrayBuffer): Promise<string> => {
      const newId = `${parentId}/images/${v7()}.jpg`;
      await attachmentQueue.saveFile({ id: newId, fileExtension: "jpg", data, mediaType: "image/jpeg" });
      await insertRecordImplRef.current(newId);
      await db.updateTable(config.table).set({ is_deprecated: 1 }).where("id", "=", oldId).execute();
      return newId;
    },
    // parentId and config.table are stable for the lifetime of this hook instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentId, config.table],
  );

  return { attachments, addMutation, deleteMutation, onLabelChange, replaceAttachment };
}
