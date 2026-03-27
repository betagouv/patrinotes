import { setup, fromPromise, assign } from "xstate";
import { attachmentLocalStorage } from "../../../db/db";
import type { MinimalAttachment } from "../UploadImage";

type ThumbnailContext = {
  attachment: MinimalAttachment;
  hasLines: boolean;
  blobUrl: string | null;
  error: string | null;
};

type ThumbnailEvent =
  | { type: "ATTACHMENT_UPDATED"; attachment: MinimalAttachment; hasLines: boolean }
  | { type: "RETRY" };

/**
 * State machine for a single image thumbnail.
 *
 * States:
 *  init          — chooses between waitingForUri or loadingBlob based on local_uri
 *  waitingForUri — local_uri is null; waits for PowerSync to populate it
 *  loadingBlob   — reads bytes from IndexedDB and creates an object URL
 *  ready         — blob URL available; image visible
 *  blobError     — load failed; shows placeholder + retry button
 *
 * External data changes (attachment state, picture_lines) are pushed in via
 * ATTACHMENT_UPDATED events from the component.
 */
export const thumbnailMachine = setup({
  types: {
    context: {} as ThumbnailContext,
    events: {} as ThumbnailEvent,
    input: {} as { attachment: MinimalAttachment; hasLines: boolean },
  },
  actors: {
    loadBlobFromStorage: fromPromise<string, { localUri: string; mediaType: string | null | undefined }>(
      async ({ input }) => {
        const buffer = await attachmentLocalStorage.readFile(input.localUri);
        const blob = new Blob([buffer], { type: input.mediaType ?? "image/jpeg" });
        return URL.createObjectURL(blob);
      },
    ),
  },
  actions: {
    updateAttachment: assign({
      attachment: ({ event }) => (event as Extract<ThumbnailEvent, { type: "ATTACHMENT_UPDATED" }>).attachment,
      hasLines: ({ event }) => (event as Extract<ThumbnailEvent, { type: "ATTACHMENT_UPDATED" }>).hasLines,
    }),
    revokeCurrentBlobUrl: ({ context }) => {
      if (context.blobUrl) URL.revokeObjectURL(context.blobUrl);
    },
    setBlobUrl: assign({
      blobUrl: ({ event }) => (event as unknown as { output: string }).output,
      error: null,
    }),
    clearBlobUrl: assign({ blobUrl: null }),
    setError: assign({
      error: ({ event }) => {
        const err = (event as unknown as { error: unknown }).error;
        return err instanceof Error ? err.message : "Failed to load image";
      },
    }),
  },
  guards: {
    hasLocalUri: ({ context }) => !!context.attachment.local_uri,
    newLocalUriAvailable: ({ event }) =>
      !!(event as Extract<ThumbnailEvent, { type: "ATTACHMENT_UPDATED" }>).attachment.local_uri,
    localUriChanged: ({ context, event }) => {
      const e = event as Extract<ThumbnailEvent, { type: "ATTACHMENT_UPDATED" }>;
      return e.attachment.local_uri !== context.attachment.local_uri;
    },
  },
}).createMachine({
  id: "thumbnail",
  context: ({ input }) => ({
    attachment: input.attachment,
    hasLines: input.hasLines,
    blobUrl: null,
    error: null,
  }),
  initial: "init",
  states: {
    /** Immediately routes to loadingBlob or waitingForUri based on whether local_uri is set. */
    init: {
      always: [
        { target: "loadingBlob", guard: "hasLocalUri" },
        { target: "waitingForUri" },
      ],
    },
    /** local_uri is null — PowerSync hasn't populated the attachments table yet. */
    waitingForUri: {
      on: {
        ATTACHMENT_UPDATED: [
          {
            guard: "newLocalUriAvailable",
            target: "loadingBlob",
            actions: "updateAttachment",
          },
          { actions: "updateAttachment" },
        ],
      },
    },
    /** Fetching bytes from IndexedDB and creating a blob URL. */
    loadingBlob: {
      invoke: {
        src: "loadBlobFromStorage",
        input: ({ context }) => ({
          localUri: context.attachment.local_uri!,
          mediaType: context.attachment.mediaType,
        }),
        onDone: {
          target: "ready",
          actions: ["revokeCurrentBlobUrl", "setBlobUrl"],
        },
        onError: {
          target: "blobError",
          actions: "setError",
        },
      },
      on: {
        ATTACHMENT_UPDATED: { actions: "updateAttachment" },
      },
    },
    /** Blob URL loaded; image is visible. Attachment metadata updates are received here. */
    ready: {
      on: {
        ATTACHMENT_UPDATED: [
          {
            guard: "localUriChanged",
            target: "loadingBlob",
            actions: ["revokeCurrentBlobUrl", "clearBlobUrl", "updateAttachment"],
          },
          { actions: "updateAttachment" },
        ],
      },
    },
    /** Blob load failed; shows grey placeholder with retry button.
     *  Auto-retries every 5 s — covers the startup race where setupPowersync()
     *  hasn't finished opening the IndexedDB storage adapter yet when the
     *  component first mounts (setupPowersync is fire-and-forget in main.tsx). */
    blobError: {
      after: {
        5000: { target: "loadingBlob" },
      },
      on: {
        RETRY: { target: "loadingBlob" },
        ATTACHMENT_UPDATED: [
          {
            guard: "newLocalUriAvailable",
            target: "loadingBlob",
            actions: "updateAttachment",
          },
          { actions: "updateAttachment" },
        ],
      },
    },
  },
});
