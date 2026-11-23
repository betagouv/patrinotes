import { useSyncExternalStore } from "react";

/**
 * A new version of the app is installed and waits for this page to let it take over (vite-plugin-pwa
 * `prompt` mode). `apply` activates it; the page reloads once the new service worker controls it.
 */
let pendingUpdate: (() => Promise<void>) | null = null;
const listeners = new Set<() => void>();

export const setPendingUpdate = (apply: () => Promise<void>) => {
  pendingUpdate = apply;
  listeners.forEach((listener) => listener());
};

export const applyPendingUpdate = () => pendingUpdate?.();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useIsUpdateAvailable = () => useSyncExternalStore(subscribe, () => pendingUpdate !== null);
