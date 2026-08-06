import { useEffect, useRef, useState } from "react";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, Popover } from "@mui/material";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { CanvasButton } from "#components/ui/CanvasButton.tsx";
import { ColorSelection, drawingColors } from "../upload/ColorSelection";
import { SATELLITE_STYLE, VECTOR_STYLE_URL } from "./MapLibre";
import {
  LocalisationLine,
  LocalisationPin,
  LocalisationZone,
  drawingsToGeoJSON,
  pinsToGeoJSON,
} from "./localisationTypes";

type Background = "vector" | "satellite";
type Mode = "move" | "pin" | "draw";

const PINS_SOURCE_ID = "localisation-pins";
const PIN_CIRCLE_LAYER_ID = "localisation-pins-circle";
const PIN_LABEL_LAYER_ID = "localisation-pins-label";
const DRAWINGS_SOURCE_ID = "localisation-drawings";
const DRAWINGS_LINE_LAYER_ID = "localisation-drawings-line";

const BLUE_FRANCE = "#000091";
const WIDTH_OPTIONS = [3, 6];
const PIN_RADIUS = 13;
const PIN_RADIUS_SELECTED = 18;
const DELETE_POPOVER_GAP = 12;

function addLocalisationLayers(
  map: maplibregl.Map,
  pins: LocalisationPin[],
  lines: LocalisationLine[],
  selectedPinId?: number | null,
) {
  if (!map.getSource(DRAWINGS_SOURCE_ID)) {
    map.addSource(DRAWINGS_SOURCE_ID, { type: "geojson", data: drawingsToGeoJSON(lines) });
    map.addLayer({
      id: DRAWINGS_LINE_LAYER_ID,
      type: "line",
      source: DRAWINGS_SOURCE_ID,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": ["get", "color"], "line-width": ["get", "width"] },
    });
  }

  if (!map.getSource(PINS_SOURCE_ID)) {
    map.addSource(PINS_SOURCE_ID, { type: "geojson", data: pinsToGeoJSON(pins, selectedPinId) });
    map.addLayer({
      id: PIN_CIRCLE_LAYER_ID,
      type: "circle",
      source: PINS_SOURCE_ID,
      paint: {
        "circle-radius": ["case", ["get", "selected"], PIN_RADIUS_SELECTED, PIN_RADIUS],
        "circle-color": BLUE_FRANCE,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
      },
    });
    map.addLayer({
      id: PIN_LABEL_LAYER_ID,
      type: "symbol",
      source: PINS_SOURCE_ID,
      layout: {
        "text-field": ["get", "number"],
        "text-font": ["Noto Sans Bold"],
        "text-size": ["case", ["get", "selected"], 16, 13],
      },
      paint: { "text-color": "#ffffff" },
    });
  }
}

/** Fits the map so the fixed on-screen zone rectangle frames the given geographic bounds. */
function fitZoneBounds(map: maplibregl.Map, containerEl: HTMLElement, zoneEl: HTMLElement, zone: LocalisationZone) {
  const containerRect = containerEl.getBoundingClientRect();
  const zoneRect = zoneEl.getBoundingClientRect();
  map.fitBounds([zone.sw, zone.ne], {
    padding: {
      top: zoneRect.top - containerRect.top,
      bottom: containerRect.bottom - zoneRect.bottom,
      left: zoneRect.left - containerRect.left,
      right: containerRect.right - zoneRect.right,
    },
    animate: false,
  });
}

/** Reads the zone rectangle's current on-screen position back into geographic bounds. */
export function getZoneBounds(map: maplibregl.Map, containerEl: HTMLElement, zoneEl: HTMLElement): LocalisationZone {
  const containerRect = containerEl.getBoundingClientRect();
  const zoneRect = zoneEl.getBoundingClientRect();
  const topLeft = map.unproject([zoneRect.left - containerRect.left, zoneRect.top - containerRect.top]);
  const bottomRight = map.unproject([zoneRect.right - containerRect.left, zoneRect.bottom - containerRect.top]);
  return { sw: [topLeft.lng, bottomRight.lat], ne: [bottomRight.lng, topLeft.lat] };
}

