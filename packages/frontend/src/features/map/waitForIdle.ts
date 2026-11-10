import maplibregl from "maplibre-gl";

const TILE_LOAD_TIMEOUT_MS = 30000;

/** Why waiting for the map failed: what tells "offline" from "map service unavailable". */
export type MapLoadFailure = {
  timedOut: boolean;
  /** tiles that failed to load (status code when the server answered) */
  failedTiles: { url?: string; status?: number }[];
  loadedTiles: number;
  error?: unknown;
};

/** Resolves once the map has finished loading tiles/rendering, or rejects with `makeError(failure)`
 *  if that hasn't happened within a timeout, a map-level error fires, or every tile failed. */
export function waitForIdle(map: maplibregl.Map, makeError: (failure: MapLoadFailure) => Error): Promise<void> {
  return new Promise((resolve, reject) => {
    // The "idle" event only fires on a *transition* into idle. A live map the user has
    // been panning/zooming (e.g. LocalisationMap) is usually already idle by the time this
    // is called, so waiting for the event alone would hang until the timeout below.
    // map.loaded() (unlike areTilesLoaded()) is reliably false right after a map is first
    // constructed — areTilesLoaded() can be vacuously true before any tiles were even
    // requested yet, which would resolve here before the fresh offscreen map used by
    // planSituationSnapshot has rendered anything, producing a blank/black capture.
    if (!map.isMoving() && !map.isZooming() && !map.isRotating() && map.loaded()) {
      resolve();
      return;
    }

    let settled = false;
    const failedTiles: MapLoadFailure["failedTiles"] = [];
    let loadedTiles = 0;

    const fail = (failure: Partial<MapLoadFailure>) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(makeError({ timedOut: false, failedTiles, loadedTiles, ...failure }));
    };

    const timeout = setTimeout(() => fail({ timedOut: true }), TILE_LOAD_TIMEOUT_MS);

    // One failing tile (no imagery there, a 4xx/5xx of the map server) must not abort the capture: the map
    // still draws the others and reaches "idle". Only a map-level error (style, source) does.
    const onError = (event: maplibregl.ErrorEvent & { tile?: unknown; sourceId?: string }) => {
      if (event.tile || event.sourceId) {
        const error = event.error as { url?: string; status?: number } | undefined;
        failedTiles.push({ url: error?.url, status: error?.status });
        return;
      }
      fail({ error: event.error });
    };

    const onData = (event: maplibregl.MapDataEvent & { tile?: unknown }) => {
      if (event.dataType === "source" && event.tile) loadedTiles++;
    };

    const onIdle = () => {
      if (settled) return;
      // nothing could be drawn: the capture would be blank
      if (failedTiles.length && !loadedTiles) return fail({});
      settled = true;
      cleanup();
      resolve();
    };

    const cleanup = () => {
      clearTimeout(timeout);
      map.off("error", onError);
      map.off("data", onData);
      map.off("idle", onIdle);
    };

    map.on("error", onError);
    map.on("data", onData);
    map.on("idle", onIdle);
  });
}
