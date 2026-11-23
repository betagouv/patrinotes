import * as maplibregl from "maplibre-gl";
// MapLibre 6 is ESM only and starts its worker from a URL next to its own module, which Vite's dependency
// pre-bundling moves: hand it the worker file explicitly (it is self-contained, so it is copied as is in builds).
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";

maplibregl.setWorkerUrl(workerUrl);

export { maplibregl };
