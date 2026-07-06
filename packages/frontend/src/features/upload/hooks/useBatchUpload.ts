import { useCallback, useState } from "react";
import { v7 } from "uuid";
import { attachmentQueue } from "../../../db/db";
import { processImage } from "../UploadReportImage";
import type { MinimalAttachment } from "../UploadImage";
import { registerPendingUpload, unregisterPendingUpload } from "../pendingUploadsStore";

export type BatchUploadProgress = { current: number; total: number };

export type BatchUpload = {
  uploadFiles: (files: File[]) => Promise<void>;
  pendingUploads: MinimalAttachment[];
  progress: BatchUploadProgress;
};

/**
 * Generic parallel batch upload hook.
 * Immediately shows blob URL thumbnails for all selected files,
 * then compresses → saves to IndexedDB → inserts DB record in parallel.
 * Pending items are removed one by one as each file completes.
 */
export function useBatchUpload(
  parentId: string,
  insertRecord: (attachmentId: string) => Promise<void>,
): BatchUpload {
  const [pendingUploads, setPendingUploads] = useState<MinimalAttachment[]>([]);
  const [progress, setProgress] = useState<BatchUploadProgress>({ current: 0, total: 0 });

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const fileArray = Array.from(files);
      const pending: MinimalAttachment[] = fileArray.map((f) => ({
        id: crypto.randomUUID(),
        blobUrl: URL.createObjectURL(f),
        label: null,
        state: null,
      }));

      setPendingUploads(pending);
      setProgress({ current: 0, total: fileArray.length });

      await Promise.allSettled(
        fileArray.map(async (file, i) => {
          const attachmentId = `${parentId}/images/${v7()}.jpg`;
          registerPendingUpload(parentId, attachmentId);
          try {
            const compressed = await processImage(file);
            await attachmentQueue.saveFile({
              id: attachmentId,
              fileExtension: "jpg",
              data: compressed,
              mediaType: "image/jpeg",
            });
            await insertRecord(attachmentId);

            unregisterPendingUpload(parentId, attachmentId);
            URL.revokeObjectURL(pending[i].blobUrl!);
            setPendingUploads((prev) => prev.filter((p) => p.id !== pending[i].id));
            setProgress((p) => ({ ...p, current: p.current + 1 }));
          } catch (error) {
            // Stay registered and keep the pending thumbnail visible: the file never made it
            // to local storage, so "Finaliser" must stay blocked instead of silently dropping it.
            console.error("Error uploading image:", error);
          }
        }),
      );

      setProgress({ current: 0, total: 0 });
    },
    [parentId, insertRecord],
  );

  return { uploadFiles, pendingUploads, progress };
}
