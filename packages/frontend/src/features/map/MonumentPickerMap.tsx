import { useEffect, useRef, useState } from "react";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, IconButton, Popover } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { CanvasButton } from "#components/ui/CanvasButton.tsx";
import { SATELLITE_STYLE, VECTOR_STYLE_URL } from "./MapLibre";

type Background = "vector" | "satellite";

export type MonumentMarker = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  finalizedCount: number;
};

type Props = {
  center: [number, number];
  markers: MonumentMarker[];
  userLocation?: [number, number] | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

const BLUE_FRANCE = "#000091";

function createUserLocationElement() {
  const el = document.createElement("div");
  el.style.position = "relative";
  el.style.width = "36px";
  el.style.height = "44px";

  const circle = document.createElement("div");
  circle.style.position = "absolute";
  circle.style.top = "0";
  circle.style.left = "0";
  circle.style.width = "36px";
  circle.style.height = "36px";
  circle.style.borderRadius = "50%";
  circle.style.backgroundColor = BLUE_FRANCE;
  circle.style.border = "2px solid white";
  circle.style.boxShadow = "0 2px 4px rgba(0,0,0,0.4)";
  circle.style.display = "flex";
  circle.style.alignItems = "center";
  circle.style.justifyContent = "center";

  const icon = document.createElement("span");
  icon.className = fr.cx("ri-user-3-fill");
  icon.style.color = "white";
  icon.style.fontSize = "16px";
  circle.appendChild(icon);

  const tail = document.createElement("div");
  tail.style.position = "absolute";
  tail.style.top = "30px";
  tail.style.left = "50%";
  tail.style.transform = "translateX(-50%)";
  tail.style.width = "0";
  tail.style.height = "0";
  tail.style.borderLeft = "6px solid transparent";
  tail.style.borderRight = "6px solid transparent";
  tail.style.borderTop = `10px solid ${BLUE_FRANCE}`;

  el.appendChild(circle);
  el.appendChild(tail);

  return el;
}

const SOURCE_ID = "monuments";
const CLUSTER_LAYER_ID = "monument-clusters";
const CLUSTER_COUNT_LAYER_ID = "monument-cluster-count";
const UNCLUSTERED_LAYER_ID = "monument-unclustered-point";

function toGeoJSON(markers: MonumentMarker[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: markers.map((monument) => ({
      type: "Feature",
      properties: { id: monument.id, title: monument.title, finalizedCount: monument.finalizedCount },
      geometry: { type: "Point", coordinates: [monument.lng, monument.lat] },
    })),
  };
}

function addClusterLayers(map: maplibregl.Map, data: GeoJSON.FeatureCollection) {
  if (map.getSource(SOURCE_ID)) return;

  map.addSource(SOURCE_ID, {
    type: "geojson",
    data,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: CLUSTER_LAYER_ID,
    type: "circle",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": BLUE_FRANCE,
      "circle-opacity": 0.85,
      "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 50, 26],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.addLayer({
    id: CLUSTER_COUNT_LAYER_ID,
    type: "symbol",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Noto Sans Bold"],
      "text-size": 14,
    },
    paint: { "text-color": "#ffffff" },
  });

  map.addLayer({
    id: UNCLUSTERED_LAYER_ID,
    type: "circle",
    source: SOURCE_ID,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": BLUE_FRANCE,
      "circle-radius": 8,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });
}

