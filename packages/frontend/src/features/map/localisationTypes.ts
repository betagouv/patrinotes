export type LocalisationPin = { id: number; lng: number; lat: number };
export type LocalisationLine = { points: { lng: number; lat: number }[]; color: string; width: number };
export type LocalisationZone = { sw: [number, number]; ne: [number, number] };

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const parseLocalisationPins = (raw: string | null | undefined): LocalisationPin[] => safeParse(raw, []);

export const parseLocalisationDrawings = (raw: string | null | undefined): LocalisationLine[] => safeParse(raw, []);

export const parseLocalisationZone = (raw: string | null | undefined): LocalisationZone | null => safeParse(raw, null);

/** Id of the raster image registered on the map for a given pin number/selection state. */
export function pinIconId(id: number, selected: boolean): string {
  return `localisation-pin-${id}-${selected ? "selected" : "default"}`;
}

export function pinsToGeoJSON(pins: LocalisationPin[], selectedId?: number | null): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: pins.map((pin) => {
      const selected = pin.id === selectedId;
      return {
        type: "Feature",
        properties: { number: pin.id, selected, iconId: pinIconId(pin.id, selected) },
        geometry: { type: "Point", coordinates: [pin.lng, pin.lat] },
      };
    }),
  };
}

export function drawingsToGeoJSON(lines: LocalisationLine[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: lines
      .filter((line) => line.points.length > 1)
      .map((line) => ({
        type: "Feature",
        properties: { color: line.color, width: line.width },
        geometry: { type: "LineString", coordinates: line.points.map((p) => [p.lng, p.lat]) },
      })),
  };
}
