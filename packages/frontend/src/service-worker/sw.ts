import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { isDev } from "../envVars";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const manif = self.__WB_MANIFEST;
cleanupOutdatedCaches();
precacheAndRoute(manif);

registerRoute(({ url }) => url.pathname === "/env.js", new NetworkFirst({ cacheName: "env-js" }));

if (!isDev) {
  const handler = createHandlerBoundToURL("/index.html");
  registerRoute(new NavigationRoute(handler));
}
