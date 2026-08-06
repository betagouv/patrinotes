import maplibregl from "maplibre-gl";
import { waitForIdle } from "../map/waitForIdle";

export class MapOfflineError extends Error {
  constructor() {
    super("La carte n'a pas pu être chargée car l'appareil est hors ligne.");
    this.name = "MapOfflineError";
  }
}

/**
 * Crops the live, already-rendered map canvas down to the on-screen rectangle described by
 * `zoneEl`, relative to `containerEl`. Pins and drawn strokes are native MapLibre layers, so
 * they're already part of the WebGL canvas — no separate compositing step is needed.
 */
export async function cropMapToZone({
  map,
  containerEl,
  zoneEl,
}: {
  map: maplibregl.Map;
  containerEl: HTMLElement;
  zoneEl: HTMLElement;
}): Promise<Blob> {
  await waitForIdle(map, () => new MapOfflineError());
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const containerRect = containerEl.getBoundingClientRect();
  const zoneRect = zoneEl.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  const sx = (zoneRect.left - containerRect.left) * dpr;
  const sy = (zoneRect.top - containerRect.top) * dpr;
  const sw = zoneRect.width * dpr;
  const sh = zoneRect.height * dpr;

  const sourceCanvas = map.getCanvas();
  const offscreen = document.createElement("canvas");
  offscreen.width = sw;
  offscreen.height = sh;
  const ctx = offscreen.getContext("2d")!;
  ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

  return new Promise<Blob>((resolve, reject) =>
    offscreen.toBlob((b) => (b ? resolve(b) : reject(new Error("La capture de la carte a échoué"))), "image/jpeg", 0.92),
  );
}
