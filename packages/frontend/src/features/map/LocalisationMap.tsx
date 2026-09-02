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
  pinIconId,
  pinsToGeoJSON,
} from "./localisationTypes";

type Background = "vector" | "satellite";
type Mode = "move" | "pin" | "draw";

const PINS_SOURCE_ID = "localisation-pins";
const PIN_SYMBOL_LAYER_ID = "localisation-pins-symbol";
const DRAWINGS_SOURCE_ID = "localisation-drawings";
const DRAWINGS_LINE_LAYER_ID = "localisation-drawings-line";

const BLUE_FRANCE = "#000091";
const LINE_WIDTH = 3;
const PIN_DEFAULT_SIZE = 40;
const PIN_SELECTED_SIZE = 52;
const DELETE_POPOVER_GAP = 12;

// Traced from the "map-pin-2" DSFR/RemixIcon glyph (24x24 viewBox) so the in-map markers match it.
const PIN_SHAPE_PATH = "M18.364 3.636a9 9 0 0 1 0 12.728L12 22.728l-6.364-6.364A9 9 0 0 1 18.364 3.636Z";
const PIN_LABEL_CENTER = { x: 12, y: 10 };
const PIN_LABEL_RADIUS = 6;

/** Rasterizes a numbered "map-pin-2"-shaped marker for the given pin/selection state. */
function createPinImage(number: number, selected: boolean, pixelRatio: number) {
  const size = selected ? PIN_SELECTED_SIZE : PIN_DEFAULT_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;
  const ctx = canvas.getContext("2d")!;
  ctx.scale((size / 24) * pixelRatio, (size / 24) * pixelRatio);

  const pinShape = new Path2D(PIN_SHAPE_PATH);
  ctx.fillStyle = BLUE_FRANCE;
  ctx.fill(pinShape);
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke(pinShape);

  ctx.beginPath();
  ctx.arc(PIN_LABEL_CENTER.x, PIN_LABEL_CENTER.y, PIN_LABEL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.fillStyle = BLUE_FRANCE;
  ctx.font = `bold ${PIN_LABEL_RADIUS * 1.3}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(number), PIN_LABEL_CENTER.x, PIN_LABEL_CENTER.y + 0.3);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/** Registers (once) the default/selected marker images for every current pin. */
function ensurePinImages(map: maplibregl.Map, pins: LocalisationPin[]) {
  const pixelRatio = Math.ceil(window.devicePixelRatio || 1);
  for (const pin of pins) {
    for (const selected of [false, true]) {
      const id = pinIconId(pin.id, selected);
      if (!map.hasImage(id)) {
        map.addImage(id, createPinImage(pin.id, selected, pixelRatio), { pixelRatio });
      }
    }
  }
}

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
    ensurePinImages(map, pins);
    map.addSource(PINS_SOURCE_ID, { type: "geojson", data: pinsToGeoJSON(pins, selectedPinId) });
    map.addLayer({
      id: PIN_SYMBOL_LAYER_ID,
      type: "symbol",
      source: PINS_SOURCE_ID,
      layout: {
        "icon-image": ["get", "iconId"],
        "icon-anchor": "bottom",
        "icon-allow-overlap": true,
      },
    });
  }
}

/** Fits the map so the fixed on-screen zone rectangle frames the given geographic bounds. */
export function fitZoneBounds(
  map: maplibregl.Map,
  containerEl: HTMLElement,
  zoneEl: HTMLElement,
  zone: LocalisationZone,
) {
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

    map.on("style.load", () =>
      addLocalisationLayers(map, pinsRef.current, drawingsRef.current, pinToDeleteRef.current?.id),
    );

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
    ensurePinImages(map, pins);
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
      const hit = map.queryRenderedFeatures(e.point, { layers: [PIN_SYMBOL_LAYER_ID] });
      if (hit.length) {
        const clickedNumber = hit[0].properties?.number as number;
        const coords = (hit[0].geometry as GeoJSON.Point).coordinates as [number, number];
        const projected = map.project(coords);
        const containerRect = map.getContainer().getBoundingClientRect();
        setPinToDelete({
          id: clickedNumber,
          x: containerRect.left + projected.x,
          y: containerRect.top + projected.y - PIN_SELECTED_SIZE - DELETE_POPOVER_GAP,
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

    const start = (e: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
      isDrawing = true;
      current = { points: [{ lng: e.lngLat.lng, lat: e.lngLat.lat }], color: activeColor, width: LINE_WIDTH };
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
  }, [mode, activeColor, markDirty, setDrawings]);

  const handleZoom = (direction: "in" | "out") => {
    const map = mapRef.current;
    if (!map) return;
    direction === "in" ? map.zoomIn() : map.zoomOut();
  };

  return (
    <Box position="relative" width="100%" height="100%" sx={{ ".maplibregl-ctrl-attrib": { display: "none" } }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Fixed export zone rectangle: the user pans/zooms the map underneath it */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={{ xs: "calc(100% - 32px) !important", sm: "min(70%, 93vh) !important" }}
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
          <CanvasButton onClick={onValidate} title="Valider les modifications" iconId="ri-check-fill">
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
          <CanvasButton onClick={onCancel} title="Annuler les modifications" iconId="ri-arrow-go-back-fill">
            Annuler
          </CanvasButton>
        </Box>
      ) : null}

      <Box ref={layerButtonRef} position="absolute" top={56} right={8} zIndex={2}>
        <CanvasButton
          onClick={() => setIsLayerPopoverOpen(true)}
          title="Choisir le fond de carte"
          iconId="ri-stack-fill"
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

        <Box display="flex" flexDirection="row" alignItems="center" gap={0}>
          <CanvasButton
            onClick={() => setMode("move")}
            title="Déplacer la carte"
            iconId="ri-drag-move-2-fill"
            isSelected={mode === "move"}
          />
          <CanvasButton
            onClick={() => setMode("pin")}
            title="Placer un point"
            iconId="ri-map-pin-add-line"
            isSelected={mode === "pin"}
            sx={{ marginLeft: "-1px" }}
          />
          <CanvasButton
            onClick={() => setMode("draw")}
            title="Dessiner"
            iconId="ri-pencil-fill"
            isSelected={mode === "draw"}
            sx={{ marginLeft: "-1px" }}
          />
          {mode === "draw" ? (
            <Box ref={paletteButtonRef} position="relative" sx={{ marginLeft: "12px" }}>
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
          ) : null}
        </Box>
      </Box>

      <Box position="absolute" bottom={8} right={8} zIndex={2} display="flex" flexDirection="column">
        {(["in", "out"] as const).map((dir) => (
          <CanvasButton
            key={dir}
            onClick={() => handleZoom(dir)}
            title={dir === "in" ? "Zoom avant" : "Zoom arrière"}
            iconId={dir === "in" ? "ri-zoom-in-line" : "ri-zoom-out-line"}
            sx={dir === "out" ? { marginTop: "-1px" } : undefined}
          />
        ))}
      </Box>
    </Box>
  );
};
