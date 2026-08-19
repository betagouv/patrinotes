import maplibregl from "maplibre-gl";
import {
  CADASTRE_SOURCE_URL,
  SATELLITE_STYLE,
  buildParcelFilter,
  parseReferenceCadastrale,
} from "./MapLibre";
import { waitForIdle } from "./waitForIdle";

const SNAPSHOT_WIDTH = 640;
const SNAPSHOT_HEIGHT = 480;
const SCALE_DENOMINATOR = 5000;
// Standard CSS px-to-inch convention: keeps the printed scale correct since the
// PDF embeds this image at a fixed display height (see ImageCell in packages/pdf).
const DPI = 96;

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

const MARKER_WIDTH = 27;
const MARKER_HEIGHT = 41;
const MARKER_COLOR = "#000091";

// maplibregl.Marker renders as a DOM element layered over the map, not onto the WebGL
// canvas, so canvas.toBlob() never captures it. Draw an equivalent pin manually instead.
async function drawMarkerPin(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): Promise<void> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${MARKER_WIDTH}" height="${MARKER_HEIGHT}" viewBox="0 0 27 41">
    <path fill="${MARKER_COLOR}" stroke="#fff" stroke-width="1" d="M13.5 0C6.04 0 0 6.04 0 13.5c0 10.5 13.5 27.5 13.5 27.5S27 24 27 13.5C27 6.04 20.96 0 13.5 0z"/>
    <circle cx="13.5" cy="13.5" r="5.5" fill="#fff"/>
  </svg>`;
  const img = new Image();
  const url = `data:image/svg+xml;base64,${btoa(svg)}`;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Le chargement du repère a échoué"));
    img.src = url;
  });
  const width = MARKER_WIDTH * scale;
  const height = MARKER_HEIGHT * scale;
  ctx.drawImage(img, x - width / 2, y - height, width, height);
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
    await waitForIdle(map, () => new PlanSituationOfflineError());

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

      await waitForIdle(map, () => new PlanSituationOfflineError());
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const mapCanvas = map.getCanvas();
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = mapCanvas.width;
    outputCanvas.height = mapCanvas.height;
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) throw new Error("La capture du plan a échoué");
    ctx.drawImage(mapCanvas, 0, 0);

    const scale = mapCanvas.width / SNAPSHOT_WIDTH;
    const { x, y } = map.project([lng, lat]);
    await drawMarkerPin(ctx, x * scale, y * scale, scale);

    const blob = await new Promise<Blob>((resolve, reject) =>
      outputCanvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("La capture du plan a échoué"))),
        "image/jpeg",
        0.92,
      ),
    );
    return blob;
  } finally {
    map.remove();
    container.remove();
  }
}