export const MonumentPickerMap = ({ center, markers, userLocation, onSelect, onClose }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const dataRef = useRef<GeoJSON.FeatureCollection>(toGeoJSON(markers));
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const [background, setBackground] = useState<Background>("vector");
  const [isLayerPopoverOpen, setIsLayerPopoverOpen] = useState(false);
  const layerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: VECTOR_STYLE_URL,
      center,
      zoom: 11,
    });
    mapRef.current = map;

    map.on("style.load", () => addClusterLayers(map, dataRef.current));

    map.on("mouseenter", CLUSTER_LAYER_ID, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", CLUSTER_LAYER_ID, () => (map.getCanvas().style.cursor = ""));
    map.on("mouseenter", UNCLUSTERED_LAYER_ID, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", UNCLUSTERED_LAYER_ID, () => (map.getCanvas().style.cursor = ""));

    map.on("click", CLUSTER_LAYER_ID, (e) => {
      const feature = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_LAYER_ID] })[0];
      const clusterId = feature?.properties?.cluster_id;
      if (clusterId == null) return;
      const source = map.getSource(SOURCE_ID) as GeoJSONSource;
      source.getClusterExpansionZoom(clusterId).then((zoom) => {
        map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
      });
    });

    map.on("click", UNCLUSTERED_LAYER_ID, (e) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const { id, title, finalizedCount } = feature.properties as {
        id: string;
        title: string;
        finalizedCount: number;
      };
      const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

      const content = document.createElement("div");
      content.style.cursor = "pointer";
      content.style.fontWeight = "bold";
      content.textContent = `${title} (${finalizedCount})`;
      content.addEventListener("click", () => onSelectRef.current(id));

      new maplibregl.Popup({ closeButton: false, closeOnClick: true, offset: 12 })
        .setLngLat(coords)
        .setDOMContent(content)
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(background === "satellite" ? SATELLITE_STYLE : VECTOR_STYLE_URL);
  }, [background]);

  useEffect(() => {
    dataRef.current = toGeoJSON(markers);
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (source) source.setData(dataRef.current);
  }, [markers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    userMarkerRef.current?.remove();
    userMarkerRef.current = null;

    if (userLocation) {
      userMarkerRef.current = new maplibregl.Marker({ element: createUserLocationElement(), anchor: "bottom" })
        .setLngLat(userLocation)
        .addTo(map);
    }

    return () => {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
    };
  }, [userLocation]);

  const handleZoom = (direction: "in" | "out") => {
    const map = mapRef.current;
    if (!map) return;
    direction === "in" ? map.zoomIn() : map.zoomOut();
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

      <Box position="absolute" top={8} right={8} zIndex={1}>
        <CanvasButton onClick={onClose} title="Fermer la carte" iconId="ri-close-line" />
      </Box>

      <Box ref={layerButtonRef} position="absolute" top={56} right={8} zIndex={1}>
        <CanvasButton
          onClick={() => setIsLayerPopoverOpen(true)}
          title="Choisir le fond de carte"
          iconId="ri-stack-line"
          isSelected={isLayerPopoverOpen}
        />
      </Box>

      <Popover
        open={isLayerPopoverOpen}
        anchorEl={layerButtonRef.current}
        onClose={() => setIsLayerPopoverOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 1500 }}
      >
        <Box p={2} minWidth={220}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box component="span" fontWeight="bold">
              Fond de carte
            </Box>
            <IconButton size="small" onClick={() => setIsLayerPopoverOpen(false)} aria-label="Fermer">
              <span className={fr.cx("ri-close-line")} />
            </IconButton>
          </Box>
          <RadioButtons
            name="background"
            options={[
              {
                label: "Satellite",
                nativeInputProps: {
                  checked: background === "satellite",
                  onChange: () => setBackground("satellite"),
                },
              },
              {
                label: "Vectoriel",
                nativeInputProps: {
                  checked: background === "vector",
                  onChange: () => setBackground("vector"),
                },
              },
            ]}
            style={{ marginBottom: 0 }}
          />
        </Box>
      </Popover>

      <Box position="absolute" bottom={8} right={8} zIndex={1} display="flex" flexDirection="column">
        {(["in", "out"] as const).map((dir) => (
          <CanvasButton
            key={dir}
            onClick={() => handleZoom(dir)}
            title={dir === "in" ? "Zoom avant" : "Zoom arrière"}
            iconId={dir === "in" ? "ri-zoom-in-line" : "ri-zoom-out-line"}
          />
        ))}
      </Box>
    </Box>
  );
};
