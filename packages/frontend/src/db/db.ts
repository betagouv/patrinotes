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

export const powerSyncDb = new PowerSyncDatabase({
  schema: AppSchema,
  flags: {
    useWebWorker: false,
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
    const formData = new FormData();
    formData.append("file", new Blob([data]), attachment.id);
    await api.post("/api/upload/attachment", { body: formData, query: { filePath: attachment.id } } as any);
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
        UNION ALL
        SELECT vue_generale as attachment_id FROM state_report WHERE vue_generale IS NOT NULL AND vue_generale != '' AND disabled = false
        UNION ALL
        SELECT plan_edifice as attachment_id FROM state_report WHERE plan_edifice IS NOT NULL AND plan_edifice != '' AND disabled = false
        UNION ALL
        SELECT plan_situation as attachment_id FROM state_report WHERE plan_situation IS NOT NULL AND plan_situation != '' AND disabled = false
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

export const setupPowersync = async () => {
  const connector = new Connector();
  await powerSyncDb.init();
  await powerSyncDb.connect(connector, {
    params: {
      schema_version: 1,
    },
  });
  await attachmentQueue.startSync();
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
