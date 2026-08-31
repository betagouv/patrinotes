import "./polyfill";
import { sentry } from "./features/sentry";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import React, { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import { Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { registerSW } from "virtual:pwa-register";
import { initFonts } from "@patrinotes/pdf/utils";
import { powerSyncDb, setupPowersync } from "./db/db";
import { PowerSyncContext } from "@powersync/react";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Buffer } from "buffer";
import { ServiceSelection } from "./features/UdapSelection";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

globalThis.Buffer = Buffer;
if ("serviceWorker" in navigator) {
  registerSW({
    onNeedRefresh() {
      // Automatically reload when a new version is available
      window.location.reload();
    },
    onOfflineReady() {
      console.log("App ready for offline use");
    },
  });
}

// Recover when a dynamically imported chunk can't be loaded. This happens after a
// deploy when the running app (or a stale precached index.html) still references an
// old hashed chunk that no longer exists on the server.
// A plain reload usually fixes it, but if it doesn't (stale service worker cache),
// we escalate to unregistering the SW + clearing caches before reloading.
const CHUNK_RELOAD_KEY = "chunk-reload-attempt";

const recoverFromStaleChunk = async () => {
  let attempt = 0;
  try {
    attempt = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || "0");
  } catch {}

  if (attempt === 0) {
    try {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
    } catch {}
    window.location.reload();
    return;
  }

  if (attempt === 1) {
    try {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "2");
    } catch {}
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      console.error("Failed to clear caches during stale chunk recovery", e);
    }
    window.location.reload();
    return;
  }

  // Already tried a hard reset and still failing: give up to avoid a reload loop.
  console.error("Stale chunk recovery exhausted, not reloading again");
};

// Clear the guard once the app has managed to boot.
window.addEventListener("load", () => {
  setTimeout(() => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {}
  }, 5000);
});

// Vite dispatches this for failed `__vitePreload` dynamic imports.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  recoverFromStaleChunk();
});

// react-dsfr and other libs load chunks via their own `import()`, whose failures
// surface as unhandled promise rejections rather than `vite:preloadError`.
window.addEventListener("unhandledrejection", (event) => {
  const message = String(event?.reason?.message || event?.reason || "");
  if (/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(message)) {
    recoverFromStaleChunk();
  }
});

// force light mode
localStorage.setItem("scheme", "light");

startReactDsfr({ defaultColorScheme: "light", Link: Link });
initFonts();

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      networkMode: "always",
    },
    queries: {
      networkMode: "always",
    },
  },
});

const WithPowersync = ({ children }: PropsWithChildren) => {
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    setupPowersync();
    initRef.current = true;
  }, []);

  return <PowerSyncContext.Provider value={powerSyncDb}>{children}</PowerSyncContext.Provider>;
};

const matomoInstance = createInstance({
  urlBase: "https://stats.beta.gouv.fr/",
  siteId: 123,
  linkTracking: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TanStackDevtools />
    <MuiDsfrThemeProvider>
      <ErrorBoundary
        fallback={<div>Une erreur s'est produite</div>}
        onError={(error, info) => sentry?.captureException(error, { extra: { componentStack: info.componentStack } })}
      >
        <QueryClientProvider client={queryClient}>
          {/* @ts-ignore */}
          <MatomoProvider value={matomoInstance}>
            <AuthProvider>
              <WithPowersync>
                <ServiceSelection>
                  <App />
                </ServiceSelection>
              </WithPowersync>
            </AuthProvider>
          </MatomoProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </MuiDsfrThemeProvider>
  </React.StrictMode>,
);

declare module "@codegouvfr/react-dsfr/spa" {
  interface RegisterLink {
    Link: typeof Link;
  }
}
