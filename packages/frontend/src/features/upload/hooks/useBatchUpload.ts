import { useCallback, useRef, useState } from "react";
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
  cancel: (id: string) => void;
  retry: (id: string) => void;
};

const errorMessageFor = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  if (/mime|type|image/i.test(message)) {
    return "Ce fichier n'est pas une image valide.";
  }
  return "Impossible d'envoyer cette photo. Vérifiez votre connexion et réessayez.";
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
  // Files can't be aborted mid-flight (compression/IndexedDB write have no cancel hook),
  // so cancelling just marks the id to be ignored once its step resolves, and hides it now.
  const cancelledRef = useRef<Set<string>>(new Set());
  // Keeps the original File around per pending item id, so a failed upload can be retried
  // without asking the user to re-pick the file.
  const filesRef = useRef<Map<string, File>>(new Map());

  const cancel = useCallback((id: string) => {
    cancelledRef.current.add(id);
    filesRef.current.delete(id);
    setPendingUploads((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.blobUrl) URL.revokeObjectURL(item.blobUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const runUpload = useCallback(
    async (file: File, item: MinimalAttachment) => {
      const attachmentId = `${parentId}/images/${v7()}.jpg`;
      registerPendingUpload(parentId, attachmentId);

      const bailIfCancelled = () => {
        if (!cancelledRef.current.has(item.id)) return false;
        cancelledRef.current.delete(item.id);
        unregisterPendingUpload(parentId, attachmentId);
        return true;
      };

      try {
        setPendingUploads((prev) => prev.map((p) => (p.id === item.id ? { ...p, error: null } : p)));

        const compressed = await processImage(file);
        if (bailIfCancelled()) return;

        await attachmentQueue.saveFile({
          id: attachmentId,
          fileExtension: "jpg",
          data: compressed,
          mediaType: "image/jpeg",
        });
        if (bailIfCancelled()) return;

        await insertRecord(attachmentId);

        unregisterPendingUpload(parentId, attachmentId);
        if (item.blobUrl) URL.revokeObjectURL(item.blobUrl);
        filesRef.current.delete(item.id);
        setPendingUploads((prev) => prev.filter((p) => p.id !== item.id));
        setProgress((p) => ({ ...p, current: p.current + 1 }));
      } catch (error) {
        if (bailIfCancelled()) return;
        // Stay registered and keep the pending thumbnail visible: the file never made it
        // to local storage, so "Finaliser" must stay blocked instead of silently dropping it.
        // Surface the failure so the user can see it and retry, instead of a thumbnail stuck
        // pending forever with no explanation.
        console.error("Error uploading image:", error);
        setPendingUploads((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, error: errorMessageFor(error) } : p)),
        );
      }
    },
    [parentId, insertRecord],
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const fileArray = Array.from(files);
      const pending: MinimalAttachment[] = fileArray.map((f) => ({
        id: crypto.randomUUID(),
        blobUrl: URL.createObjectURL(f),
        label: null,
        state: null,
        error: null,
      }));

      for (const [i, item] of pending.entries()) {
        filesRef.current.set(item.id, fileArray[i]);
      }

      setPendingUploads((prev) => [...prev, ...pending]);
      setProgress({ current: 0, total: fileArray.length });

      await Promise.allSettled(fileArray.map((file, i) => runUpload(file, pending[i])));

      setProgress({ current: 0, total: 0 });
    },
    [runUpload],
  );

  const retry = useCallback(
    (id: string) => {
      const file = filesRef.current.get(id);
      const item = pendingUploads.find((p) => p.id === id);
      if (!file || !item) return;
      void runUpload(file, item);
    },
    [pendingUploads, runUpload],
  );

  return { uploadFiles, pendingUploads, progress, cancel, retry };
}
