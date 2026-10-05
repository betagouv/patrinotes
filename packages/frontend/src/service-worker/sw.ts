import { cleanupOutdatedCaches, getCacheKeyForURL, precacheAndRoute } from "workbox-precaching";
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
  // Serve navigations network-first so a fresh deploy's index.html (and its new
  // hashed chunk references) is picked up as soon as the user is online, instead
  // of always serving the precached copy which may point at chunks that have
  // since been removed from the server. Falls back to the precached index.html
  // when offline or on network failure.
  const navigationHandler = new NetworkFirst({
    cacheName: "navigations",
    plugins: [
      {
        handlerDidError: async () => {
          const cacheKey = getCacheKeyForURL("/index.html");
          return cacheKey ? caches.match(cacheKey) : Response.error();
        },
      },
    ],
  });
  registerRoute(new NavigationRoute(navigationHandler));
}
