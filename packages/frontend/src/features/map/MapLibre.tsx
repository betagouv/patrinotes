import { useEffect, useRef, useState } from "react";
import maplibregl, { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { PopImmeuble } from "../../db/AppSchema";

type Background = "vector" | "satellite";

const VECTOR_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg",
      ],
      tileSize: 256,
      attribution: "© IGN",
      maxzoom: 19,
    },
  },
  layers: [{ id: "satellite-bg", type: "raster", source: "satellite" }],
};

function addCadastreLayers(map: maplibregl.Map) {
  if (map.getSource("cadastre")) return;
  map.addSource("cadastre", {
    type: "vector",
    url: "https://openmaptiles.geo.data.gouv.fr/data/cadastre.json",
  });
  map.addLayer({
    id: "parcelles-fill",
    type: "fill",
    source: "cadastre",
    "source-layer": "parcelles",
    minzoom: 14,
    paint: { "fill-color": "#f97316", "fill-opacity": 0.25 },
  });
  map.addLayer({
    id: "parcelles-outline",
    type: "line",
    source: "cadastre",
    "source-layer": "parcelles",
    minzoom: 14,
    paint: { "line-color": "#c2410c", "line-width": 2, "line-opacity": 0.9 },
  });
  map.addLayer({
    id: "parcelles-label",
    type: "symbol",
    source: "cadastre",
    "source-layer": "parcelles",
    minzoom: 16,
    layout: {
      "text-field": ["concat", ["get", "section"], " ", ["get", "numero"]],
      "text-size": 14,
      "text-font": ["Noto Sans Regular"],
      "text-anchor": "center",
    },
    paint: {
      "text-color": "#1e1e1e",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1.5,
    },
  });
}

async function geocode(adresse: string): Promise<[number, number] | null> {
  const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`);
  if (!res.ok) return null;
  const data = await res.json();
  const coords = data.features?.[0]?.geometry?.coordinates;
  return coords ?? null;
}

type Props = { popMH: PopImmeuble | null; onClose?: () => void };

export const MapLibre = ({ popMH, onClose }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [background, setBackground] = useState<Background>("vector");

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: VECTOR_STYLE_URL,
      center: [2.3488, 48.8534],
      zoom: 13,
    });
    mapRef.current = map;
    map.on("style.load", () => addCadastreLayers(map));
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleZoom = (direction: "in" | "out") => {
    const map = mapRef.current;
    if (!map) return;
    direction === "in" ? map.zoomIn() : map.zoomOut();
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(background === "satellite" ? SATELLITE_STYLE : VECTOR_STYLE_URL);
  }, [background]);

  useEffect(() => {
    if (!popMH) return;

    const flyTo = (coords: [number, number]) => {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo({ center: coords, zoom: 17 });
      markerRef.current?.remove();
      markerRef.current = new maplibregl.Marker().setLngLat(coords).addTo(map);
    };

    const raw = popMH.coordonnees_au_format_wgs84;
    if (raw) {
      const [lat, lng] = raw.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        flyTo([lng, lat]);
        return;
      }
    }

    const adresse = popMH.adresse_forme_editoriale;
    if (adresse) geocode(adresse).then((coords) => coords && flyTo(coords));
  }, [popMH]);

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      sx={{
        ".maplibregl-ctrl-attrib": {
          display: "none",
        },
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <Box position="absolute" top={8} left={8} zIndex={1}>
        <ToggleButtonGroup
          value={background}
          exclusive
          onChange={(_, v) => v && setBackground(v)}
          size="small"
          sx={{ backgroundColor: "white", borderRadius: "4px", boxShadow: 1 }}
        >
          <ToggleButton value="vector" sx={{ px: 1.5, py: 0.5, fontSize: "12px" }}>
            Plan
          </ToggleButton>
          <ToggleButton value="satellite" sx={{ px: 1.5, py: 0.5, fontSize: "12px" }}>
            Satellite
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {onClose && (
        <Box position="absolute" top={8} right={8} zIndex={1}>
          <Box
            component="button"
            type="button"
            onClick={onClose}
            title="Fermer"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              padding: 0,
              cursor: "pointer",
              bgcolor: "white",
              border: "1px solid",
              borderColor: fr.colors.decisions.background.active.blueFrance.default,
              color: fr.colors.decisions.background.active.blueFrance.default,
              borderRadius: 0,
              fontSize: "1.1rem",
              boxShadow: 1,
            }}
          >
            <Box component="span" className={fr.cx("ri-close-line")} />
          </Box>
        </Box>
      )}
      <Box position="absolute" bottom={8} right={8} zIndex={1} display="flex" flexDirection="column">
        {(["in", "out"] as const).map((dir) => (
          <Box
            key={dir}
            component="button"
            type="button"
            onClick={() => handleZoom(dir)}
            title={dir === "in" ? "Zoom avant" : "Zoom arrière"}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              padding: 0,
              cursor: "pointer",
              bgcolor: "white",
              border: "1px solid",
              borderColor: fr.colors.decisions.background.active.blueFrance.default,
              color: fr.colors.decisions.background.active.blueFrance.default,
              borderRadius: 0,
              marginTop: "-1px",
              fontSize: "1.1rem",
              boxShadow: 1,
            }}
          >
            <Box component="span" className={fr.cx(dir === "in" ? "ri-zoom-in-line" : "ri-zoom-out-line")} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
