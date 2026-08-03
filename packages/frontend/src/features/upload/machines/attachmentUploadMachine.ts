import { setup, fromPromise, assign } from "xstate";
import { v7 } from "uuid";
import { attachmentQueue } from "../../../db/db";
import { processImage } from "../UploadReportImage";
import { AttachmentRecord } from "@powersync/common";
import { registerPendingUpload, unregisterPendingUpload } from "../pendingUploadsStore";

type UploadContext = {
  parentId: string;
  /** Table-specific insert function passed in as input. Kept in context so actors can reference it. */
  insertRecord: (attachmentId: string) => Promise<any>;
  file: File | null;
  compressedData: ArrayBuffer | null;
  attachmentId: string | null;
  error: string | null;
};

type UploadEvent = { type: "UPLOAD_FILE"; file: File } | { type: "RETRY" } | { type: "DISMISS" };

/**
 * State machine for a single file upload lifecycle.
 *
 * States:
 *  idle        — waiting for a file
 *  compressing — browser-image-compression running in a web worker
 *  saving      — writing bytes to IndexedDB via attachmentQueue
 *  inserting   — creating the DB record (after file is local, so watchAttachments
 *                sees an attachment that already exists in local storage)
 *  failed      — any step errored; retry or dismiss
 *
 * On success, the machine returns to idle and the reactive DB query
 * in useAttachmentImages picks up the new attachment automatically.
 */
export const attachmentUploadMachine = setup({
  types: {
    context: {} as UploadContext,
    events: {} as UploadEvent,
    input: {} as {
      parentId: string;
      insertRecord: (attachmentId: string) => Promise<any>;
    },
  },
  actors: {
    compressImage: fromPromise<ArrayBuffer, { file: File }>(async ({ input }) => processImage(input.file)),
    saveToStorage: fromPromise<AttachmentRecord, { attachmentId: string; data: ArrayBuffer }>(async ({ input }) =>
      attachmentQueue.saveFile({
        id: input.attachmentId,
        fileExtension: "jpg",
        data: input.data,
        mediaType: "image/jpeg",
      }),
    ),
    insertRecord: fromPromise<void, { attachmentId: string; insertFn: (id: string) => Promise<any> }>(
      async ({ input }) => {
        await input.insertFn(input.attachmentId);
      },
    ),
  },
  actions: {
    setFile: assign({
      file: ({ event }) => (event as Extract<UploadEvent, { type: "UPLOAD_FILE" }>).file,
      attachmentId: ({ context }) => `${context.parentId}/images/${v7()}.jpg`,
    }),
    registerPending: ({ context }) => {
      registerPendingUpload(context.parentId, context.attachmentId!);
    },
    unregisterPending: ({ context }) => {
      if (context.attachmentId) unregisterPendingUpload(context.parentId, context.attachmentId);
    },
    setCompressedData: assign({
      compressedData: ({ event }) => (event as unknown as { output: ArrayBuffer }).output,
    }),
    setError: assign({
      error: ({ event }) => {
        const err = (event as unknown as { error: unknown }).error;
        return err instanceof Error ? err.message : "Upload failed";
      },
    }),
    reset: assign({
      file: null,
      compressedData: null,
      attachmentId: null,
      error: null,
    }),
  },
}).createMachine({
  id: "attachmentUpload",
  context: ({ input }) => ({
    parentId: input.parentId,
    insertRecord: input.insertRecord,
    file: null,
    compressedData: null,
    attachmentId: null,
    error: null,
  }),
  initial: "idle",
  states: {
    idle: {
      on: {
        UPLOAD_FILE: { target: "compressing", actions: ["setFile", "registerPending"] },
      },
    },
    compressing: {
      invoke: {
        src: "compressImage",
        input: ({ context }) => ({ file: context.file! }),
        onDone: { target: "saving", actions: "setCompressedData" },
        onError: { target: "failed", actions: "setError" },
      },
    },
    saving: {
      invoke: {
        src: "saveToStorage",
        input: ({ context }) => ({ attachmentId: context.attachmentId!, data: context.compressedData! }),
        onDone: { target: "inserting" },
        onError: { target: "failed", actions: "setError" },
      },
    },
    inserting: {
      invoke: {
        src: "insertRecord",
        input: ({ context }) => ({ attachmentId: context.attachmentId!, insertFn: context.insertRecord }),
        onDone: { target: "idle", actions: ["unregisterPending", "reset"] },
        onError: { target: "failed", actions: "setError" },
      },
    },
    /**
     * Any step failed; user can retry (re-runs from compressing) or dismiss.
     * Stays registered as a pending upload while failed so "Finaliser" remains blocked —
     * only an explicit DISMISS (user ignoring the file) unblocks it.
     */
    failed: {
      on: {
        RETRY: { target: "compressing" },
        DISMISS: { target: "idle", actions: ["unregisterPending", "reset"] },
      },
    },
  },
});
