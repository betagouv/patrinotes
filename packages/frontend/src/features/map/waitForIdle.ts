import maplibregl from "maplibre-gl";

const TILE_LOAD_TIMEOUT_MS = 15000;

/** Resolves once the map has finished loading tiles/rendering, or rejects with `makeError()`
 *  if that hasn't happened within a timeout or a map error fires (e.g. offline). */
export function waitForIdle(map: maplibregl.Map, makeError: () => Error): Promise<void> {
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
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(makeError());
    }, TILE_LOAD_TIMEOUT_MS);

    const onError = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(makeError());
    };

    const onIdle = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const cleanup = () => {
      clearTimeout(timeout);
      map.off("error", onError);
      map.off("idle", onIdle);
    };

    map.on("error", onError);
    map.on("idle", onIdle);
  });
}
