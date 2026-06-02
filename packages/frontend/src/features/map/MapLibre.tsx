import { useEffect, useRef, useState } from "react";
import maplibregl, { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { PopImmeuble } from "../../db/AppSchema";
import { CanvasButton } from "#components/ui/CanvasButton.tsx";

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

type Props = {
  popMH: PopImmeuble | null;
  onClose: () => void;
  onSaveCoordinates?: (coordonnees: string) => void;
  initialCoordinates: string | null;
};

export const MapLibre = ({ popMH, onClose, onSaveCoordinates, initialCoordinates }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [background, setBackground] = useState<Background>("vector");
  const [pinMode, setPinMode] = useState(false);

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

    const raw = initialCoordinates ?? popMH.coordonnees_au_format_wgs84;
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

  const handleActivatePin = () => {
    if (pinMode) return handleCancelPin();

    const map = mapRef.current;
    if (!map) return;
    const marker = markerRef.current;
    if (marker) {
      const { lng, lat } = marker.getLngLat();
      map.flyTo({ center: [lng, lat], zoom: 17 });
      marker.getElement().style.display = "none";
    }
    setPinMode(true);
  };

  const handleCancelPin = () => {
    const marker = markerRef.current;
    if (marker) marker.getElement().style.display = "";
    setPinMode(false);
  };

  const handleValidatePin = () => {
    const map = mapRef.current;
    if (!map) return;
    const { lng, lat } = map.getCenter();
    const marker = markerRef.current;
    if (marker) {
      marker.setLngLat([lng, lat]);
      marker.getElement().style.display = "";
    } else {
      markerRef.current = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
    }
    onSaveCoordinates?.(`${lat},${lng}`);
    setPinMode(false);
  };

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

      {pinMode && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 2,
            fontSize: "36px",
            lineHeight: 1,
            color: fr.colors.decisions.background.active.blueFrance.default,
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.45))",
          }}
        >
          <span className={fr.cx("ri-map-pin-2-fill")} />
        </Box>
      )}

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

      <Box position="absolute" top={8} right={8} zIndex={1} display="flex" flexDirection="row">
        {pinMode ? (
          <>
            <CanvasButton onClick={handleValidatePin} title="Valider la nouvelle position" iconId="ri-check-line" />
            <CanvasButton onClick={handleCancelPin} title="Annuler le placement" iconId="ri-close-line" />
          </>
        ) : (
          <CanvasButton onClick={onClose} title="Fermer le plan de situation" iconId="ri-close-line" />
        )}
      </Box>

      <Box position="absolute" bottom={8} left={8} zIndex={1}>
        <CanvasButton
          onClick={handleActivatePin}
          title="Placer le point de localisation"
          iconId="ri-map-pin-line"
          isSelected={pinMode}
        />
      </Box>

      <Box position="absolute" bottom={8} right={8} zIndex={1} display="flex" flexDirection="column">
        {(["in", "out"] as const).map((dir) => (
          <CanvasButton
            key={dir}
            onClick={() => handleZoom(dir)}
            title={dir === "in" ? "Zoom avant" : "Zoom arrière"}
            iconId={dir === "in" ? "ri-zoom-in-line" : "ri-zoom-out-line"}
          ></CanvasButton>
        ))}
      </Box>
    </Box>
  );
};
