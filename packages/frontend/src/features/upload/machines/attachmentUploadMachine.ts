import { setup, fromPromise, assign } from "xstate";
import { v7 } from "uuid";
import { attachmentQueue } from "../../../db/db";
import { processImage } from "../UploadReportImage";

type UploadContext = {
  parentId: string;
  /** Table-specific insert function passed in as input. Kept in context so actors can reference it. */
  insertRecord: (attachmentId: string) => Promise<void>;
  file: File | null;
  compressedData: ArrayBuffer | null;
  attachmentId: string | null;
  error: string | null;
};

type UploadEvent =
  | { type: "UPLOAD_FILE"; file: File }
  | { type: "RETRY" }
  | { type: "DISMISS" };

/**
 * State machine for a single file upload lifecycle.
 *
 * States:
 *  idle        — waiting for a file
 *  compressing — browser-image-compression running in a web worker
 *  saving      — writing bytes to IndexedDB via attachmentQueue
 *  inserting   — creating the DB record
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
      insertRecord: (attachmentId: string) => Promise<void>;
    },
  },
  actors: {
    compressImage: fromPromise<ArrayBuffer, { file: File }>(async ({ input }) => processImage(input.file)),
    saveToStorage: fromPromise<string, { parentId: string; data: ArrayBuffer }>(async ({ input }) => {
      const id = `${input.parentId}/images/${v7()}.jpg`;
      await attachmentQueue.saveFile({
        id,
        fileExtension: "jpg",
        data: input.data,
        mediaType: "image/jpeg",
      });
      return id;
    }),
    insertRecord: fromPromise<void, { attachmentId: string; insertFn: (id: string) => Promise<void> }>(
      async ({ input }) => input.insertFn(input.attachmentId),
    ),
  },
  actions: {
    setFile: assign({
      file: ({ event }) => (event as Extract<UploadEvent, { type: "UPLOAD_FILE" }>).file,
    }),
    setCompressedData: assign({
      compressedData: ({ event }) => (event as unknown as { output: ArrayBuffer }).output,
    }),
    setAttachmentId: assign({
      attachmentId: ({ event }) => (event as unknown as { output: string }).output,
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
        UPLOAD_FILE: { target: "compressing", actions: "setFile" },
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
        input: ({ context }) => ({ parentId: context.parentId, data: context.compressedData! }),
        onDone: { target: "inserting", actions: "setAttachmentId" },
        onError: { target: "failed", actions: "setError" },
      },
    },
    inserting: {
      invoke: {
        src: "insertRecord",
        input: ({ context }) => ({ attachmentId: context.attachmentId!, insertFn: context.insertRecord }),
        onDone: { target: "idle", actions: "reset" },
        onError: { target: "failed", actions: "setError" },
      },
    },
    /** Any step failed; user can retry (re-runs from compressing) or dismiss. */
    failed: {
      on: {
        RETRY: { target: "compressing" },
        DISMISS: { target: "idle", actions: "reset" },
      },
    },
  },
});
