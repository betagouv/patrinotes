import { useSyncExternalStore } from "react";

/**
 * Tracks image uploads that are still compressing/saving/inserting locally,
 * keyed by parentId (constatId). Lets the "Finaliser" button know images are
 * still being processed even before their DB row exists (see useBatchUpload
 * and attachmentUploadMachine, which only insert the row once the file is
 * compressed and saved to local storage).
 */
const pendingByParent = new Map<string, Set<string>>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function registerPendingUpload(parentId: string, key: string) {
  if (!pendingByParent.has(parentId)) pendingByParent.set(parentId, new Set());
  pendingByParent.get(parentId)!.add(key);
  notify();
}

export function unregisterPendingUpload(parentId: string, key: string) {
  const set = pendingByParent.get(parentId);
  if (!set) return;
  set.delete(key);
  if (set.size === 0) pendingByParent.delete(parentId);
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getIsUploading(parentId: string) {
  return (pendingByParent.get(parentId)?.size ?? 0) > 0;
}

export function useIsUploadingImages(parentId: string | null | undefined) {
  return useSyncExternalStore(subscribe, () => (parentId ? getIsUploading(parentId) : false));
}
