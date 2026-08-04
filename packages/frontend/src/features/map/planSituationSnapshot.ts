import maplibregl from "maplibre-gl";
import {
  CADASTRE_SOURCE_URL,
  SATELLITE_STYLE,
  buildParcelFilter,
  parseReferenceCadastrale,
} from "./MapLibre";

const SNAPSHOT_WIDTH = 640;
const SNAPSHOT_HEIGHT = 480;
const SCALE_DENOMINATOR = 5000;
// Standard CSS px-to-inch convention: keeps the printed scale correct since the
// PDF embeds this image at a fixed display height (see ImageCell in packages/pdf).
const DPI = 96;
const TILE_LOAD_TIMEOUT_MS = 15000;

export class PlanSituationOfflineError extends Error {
  constructor() {
    super("Le plan de situation n'a pas pu être généré car l'appareil est hors ligne.");
    this.name = "PlanSituationOfflineError";
  }
}

function zoomForScale(scaleDenominator: number, latitude: number): number {
  const metersPerPixel = (scaleDenominator * 0.0254) / DPI;
  return Math.log2((156543.03392804097 * Math.cos((latitude * Math.PI) / 180)) / metersPerPixel);
}

function waitForIdle(map: maplibregl.Map): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new PlanSituationOfflineError());
    }, TILE_LOAD_TIMEOUT_MS);

    const onError = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new PlanSituationOfflineError());
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

/**
 * Renders an offscreen satellite snapshot centered on `coordonnees`, at a true 1:5000
 * scale, showing only the parcels selected in `referenceCadastrale` (not the full cadastre
 * layer). Throws PlanSituationOfflineError if tiles can't be fetched (offline).
 */
export async function generatePlanSituationSnapshot({
  coordonnees,
  referenceCadastrale,
}: {
  coordonnees: string;
  referenceCadastrale: string | null;
}): Promise<Blob> {
  if (!navigator.onLine) throw new PlanSituationOfflineError();

  const [lat, lng] = coordonnees.split(",").map(Number);
  if (isNaN(lat) || isNaN(lng)) throw new Error("Coordonnées invalides");

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-99999px";
  container.style.top = "0px";
  container.style.width = `${SNAPSHOT_WIDTH}px`;
  container.style.height = `${SNAPSHOT_HEIGHT}px`;
  document.body.appendChild(container);

  const map = new maplibregl.Map({
    container,
    style: SATELLITE_STYLE,
    center: [lng, lat],
    zoom: zoomForScale(SCALE_DENOMINATOR, lat),
    interactive: false,
    attributionControl: false,
    canvasContextAttributes: { preserveDrawingBuffer: true },
  });

  try {
    await waitForIdle(map);

    const parcels = parseReferenceCadastrale(referenceCadastrale);
    if (parcels.length) {
      map.addSource("cadastre-snapshot", { type: "vector", url: CADASTRE_SOURCE_URL });
      const filter = buildParcelFilter(parcels);
      map.addLayer({
        id: "parcelles-snapshot-fill",
        type: "fill",
        source: "cadastre-snapshot",
        "source-layer": "parcelles",
        filter,
        paint: { "fill-color": "rgba(184, 254, 201, 0.55)" },
      });
      map.addLayer({
        id: "parcelles-snapshot-outline",
        type: "line",
        source: "cadastre-snapshot",
        "source-layer": "parcelles",
        filter,
        paint: { "line-color": "#000091", "line-width": 3 },
      });

      await waitForIdle(map);
    }

    new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = map.getCanvas();
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("La capture du plan a échoué"))), "image/jpeg", 0.92),
    );
    return blob;
  } finally {
    map.remove();
    container.remove();
  }
}