export type LocalisationMapHandle = {
  map: maplibregl.Map;
  containerEl: HTMLElement;
  zoneEl: HTMLElement;
};

type Props = {
  center: [number, number];
  initialZone: LocalisationZone | null;
  onReady: (handle: LocalisationMapHandle) => void;
  onClose: () => void;
  onCancel: () => void;
  onValidate: () => void;
  isDirty: boolean;
  isSaving: boolean;
  pins: LocalisationPin[];
  setPins: (updater: (prev: LocalisationPin[]) => LocalisationPin[]) => void;
  drawings: LocalisationLine[];
  setDrawings: (updater: (prev: LocalisationLine[]) => LocalisationLine[]) => void;
  markDirty: () => void;
};

export const LocalisationMap = ({
  center,
  initialZone,
  onReady,
  onClose,
  onCancel,
  onValidate,
  isDirty,
  isSaving,
  pins,
  setPins,
  drawings,
  setDrawings,
  markDirty,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const pinsRef = useRef(pins);
  const drawingsRef = useRef(drawings);
  const initializedRef = useRef(false);
  const pinToDeleteRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const [mode, setMode] = useState<Mode>("move");
  const [background, setBackground] = useState<Background>("satellite");
  const [isLayerPopoverOpen, setIsLayerPopoverOpen] = useState(false);
  const [isColorPopoverOpen, setIsColorPopoverOpen] = useState(false);
  const layerButtonRef = useRef<HTMLButtonElement>(null);
  const paletteButtonRef = useRef<HTMLButtonElement>(null);
  const [activeColor, setActiveColor] = useState(drawingColors[0]);
  const [activeWidthIdx, setActiveWidthIdx] = useState(0);
  const [pinToDelete, setPinToDelete] = useState<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    pinsRef.current = pins;
  }, [pins]);
  useEffect(() => {
    drawingsRef.current = drawings;
  }, [drawings]);
  useEffect(() => {
    pinToDeleteRef.current = pinToDelete;
  }, [pinToDelete]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: SATELLITE_STYLE,
      center,
      zoom: 18,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    mapRef.current = map;

    map.on("style.load", () => addLocalisationLayers(map, pinsRef.current, drawingsRef.current, pinToDeleteRef.current?.id));

    map.once("idle", () => {
      if (initialZone && containerRef.current && zoneRef.current) {
        fitZoneBounds(map, containerRef.current, zoneRef.current, initialZone);
      }
      // Defer so the fitBounds/flyTo above doesn't itself mark the session dirty.
      requestAnimationFrame(() => {
        initializedRef.current = true;
      });
      if (containerRef.current && zoneRef.current) {
        onReady({ map, containerEl: containerRef.current, zoneEl: zoneRef.current });
      }
    });

    const onMoveEnd = () => {
      if (initializedRef.current) markDirty();
    };
    map.on("moveend", onMoveEnd);

    return () => {
      map.off("moveend", onMoveEnd);
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
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(PINS_SOURCE_ID) as GeoJSONSource | undefined;
    if (source) source.setData(pinsToGeoJSON(pins, pinToDelete?.id));
  }, [pins, pinToDelete?.id]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(DRAWINGS_SOURCE_ID) as GeoJSONSource | undefined;
    if (source) source.setData(drawingsToGeoJSON(drawings));
  }, [drawings]);

  // Pin tool: click to place a numbered pin, or click an existing pin to remove it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mode !== "pin") return;
    map.getCanvas().style.cursor = "crosshair";

    const onClick = (e: maplibregl.MapMouseEvent) => {
      const hit = map.queryRenderedFeatures(e.point, { layers: [PIN_CIRCLE_LAYER_ID] });
      if (hit.length) {
        const clickedNumber = hit[0].properties?.number as number;
        const coords = (hit[0].geometry as GeoJSON.Point).coordinates as [number, number];
        const projected = map.project(coords);
        const containerRect = map.getContainer().getBoundingClientRect();
        setPinToDelete({
          id: clickedNumber,
          x: containerRect.left + projected.x,
          y: containerRect.top + projected.y - PIN_RADIUS_SELECTED - DELETE_POPOVER_GAP,
        });
        return;
      }
      setPinToDelete(null);
      markDirty();
      setPins((prev) => [...prev, { id: prev.length + 1, lng: e.lngLat.lng, lat: e.lngLat.lat }]);
    };

    const onMove = () => setPinToDelete(null);

    map.on("click", onClick);
    map.on("move", onMove);
    return () => {
      map.off("click", onClick);
      map.off("move", onMove);
      map.getCanvas().style.cursor = "";
      setPinToDelete(null);
    };
  }, [mode, markDirty, setPins]);

  const handleConfirmDeletePin = () => {
    if (!pinToDelete) return;
    setPins((prev) => prev.filter((p) => p.id !== pinToDelete.id).map((p, i) => ({ ...p, id: i + 1 })));
    setPinToDelete(null);
    markDirty();
  };

  // Draw tool: freehand strokes stored as real lng/lat, so they stay put under the pins.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mode !== "draw") return;

    map.dragPan.disable();
    map.doubleClickZoom.disable();
    map.getCanvas().style.cursor = "crosshair";

    let isDrawing = false;
    let current: LocalisationLine | null = null;
    const width = WIDTH_OPTIONS[activeWidthIdx];

    const start = (e: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
      isDrawing = true;
      current = { points: [{ lng: e.lngLat.lng, lat: e.lngLat.lat }], color: activeColor, width };
      setDrawings((prev) => [...prev, current!]);
      markDirty();
    };
    const extend = (e: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
      if (!isDrawing || !current) return;
      current = { ...current, points: [...current.points, { lng: e.lngLat.lng, lat: e.lngLat.lat }] };
      const line = current;
      setDrawings((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = line;
        return updated;
      });
    };
    const end = () => {
      isDrawing = false;
      current = null;
    };

    map.on("mousedown", start);
    map.on("mousemove", extend);
    map.on("mouseup", end);
    map.on("touchstart", start);
    map.on("touchmove", extend);
    map.on("touchend", end);

    return () => {
      map.off("mousedown", start);
      map.off("mousemove", extend);
      map.off("mouseup", end);
      map.off("touchstart", start);
      map.off("touchmove", extend);
      map.off("touchend", end);
      map.dragPan.enable();
      map.doubleClickZoom.enable();
      map.getCanvas().style.cursor = "";
    };
  }, [mode, activeColor, activeWidthIdx, markDirty, setDrawings]);

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
      sx={{ ".maplibregl-ctrl-attrib": { display: "none" } }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Fixed export zone rectangle: the user pans/zooms the map underneath it */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width="min(70%, 93vh)"
        sx={{ transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 1 }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            mb: "8px",
            px: "12px",
            py: "6px",
            bgcolor: "rgba(255,255,255,0.9)",
            borderRadius: "4px",
            color: BLUE_FRANCE,
            fontSize: "14px",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Déplacez la carte dans la zone d'export
        </Box>
        <Box
          ref={zoneRef}
          sx={{
            aspectRatio: "4 / 3",
            border: "2px solid",
            borderColor: BLUE_FRANCE,
            boxShadow: "0 0 0 1px #ffffff, inset 0 0 0 1px #ffffff",
          }}
        />
      </Box>

      <Popover
        open={!!pinToDelete}
        onClose={() => setPinToDelete(null)}
        anchorReference="anchorPosition"
        anchorPosition={pinToDelete ? { top: pinToDelete.y, left: pinToDelete.x } : undefined}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 1500 }}
      >
        <CanvasButton onClick={handleConfirmDeletePin} title="Supprimer ce point" iconId="ri-delete-bin-fill" />
      </Popover>

      <Box position="absolute" top={8} right={8} zIndex={2} display="flex" flexDirection="row">
        {isDirty ? (
          <CanvasButton onClick={onValidate} title="Valider les modifications" iconId="ri-check-line">
            {isSaving ? "Enregistrement…" : "Valider"}
          </CanvasButton>
        ) : (
          <CanvasButton onClick={onClose} title="Fermer" iconId="ri-close-line">
            Fermer
          </CanvasButton>
        )}
      </Box>

      {isDirty ? (
        <Box position="absolute" top={8} left={8} zIndex={2}>
          <CanvasButton onClick={onCancel} title="Annuler les modifications" iconId="ri-arrow-go-back-line">
            Annuler
          </CanvasButton>
        </Box>
      ) : null}

      <Box ref={layerButtonRef} position="absolute" top={56} right={8} zIndex={2}>
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
          <Box component="span" fontWeight="bold" display="block" mb={1}>
            Fond de carte
          </Box>
          <RadioButtons
            name="background"
            options={[
              {
                label: "Satellite",
                nativeInputProps: { checked: background === "satellite", onChange: () => setBackground("satellite") },
              },
              {
                label: "Vectoriel",
                nativeInputProps: { checked: background === "vector", onChange: () => setBackground("vector") },
              },
            ]}
            style={{ marginBottom: 0 }}
          />
        </Box>
      </Popover>

      <Box position="absolute" bottom={8} left={8} zIndex={2} display="flex" flexDirection="column" gap="8px">
        {mode === "draw" ? (
          <Box display="flex" flexDirection="row" gap={0}>
            {WIDTH_OPTIONS.map((w, idx) => {
              const isActive = activeWidthIdx === idx;
              return (
                <Box
                  key={w}
                  component="button"
                  type="button"
                  onClick={() => setActiveWidthIdx(idx)}
                  title={idx === 0 ? "Trait fin" : "Trait épais"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    padding: 0,
                    cursor: "pointer",
                    flexShrink: 0,
                    bgcolor: isActive ? "#EAEAEA" : "white",
                    border: "1px solid",
                    borderColor: BLUE_FRANCE,
                    borderRadius: 0,
                    marginLeft: "-1px",
                  }}
                >
                  <Box sx={{ width: w * 2, height: w * 2, borderRadius: "50%", bgcolor: BLUE_FRANCE }} />
                </Box>
              );
            })}
            <Box ref={paletteButtonRef} position="relative">
              <Box
                sx={{
                  bgcolor: activeColor,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  position: "absolute",
                  zIndex: 1,
                  left: 24,
                  top: 6,
                  border: "1px solid white",
                }}
              />
              <CanvasButton
                onClick={() => setIsColorPopoverOpen((open) => !open)}
                title="Changer la couleur du trait"
                iconId="fr-icon-palette-fill"
                isSelected={isColorPopoverOpen}
              />
            </Box>
          </Box>
        ) : null}

        <Popover
          open={isColorPopoverOpen}
          anchorEl={paletteButtonRef.current}
          onClose={() => setIsColorPopoverOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          sx={{ zIndex: 1500 }}
        >
          <Box p={1}>
            <ColorSelection
              activeColor={activeColor}
              setActiveColor={(c) => {
                setActiveColor(c);
                setIsColorPopoverOpen(false);
              }}
            />
          </Box>
        </Popover>

        <Box display="flex" flexDirection="row" gap={0}>
          <CanvasButton
            onClick={() => setMode("pin")}
            title="Placer un point"
            iconId="ri-map-pin-add-line"
            isSelected={mode === "pin"}
          />
          <CanvasButton onClick={() => setMode("draw")} title="Dessiner" iconId="ri-pencil-line" isSelected={mode === "draw"} />
          <CanvasButton
            onClick={() => setMode("move")}
            title="Déplacer la carte"
            iconId="ri-drag-move-2-line"
            isSelected={mode === "move"}
          />
        </Box>
      </Box>

      <Box position="absolute" bottom={8} right={8} zIndex={2} display="flex" flexDirection="column">
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
