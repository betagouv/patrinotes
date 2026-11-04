import {
  AttachmentQueue,
  AttachmentRecord,
  IndexDBFileSystemStorageAdapter,
  PowerSyncDatabase,
  RemoteStorageAdapter,
  WatchedAttachmentItem,
} from "@powersync/web";
import { AppSchema, Database } from "./AppSchema";
import { Connector } from "./Connector";
import { wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { useQuery } from "@powersync/react";
import Bowser from "bowser";
// import { AttachmentStorage } from "./Storage";
import { LocalStorageAdapter } from "@powersync/web";
import { last } from "pastable";
import { api } from "../api";

const browser = Bowser.getParser(window.navigator.userAgent);
const isFirefox = browser.getBrowser().name === "Firefox";

// useWebWorker requires OPFS (Origin Private File System) + crypto.randomUUID (Chrome 92+)
const supportsWebWorker =
  typeof navigator.storage?.getDirectory === "function" && typeof crypto.randomUUID === "function";

// enableMultiTabs requires SharedWorker (unsupported on all iOS browsers)
const supportsMultiTabs = typeof SharedWorker !== "undefined";

console.log("Browser support - Web Worker:", supportsWebWorker, "Multi Tabs:", supportsMultiTabs);

export const powerSyncDb = new PowerSyncDatabase({
  schema: AppSchema,
  flags: {
    useWebWorker: supportsWebWorker,
    enableMultiTabs: supportsMultiTabs,
  },
  database: {
    dbFilename: "crvif-sync.db",
  },
});

export const attachmentLocalStorage = new IndexDBFileSystemStorageAdapter("crvif-attachments");
export const attachmentRemoteStorage = {
  deleteFile: async (attachment: { id: string }) => {
    console.log("deleteFile called for attachment", attachment.id, "is not configured");
  },
  downloadFile: async (attachment: { id: string }) => {
    const data = (await api.get("/api/upload/attachment", {
      query: { filePath: attachment.id },
    } as any)) as ArrayBuffer;

    return data;
  },
  uploadFile: async (data: ArrayBuffer, attachment: { id: string }) => {
    const { url } = await api.get("/api/upload/attachment/presigned-url", {
      query: { filePath: attachment.id },
    });
    await fetch(url, { method: "PUT", body: new Blob([data]) });
  },
} satisfies RemoteStorageAdapter;

export const attachmentQueue = new AttachmentQueue({
  db: powerSyncDb,
  localStorage: attachmentLocalStorage,
  remoteStorage: attachmentRemoteStorage,
  watchAttachments: (onUpdate: (attachment: WatchedAttachmentItem[]) => Promise<void>, signal: AbortSignal) => {
    powerSyncDb.watch(
      ` SELECT attachment_id FROM report_attachment WHERE is_deprecated = 0
        UNION ALL
        SELECT attachment_id FROM state_report_attachment WHERE is_deprecated = 0
        UNION ALL
        SELECT attachment_id FROM visited_section_attachment WHERE is_deprecated = 0
        UNION ALL
        SELECT attachment_id FROM state_report_alert_attachment WHERE is_deprecated = 0
        `,
      [],
      {
        onResult: async (result) => {
          const attachments =
            result.rows?._array.flatMap((row) =>
              (row.attachment_id as string).split(";").map((attachmentId) => ({
                id: attachmentId,
                fileExtension: (last(attachmentId.split(".")) as string) || "jpg",
              })),
            ) ?? [];

          await onUpdate(attachments);
        },
        onError: (error) => {
          console.error("Error watching attachments", error);
        },
      },
    );
  },

  // Optional configuration
  syncIntervalMs: 30000, // Sync every 30 seconds
  downloadAttachments: true, // Auto-download referenced files
  archivedCacheLimit: 100, // Keep 100 archived files before cleanup
});

export const db = wrapPowerSyncWithKysely<Database>(powerSyncDb);
export const useDbQuery = useQuery;

/**
 * Updates a row that the server sends (the user's service, their profile). Right after signup or login the row may
 * not be synced to the local database yet: an update would then change nothing and the edit would be lost silently.
 * Waits for the first sync when the row is missing, and fails with a message if it is still not there.
 */
export const updateSyncedRow = async <T extends "service" | "user">(
  table: T,
  id: string,
  values: Partial<Database[T]>,
) => {
  const exists = () =>
    db
      .selectFrom(table as "service")
      .select("id")
      .where("id", "=", id)
      .executeTakeFirst();

  if (!(await exists())) {
    await powerSyncDb.waitForFirstSync(AbortSignal.timeout(30_000)).catch(() => {});
    if (!(await exists())) {
      throw new Error("Vos données ne sont pas encore synchronisées. Vérifiez votre connexion et réessayez.");
    }
  }

  await db
    .updateTable(table as "service")
    .set(values as any)
    .where("id", "=", id)
    .execute();
};

export const setupPowersync = async () => {
  const connector = new Connector();
  await powerSyncDb.init();
  await powerSyncDb.connect(connector);
  await attachmentQueue.startSync();
  // Trigger an immediate download pass so referenced files are available right away
  // instead of waiting for the first syncIntervalMs tick (30 s).
  attachmentQueue.syncStorage().catch(console.error);
};

export const clearDb = async () => {
  await db.destroy();
  await powerSyncDb.disconnectAndClear();
  await powerSyncDb.close();
};

export const getAttachmentUrl = async (attachmentId: string) => {
  const buffer = await attachmentLocalStorage.readFile(attachmentId);
  const blob = new Blob([buffer], { type: "image/png" });
  return URL.createObjectURL(blob);
};
