# Map Feature Plan

## Goal

A reusable map component that:
- Shows cadastre parcel polygons (from the French government open tile server)
- Lets the user switch between a **satellite** background and a **vector** background
- Nothing else (no drawing, no selection, no other layers)

---

## Status: implemented ✓

Replaced the OpenStreetMap iframe in `PlanDeSituationModal` with a MapLibre GL map.

**Component:** `packages/frontend/src/features/map/MapLibre.tsx`

---

## Library: MapLibre GL JS (raw, no react-map-gl wrapper)

- `maplibre-gl` installed in `@patrinotes/frontend`
- Used directly via `useRef` + `useEffect` — no React wrapper needed for this read-only use case

---

## Background Layers

| Mode | Source | Type |
|---|---|---|
| **Plan** (default) | OpenFreeMap | Vector style URL: `https://tiles.openfreemap.org/styles/liberty` |
| **Satellite** | IGN Geopf | WMTS: `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&...&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM` |

Both are free, no API key required. Switching triggers `map.setStyle()`, which fires `style.load` and re-adds the cadastre overlay automatically.

---

## Cadastre Overlay

Always visible. Source:
```
https://openmaptiles.geo.data.gouv.fr/data/cadastre.json
```

Two layers added after every style load:
- `parcelles-fill` — semi-transparent yellow fill (minzoom 14)
- `parcelles-outline` — white stroke (minzoom 14)

---

## Address Centering

Uses the French government geocoding API:
```
https://api-adresse.data.gouv.fr/search/?q={adresse}&limit=1
```

On geocode success: `map.flyTo({ center, zoom: 17 })` + a marker pin.

---

## Possible Next Steps

- Add a buildings layer (`batiments`) for context at high zoom
- Make cadastre a toggleable overlay (add a third toggle button)
- Add the IGN PLAN.IGN style as a third background option (stays on the same tile provider as cadastre)
- Expose `onCoordinatesChange` prop if a route ever needs to save a location
