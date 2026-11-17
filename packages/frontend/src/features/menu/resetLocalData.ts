import { AttachmentState } from "@powersync/web";
import { clear as clearKeyval } from "idb-keyval";
import { apiStore } from "../../ApiStore";
import { attachmentLocalStorage, attachmentQueue, powerSyncDb } from "../../db/db";

const POWERSYNC_DB_NAME = "crvif-sync.db";
const RESET_CHANNEL = "patrinotes/local-data-reset";

// localStorage keys that must survive a reset. Without `crvif/version`, AuthContext
// wipes the session and reloads a second time on the next boot.
const PRESERVED_LOCAL_STORAGE_KEYS = ["crvif/version", "scheme"];

export type PendingLocalChanges = { changes: number; attachments: number };

/** Local writes not yet sent to the server: a reset would destroy them. */
export const getPendingLocalChanges = async (): Promise<PendingLocalChanges> => {
  const [queue, attachments] = await Promise.all([
    withTimeout(powerSyncDb.getUploadQueueStats(), 3000, "getUploadQueueStats").catch(() => null),
    withTimeout(
      powerSyncDb.getOptional<{ count: number }>("SELECT COUNT(*) AS count FROM attachments WHERE state = ?", [
        AttachmentState.QUEUED_UPLOAD,
      ]),
      3000,
      "count pending attachments",
    ).catch(() => null),
  ]);

  return { changes: queue?.count ?? 0, attachments: attachments?.count ?? 0 };
};

/**
 * Wipes every local copy of the user data, then reloads the app.
 *
 * Each step is bounded by a timeout and failures do not stop the next steps: once the
 * reset has started, the app must reload no matter what, otherwise it stays on a
 * half-closed database (blank screens).
 *
 * Databases this page keeps open (PowerSync, attachments, auth) are emptied rather than
 * deleted: `indexedDB.deleteDatabase` is blocked while a connection is open, and a
 * pending delete queues every later `open` of that database — including the ones the
 * reloaded app makes at boot, which then waits forever.
 */
export const resetLocalData = async () => {
  await step("stop attachment sync", () => attachmentQueue.stopSync(), 5000);

  const cleared = await step("clear PowerSync database", () => powerSyncDb.disconnectAndClear(), 15000);
  await step("clear attachments", () => attachmentLocalStorage.clear(), 5000);
  await step("clear auth", () => clearKeyval(apiStore.store), 5000);
  await step("close PowerSync database", () => powerSyncDb.close(), 5000);

  // Other databases nobody holds open here can be deleted. The PowerSync file is only
  // deleted when clearing it failed (e.g. a corrupted database).
  const keep = new Set<string>(["crvif-attachments", "auth"]);
  if (cleared) keep.add(POWERSYNC_DB_NAME);
  await step(
    "delete other databases",
    async () => {
      const dbs = (await indexedDB.databases?.()) ?? [];
      await Promise.all(
        dbs
          .map((db) => db.name)
          .filter((name): name is string => !!name && !keep.has(name))
          .map((name) => deleteDatabase(name)),
      );
    },
    5000,
  );

  await step("clear localStorage", async () => clearLocalStorage(), 1000);
  await step("unregister service workers", unregisterServiceWorkers, 5000);
  await step("clear caches", clearCaches, 5000);

  // Other open tabs still hold connections and an old in-memory state: reload them too.
  try {
    const channel = new BroadcastChannel(RESET_CHANNEL);
    channel.postMessage("reset");
    channel.close();
  } catch {}

  window.location.replace("/");
};

/** Reloads this tab when another tab resets the local data. */
export const listenForLocalDataReset = () => {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(RESET_CHANNEL);
  channel.onmessage = (event) => {
    if (event.data === "reset") window.location.replace("/");
  };
};

const clearLocalStorage = () => {
  const preserved = PRESERVED_LOCAL_STORAGE_KEYS.map((key) => [key, localStorage.getItem(key)] as const);
  localStorage.clear();
  for (const [key, value] of preserved) {
    if (value !== null) localStorage.setItem(key, value);
  }
  localStorage.setItem("crvif/no-report-alert-closed", "true");
};

/** Resolves once the delete request settles, or when it is blocked by an open connection. */
const deleteDatabase = (name: string) =>
  new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error("Failed to delete database", name, request.error);
      resolve();
    };
    request.onblocked = () => {
      console.warn("Deleting database is blocked by an open connection", name);
      resolve();
    };
  });

const unregisterServiceWorkers = async () => {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
};

const clearCaches = async () => {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
};

const step = async (label: string, run: () => Promise<unknown>, timeoutMs: number) => {
  try {
    await withTimeout(run(), timeoutMs, label);
    return true;
  } catch (error) {
    console.error(`Local data reset: "${label}" failed`, error);
    return false;
  }
};

const withTimeout = <T>(promise: Promise<T>, ms: number, label: string) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms} ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
