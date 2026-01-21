import "./polyfill";
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
import { initFonts } from "@cr-vif/pdf/utils";
import { powerSyncDb, setupPowersync } from "./db/db";
import { PowerSyncContext } from "@powersync/react";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Buffer } from "buffer";
import { ServiceSelection } from "./features/UdapSelection";

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TanStackDevtools />
    <MuiDsfrThemeProvider>
      <ErrorBoundary fallback={<div>Une erreur s'est produite</div>}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <WithPowersync>
              <ServiceSelection>
                <App />
              </ServiceSelection>
            </WithPowersync>
          </AuthProvider>
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
