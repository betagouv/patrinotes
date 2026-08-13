import { useEffect, useRef, useState } from "react";
import maplibregl, { FilterSpecification, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, IconButton, Popover } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { PopImmeuble } from "../../db/AppSchema";
import { CanvasButton } from "#components/ui/CanvasButton.tsx";

export type SelectedParcel = { section: string; numero: string };

type Background = "vector" | "satellite";

export const VECTOR_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
// const VECTOR_STYLE_URL = "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json";

export const CADASTRE_SOURCE_URL = "https://openmaptiles.geo.data.gouv.fr/data/cadastre.json";

export const SATELLITE_STYLE: StyleSpecification = {
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

export function parseReferenceCadastrale(ref: string | null | undefined): SelectedParcel[] {
  if (!ref) return [];
  return ref.split(";").flatMap((r) => {
    const trimmed = r.trim();
    const spaceIdx = trimmed.indexOf(" ");
    if (spaceIdx === -1) return [];
    return [{ section: trimmed.slice(0, spaceIdx), numero: trimmed.slice(spaceIdx + 1) }];
  });
}

export function buildParcelFilter(parcels: SelectedParcel[]): FilterSpecification {
  if (!parcels.length) return ["==", ["literal", "1"], ["literal", "2"]];
  return [
    "any",
    ...parcels.map((p) => ["all", ["==", ["get", "section"], p.section], ["==", ["get", "numero"], p.numero]]),
  ] as FilterSpecification;
}

function addCadastreLayers(map: maplibregl.Map) {
  if (map.getSource("cadastre")) return;
  map.addSource("cadastre", {
    type: "vector",
    url: CADASTRE_SOURCE_URL,
  });
  map.addLayer({
    id: "parcelles-fill",
    type: "fill",
    source: "cadastre",
    "source-layer": "parcelles",
    minzoom: 14,
    paint: { "fill-color": "rgba(255, 255, 255, 0.60)" },
  });
  map.addLayer({
    id: "parcelles-highlight",
    type: "fill",
    source: "cadastre",
    "source-layer": "parcelles",
    minzoom: 14,
    paint: { "fill-color": "rgba(184, 254, 201, 0.90)" },
    filter: ["==", ["literal", "1"], ["literal", "2"]],
  });
  map.addLayer({
    id: "parcelles-outline",
    type: "line",
    source: "cadastre",
    "source-layer": "parcelles",
    minzoom: 14,
    paint: { "line-color": "#000091", "line-width": 1 },
  });
  map.addLayer({
    id: "parcelles-highlight-outline",
    type: "line",
    source: "cadastre",
    "source-layer": "parcelles",
    minzoom: 14,
    paint: { "line-color": "#000091", "line-width": 3 },
    filter: ["==", ["literal", "1"], ["literal", "2"]],
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

export async function geocode(adresse: string): Promise<[number, number] | null> {
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
  onSaveReferenceCadastrale?: (ref: string) => void;
  initialCoordinates: string | null;
  initialReferenceCadastrale: string | null;
};

export const MapLibre = ({
  popMH,
  onClose,
  onSaveCoordinates,
  onSaveReferenceCadastrale,
  initialCoordinates,
  initialReferenceCadastrale,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [mode, setMode] = useState<"move" | "pin" | "cadastre">("move");
  const [background, setBackground] = useState<Background>("vector");
  const [isLayerPopoverOpen, setIsLayerPopoverOpen] = useState(false);
  const layerButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedParcels, setSelectedParcels] = useState<SelectedParcel[]>(() =>
    parseReferenceCadastrale(initialReferenceCadastrale),
  );
  const selectedParcelsRef = useRef<SelectedParcel[]>(selectedParcels);

  useEffect(() => {
    selectedParcelsRef.current = selectedParcels;
  }, [selectedParcels]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: VECTOR_STYLE_URL,
      center: [2.3488, 48.8534],
      zoom: 13,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      addCadastreLayers(map);
      const filter = buildParcelFilter(selectedParcelsRef.current);
      map.setFilter("parcelles-highlight", filter);
      map.setFilter("parcelles-highlight-outline", filter);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("parcelles-highlight")) return;
    const filter = buildParcelFilter(selectedParcels);
    map.setFilter("parcelles-highlight", filter);
    map.setFilter("parcelles-highlight-outline", filter);
  }, [selectedParcels]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || mode !== "cadastre") return;

    map.getCanvas().style.cursor = "pointer";

    const handler = (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["parcelles-fill"] });
      if (!features.length) return;

      const { section, numero } = features[0].properties as { section: string; numero: string };

      setSelectedParcels((prev) => {
        const exists = prev.findIndex((p) => p.section === section && p.numero === numero);
        if (exists >= 0) return prev.filter((_, i) => i !== exists);
        return [...prev, { section, numero }];
      });
    };

    map.on("click", handler);
    return () => {
      map.off("click", handler);
      map.getCanvas().style.cursor = "";
    };
  }, [mode]);

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
      markerRef.current = new maplibregl.Marker({ color: fr.colors.decisions.background.active.blueFrance.default })
        .setLngLat(coords)
        .addTo(map);
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

  const handleActivateCadastre = () => {
    if (mode === "cadastre") return handleCancelCadastre();
    setMode("cadastre");
  };

  const handleCancelCadastre = () => {
    setSelectedParcels([]);
    setMode("move");
  };

  const handleValidateCadastre = () => {
    const refs = selectedParcels.map((p) => `${p.section} ${p.numero}`).join(";");
    onSaveReferenceCadastrale?.(refs);
    setMode("move");
  };

  const handleActivateMove = () => {
    if (mode === "pin") handleCancelPin();
    if (mode === "cadastre") handleCancelCadastre();
    setMode("move");
  };

  const handleActivatePin = () => {
    if (mode === "pin") return handleCancelPin();
    if (mode === "cadastre") handleCancelCadastre();

    const map = mapRef.current;
    if (!map) return;
    const marker = markerRef.current;
    if (marker) {
      const { lng, lat } = marker.getLngLat();
      map.flyTo({ center: [lng, lat], zoom: 17 });
      marker.getElement().style.display = "none";
    }
    setMode("pin");
  };

  const handleCancelPin = () => {
    const marker = markerRef.current;
    if (marker) marker.getElement().style.display = "";
    setMode("move");
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
      markerRef.current = new maplibregl.Marker({ color: fr.colors.decisions.background.active.blueFrance.default })
        .setLngLat([lng, lat])
        .addTo(map);
    }
    onSaveCoordinates?.(`${lat},${lng}`);
    setMode("move");
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

      {mode === "pin" && (
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

      <Box position="absolute" top={8} right={8} zIndex={1} display="flex" flexDirection="row">
        {mode === "pin" ? (
          <>
            <CanvasButton onClick={handleValidatePin} title="Valider la nouvelle position" iconId="ri-check-line" />
            <CanvasButton onClick={handleCancelPin} title="Annuler le placement" iconId="ri-close-line" />
          </>
        ) : mode === "cadastre" ? (
          <>
            <CanvasButton
              onClick={handleValidateCadastre}
              title="Valider la sélection cadastrale"
              iconId="ri-check-line"
            />
            <CanvasButton onClick={handleCancelCadastre} title="Annuler la sélection" iconId="ri-close-line" />
          </>
        ) : (
          <CanvasButton onClick={onClose} title="Fermer le plan de situation" iconId="ri-close-line">
            Fermer
          </CanvasButton>
        )}
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

      <Box position="absolute" bottom={8} left={8} zIndex={1} display="flex" flexDirection="row" gap={0}>
        <CanvasButton
          onClick={handleActivatePin}
          title="Placer le point de localisation"
          iconId="ri-map-pin-line"
          isSelected={mode === "pin"}
        />
        <CanvasButton
          onClick={handleActivateCadastre}
          title="Sélectionner des cadastres"
          iconId="ri-collage-line"
          isSelected={mode === "cadastre"}
        />
        <CanvasButton
          onClick={handleActivateMove}
          title="Déplacer la carte"
          iconId="ri-drag-move-2-line"
          isSelected={mode === "move"}
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
