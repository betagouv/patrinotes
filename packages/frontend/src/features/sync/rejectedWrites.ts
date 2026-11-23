import { useSyncExternalStore } from "react";
import { sentry } from "../sentry";

/**
 * Local writes the server did not apply: refused by `/api/upload-data` (`success: false`), or set aside after
 * failing again and again. PowerSync drops them from its upload queue and syncs the server state back, so
 * without this list the agent's change would vanish silently.
 *
 * Kept in localStorage, which the local data reset (and so the logout) clears with the rest.
 */
export type RejectedWrite = {
  /** Table of the row, e.g. "report", "state_report". */
  table: string;
  /** Row id, to tell several rejected rows apart. */
  id: string;
  op: string;
  /** ISO date of the rejection. */
  date: string;
  /** Reason given by the server, or "erreur serveur répétée". */
  reason: string;
};

export const REPEATED_SERVER_ERROR = "erreur serveur répétée";

const STORAGE_KEY = "patrinotes/rejected-writes";
// Enough to show what happened; older entries are dropped if a broken client keeps getting refused.
const MAX_ENTRIES = 50;

const listeners = new Set<() => void>();
let cache: { raw: string | null; value: RejectedWrite[] } = { raw: null, value: [] };

const read = (): RejectedWrite[] => {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {}
  if (raw === cache.raw) return cache.value;

  let value: RejectedWrite[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed;
  } catch {}
  cache = { raw, value };
  return value;
};

const write = (entries: RejectedWrite[]) => {
  try {
    if (entries.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    else localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Could not store rejected writes", error);
  }
  listeners.forEach((listener) => listener());
};

export const getRejectedWrites = read;

export const addRejectedWrite = (entry: Omit<RejectedWrite, "date">) => {
  write([...read(), { ...entry, date: new Date().toISOString() }].slice(-MAX_ENTRIES));

  // Table, operation and reason only: the row id and its data stay on the device.
  sentry?.captureMessage("Écriture de synchronisation non appliquée (client)", {
    level: "warning",
    tags: { table: entry.table, op: entry.op },
    extra: { table: entry.table, op: entry.op, reason: entry.reason },
  });
};

export const clearRejectedWrites = () => write([]);

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // other tabs, where the upload may run
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const useRejectedWrites = () => useSyncExternalStore(subscribe, read, () => []);

/** Turns the `error` of an `/api/upload-data` answer into a reason an agent can read. */
export const getRejectionReason = (response: { error?: unknown; reason?: unknown } | undefined) => {
  if (typeof response?.reason === "string" && response.reason) return response.reason;
  const error = response?.error;
  if (error === "Forbidden") return "modification non autorisée";
  if (typeof error === "string" && error) return error;
  return "erreur lors de l'enregistrement sur le serveur";
};
