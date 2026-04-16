import { fr } from "@codegouvfr/react-dsfr";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { MinimalAttachment } from "./UploadImage";
import { Stage, Layer, Image as KonvaImage, Line as KonvaLine } from "react-konva";
import type { Line } from "./types";
import type Konva from "konva";
import { useMutation } from "@tanstack/react-query";

export type { Line };

const colors = ["#000AFF", "#FF3F3F", "#FF8A00", "#FFD600", "#3DFF7F", "white", "black"];
const blackPenColors = ["#FFD600", "#3DFF7F", "white"];

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export const ImageCanvas = ({
  url,
  attachment,
  lines: dbLines,
  onSave,
  onReplaceAttachment,
  closeModal,
  hideLabelInput,
}: {
  attachment: MinimalAttachment;
  url: string;
  lines: Array<Line>;
  onSave?: (props: MinimalAttachment & { url: string }) => void;
  /** When provided, the canvas will generate a composite image on save, create a
   *  new attachment locally (with local_uri set immediately), and deprecate the old one. */
  onReplaceAttachment?: (oldId: string, data: ArrayBuffer) => Promise<string>;
  closeModal: () => void;
  hideLabelInput?: boolean;
}) => {
  const { id: pictureId } = attachment;
  const [internalLabel, setInternalLabel] = useState<string>(attachment.label ?? "");

  const [lines, setLines] = useState<Line[]>(() => dbLines ?? []);
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [tool, setTool] = useState<"draw" | "pan">("draw");
  const [activeWidthIdx, setActiveWidthIdx] = useState(1);
  const [isColorSelectionOpen, setIsColorSelectionOpen] = useState(false);

  // Layer transform state
  const [layerScale, setLayerScale] = useState(1);
  const [layerOffset, setLayerOffset] = useState({ x: 0, y: 0 });

  // Stage dimensions
  const [stageSize, setStageSize] = useState({ width: 600, height: 500 });

  // Loaded image
  const [konvaImage, setKonvaImage] = useState<HTMLImageElement | null>(null);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

  // Width options in image-space pixels (proportional to image, so consistent at any zoom/resolution)
  const widthOptions = useMemo(() => {
    const base = imageNaturalSize.width > 0 ? imageNaturalSize.width : 1920;
    return [base / 300, base / 120, base / 48]; // thin, medium, thick
  }, [imageNaturalSize.width]);

  // Drawing state
  const isDrawingRef = useRef(false);
  const currentLineRef = useRef<Line | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Pan state
  const panStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  // Pinch state
  const lastDistRef = useRef<number | null>(null);
  const lastMidRef = useRef<{ x: number; y: number } | null>(null);

  // Sync lines from DB only on first non-empty load (avoids resetting drawn lines on parent re-render)
  const dbLinesSyncedRef = useRef(false);
  useEffect(() => {
    if (!dbLinesSyncedRef.current && dbLines && dbLines.length > 0) {
      dbLinesSyncedRef.current = true;
      setLines(dbLines);
    }
  }, [dbLines]);

  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Measure the canvas area div (not the full modal container)
  useEffect(() => {
    const measure = () => {
      const rect = canvasAreaRef.current?.getBoundingClientRect();
      if (rect) setStageSize({ width: rect.width, height: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (canvasAreaRef.current) observer.observe(canvasAreaRef.current);
    return () => observer.disconnect();
  }, []);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setKonvaImage(img);
      setImageNaturalSize({ width: img.width, height: img.height });
    };
  }, [url]);

  // Fit image to stage on load
  useEffect(() => {
    if (!konvaImage || stageSize.width === 0) return;
    const scaleX = stageSize.width / konvaImage.width;
    const scaleY = stageSize.height / konvaImage.height;
    const fitScale = Math.min(scaleX, scaleY);
    const offX = (stageSize.width - konvaImage.width * fitScale) / 2;
    const offY = (stageSize.height - konvaImage.height * fitScale) / 2;
    setLayerScale(fitScale);
    setLayerOffset({ x: offX, y: offY });
  }, [konvaImage, stageSize]);

  const clampOffset = useCallback(
    (offset: { x: number; y: number }, scale: number) => {
      const margin = 80;
      const imgW = imageNaturalSize.width * scale;
      const imgH = imageNaturalSize.height * scale;
      return {
        x: clamp(offset.x, margin - imgW, stageSize.width - margin),
        y: clamp(offset.y, margin - imgH, stageSize.height - margin),
      };
    },
    [imageNaturalSize, stageSize],
  );

  const stageToImage = useCallback(
    (stagePos: { x: number; y: number }) => ({
      x: (stagePos.x - layerOffset.x) / layerScale,
      y: (stagePos.y - layerOffset.y) / layerScale,
    }),
    [layerOffset, layerScale],
  );

  const isWithinBounds = useCallback(
    (imagePos: { x: number; y: number }) =>
      imagePos.x >= 0 &&
      imagePos.x <= imageNaturalSize.width &&
      imagePos.y >= 0 &&
      imagePos.y <= imageNaturalSize.height,
    [imageNaturalSize],
  );

  const getStagePos = () => {
    const stage = stageRef.current;
    if (!stage) return null;
    return stage.getPointerPosition();
  };

  const handleMouseDown = (_e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = getStagePos();
    if (!pos) return;
    if (tool === "pan") {
      panStartRef.current = { x: pos.x, y: pos.y, offsetX: layerOffset.x, offsetY: layerOffset.y };
      return;
    }
    const imgPos = stageToImage(pos);
    if (!isWithinBounds(imgPos)) return;
    isDrawingRef.current = true;
    currentLineRef.current = { points: [imgPos], color: activeColor, width: widthOptions[activeWidthIdx] };
    setLines((prev) => [...prev, currentLineRef.current!]);
  };

  const handleMouseMove = (_e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "pan") {
      if (!panStartRef.current) return;
      const pos = getStagePos();
      if (!pos) return;
      setLayerOffset(
        clampOffset(
          {
            x: panStartRef.current.offsetX + (pos.x - panStartRef.current.x),
            y: panStartRef.current.offsetY + (pos.y - panStartRef.current.y),
          },
          layerScale,
        ),
      );
      return;
    }
    if (!isDrawingRef.current) return;
    const pos = getStagePos();
    if (!pos) return;
    const imgPos = stageToImage(pos);
    if (!isWithinBounds(imgPos)) return;
    if (!currentLineRef.current) return;
    currentLineRef.current = { ...currentLineRef.current, points: [...currentLineRef.current.points, imgPos] };
    const line = currentLineRef.current;
    setLines((prev) => {
      const updated = prev.length === 0 ? [line] : [...prev];
      updated[updated.length - 1] = line;
      return updated;
    });
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    currentLineRef.current = null;
    panStartRef.current = null;
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const newScale = e.evt.deltaY < 0 ? layerScale * scaleBy : layerScale / scaleBy;
    const clamped = clamp(newScale, 0.1, 20);
    setLayerOffset(
      clampOffset(
        {
          x: pointer.x - (pointer.x - layerOffset.x) * (clamped / layerScale),
          y: pointer.y - (pointer.y - layerOffset.y) * (clamped / layerScale),
        },
        clamped,
      ),
    );
    setLayerScale(clamped);
  };

  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const touches = e.evt.touches;
    if (touches.length === 2) {
      isDrawingRef.current = false;
      lastDistRef.current = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
      );
      lastMidRef.current = {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
      return;
    }
    if (touches.length === 1) {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.container().getBoundingClientRect();
      const pos = { x: touches[0].clientX - rect.left, y: touches[0].clientY - rect.top };
      if (tool === "pan") {
        panStartRef.current = { x: pos.x, y: pos.y, offsetX: layerOffset.x, offsetY: layerOffset.y };
        return;
      }
      const imgPos = stageToImage(pos);
      if (!isWithinBounds(imgPos)) return;
      isDrawingRef.current = true;
      currentLineRef.current = { points: [imgPos], color: activeColor, width: widthOptions[activeWidthIdx] };
      setLines((prev) => [...prev, currentLineRef.current!]);
    }
  };

  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touches = e.evt.touches;

    if (touches.length === 2) {
      const newDist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      const newMid = {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
      const stage = stageRef.current;
      if (!stage || !lastDistRef.current || !lastMidRef.current) return;
      const rect = stage.container().getBoundingClientRect();
      const stagePos = { x: newMid.x - rect.left, y: newMid.y - rect.top };
      const scaleFactor = newDist / lastDistRef.current;
      const newScale = clamp(layerScale * scaleFactor, 0.1, 20);
      setLayerOffset(
        clampOffset(
          {
            x: stagePos.x - (stagePos.x - layerOffset.x) * (newScale / layerScale),
            y: stagePos.y - (stagePos.y - layerOffset.y) * (newScale / layerScale),
          },
          newScale,
        ),
      );
      setLayerScale(newScale);
      lastDistRef.current = newDist;
      lastMidRef.current = newMid;
      return;
    }

    if (touches.length === 1) {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.container().getBoundingClientRect();
      const pos = { x: touches[0].clientX - rect.left, y: touches[0].clientY - rect.top };
      if (tool === "pan") {
        if (!panStartRef.current) return;
        setLayerOffset(
          clampOffset(
            {
              x: panStartRef.current.offsetX + (pos.x - panStartRef.current.x),
              y: panStartRef.current.offsetY + (pos.y - panStartRef.current.y),
            },
            layerScale,
          ),
        );
        return;
      }
      if (!isDrawingRef.current) return;
      const imgPos = stageToImage(pos);
      if (!isWithinBounds(imgPos)) return;
      if (!currentLineRef.current) return;
      currentLineRef.current = { ...currentLineRef.current, points: [...currentLineRef.current.points, imgPos] };
      const line = currentLineRef.current;
      setLines((prev) => {
        const updated = prev.length === 0 ? [line] : [...prev];
        updated[updated.length - 1] = line;
        return updated;
      });
    }
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    currentLineRef.current = null;
    panStartRef.current = null;
    lastDistRef.current = null;
    lastMidRef.current = null;
  };

  const handleZoom = (direction: "in" | "out") => {
    const scaleBy = 1.2;
    const newScale = direction === "in" ? layerScale * scaleBy : layerScale / scaleBy;
    const clamped = clamp(newScale, 0.1, 20);
    const center = { x: stageSize.width / 2, y: stageSize.height / 2 };
    setLayerOffset(
      clampOffset(
        {
          x: center.x - (center.x - layerOffset.x) * (clamped / layerScale),
          y: center.y - (center.y - layerOffset.y) * (clamped / layerScale),
        },
        clamped,
      ),
    );
    setLayerScale(clamped);
  };

  const handleUndo = () => setLines((prev) => prev.slice(0, -1));

  const saveMutation = useMutation({
    mutationFn: async () => {
      let savedId = pictureId;
      if (onReplaceAttachment && konvaImage && imageNaturalSize.width > 0 && lines.length > 0) {
        // Draw onto an offscreen canvas at the image's natural size, ignoring zoom/pan
        const offscreen = document.createElement("canvas");
        offscreen.width = imageNaturalSize.width;
        offscreen.height = imageNaturalSize.height;
        const ctx = offscreen.getContext("2d")!;
        ctx.drawImage(konvaImage, 0, 0);
        for (const line of lines) {
          if (line.points.length < 1) continue;
          ctx.beginPath();
          ctx.strokeStyle = line.color;
          ctx.lineWidth = line.width ?? widthOptions[1];
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.moveTo(line.points[0].x, line.points[0].y);
          for (let i = 1; i < line.points.length; i++) {
            ctx.lineTo(line.points[i].x, line.points[i].y);
          }
          ctx.stroke();
        }
        const blob = await new Promise<Blob>((resolve) => offscreen.toBlob((b) => resolve(b!), "image/jpeg", 0.9));
        const buffer = await blob.arrayBuffer();
        savedId = await onReplaceAttachment(pictureId, buffer);
      }
      onSave?.({ ...attachment, id: savedId, label: internalLabel, url });
      closeModal();
    },
  });

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%" sx={{ minHeight: 0 }}>
      {/* Canvas area */}
      <Box
        ref={canvasAreaRef}
        flex="1"
        minHeight={0}
        overflow="hidden"
        position="relative"
        sx={{ cursor: tool === "pan" ? (panStartRef.current ? "grabbing" : "grab") : "crosshair" }}
      >
        {/* Toolbar overlay */}
        <Flex
          sx={{
            position: "absolute",
            top: 12,
            right: 0,
            left: 0,
            zIndex: 10,
            "button:empty::before": {
              marginRight: "0 !important",
              marginLeft: "0 !important",
            },
          }}
          px="16px"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex alignItems="center" justifyContent="flex-start" flexShrink={0} gap={{ xs: "8px", lg: "16px" }}>
            <Button
              sx={{ bgcolor: "white !important", "&::before": { mr: "10px !important" } }}
              type="button"
              priority="secondary"
              onClick={handleUndo}
              iconId="ri-arrow-go-back-line"
              disabled={lines.length === 0}
              title="Annuler le dernier trait"
            >
              Annuler
            </Button>
            <Box sx={{ display: { xs: "none", lg: "flex" } }}>
              <Tools tool={tool} setTool={setTool} />
            </Box>
            <Flex sx={{ "& > button": { marginLeft: "-1px !important" } }}>
              {[0, 1].map((idx) => {
                const dotSize = [10, 16][idx];
                const isActive = activeWidthIdx === idx && tool === "draw";
                return (
                  <Box
                    key={idx}
                    component="button"
                    type="button"
                    onClick={() => {
                      setTool("draw");
                      setActiveWidthIdx(idx);
                    }}
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
                      borderColor: isActive ? "#000091" : "#3a3a3a",
                      borderRadius: 0,
                      position: "relative",
                      zIndex: isActive ? 1 : 0,
                      "&:hover": {
                        bgcolor: isActive ? "#000091" : "#f0f0f0",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: "50%",
                        bgcolor: "#000091",
                      }}
                    />
                  </Box>
                );
              })}
            </Flex>

            <Flex sx={{ "& > button": { marginLeft: "-1px !important" } }}>
              <Box position="relative">
                <Box
                  sx={{
                    bgcolor: activeColor,
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    position: "absolute",
                    zIndex: "1",
                    left: "24px",
                    top: "24px",
                  }}
                />
                <Button
                  type="button"
                  priority={"secondary"}
                  iconId="fr-icon-palette-fill"
                  title="Changer la couleur du trait"
                  onClick={() => setIsColorSelectionOpen((open) => !open)}
                  sx={{
                    zIndex: "0",
                    bgcolor: isColorSelectionOpen ? "#EAEAEA !important" : "white !important",
                  }}
                />
              </Box>
              {isColorSelectionOpen && (
                <Box
                  zIndex="11"
                  position="absolute"
                  top="50px"
                  sx={{
                    transform: "translateX(calc(-50% + 20px))",
                  }}
                >
                  <ColorSelection
                    activeColor={activeColor}
                    setActiveColor={(c) => {
                      setActiveColor(c);
                      setIsColorSelectionOpen(false);
                      setTool("draw");
                    }}
                  />
                </Box>
              )}
            </Flex>
          </Flex>
          <Box justifySelf="flex-end" alignItems="flex-end">
            <Button
              sx={{ bgcolor: "white !important" }}
              type="button"
              priority="secondary"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              iconId="ri-check-line"
            >
              Valider
            </Button>
          </Box>
        </Flex>

        {/* Zoom buttons overlay */}
        <Flex
          sx={{
            position: "absolute",
            bottom: 12,
            right: 0,
            left: 0,
            zIndex: 10,
          }}
          px="16px"
          justifyContent="space-between"
        >
          <Flex>
            <Box display={{ xs: "flex", lg: "none" }}>
              <Tools tool={tool} setTool={setTool} />
            </Box>
          </Flex>
          <Flex
            sx={{
              "& > button": { marginLeft: "-1px !important" },
            }}
          >
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
                  flexShrink: 0,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: fr.colors.decisions.background.active.blueFrance.default,
                  color: fr.colors.decisions.background.active.blueFrance.default,
                  borderRadius: 0,
                  position: "relative",
                  zIndex: 0,
                  fontSize: "1.1rem",
                }}
              >
                <Box component="span" className={fr.cx(dir === "in" ? "ri-zoom-in-line" : "ri-zoom-out-line")} />
              </Box>
            ))}
          </Flex>
        </Flex>
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "none" }}
        >
          <Layer x={layerOffset.x} y={layerOffset.y} scaleX={layerScale} scaleY={layerScale}>
            {konvaImage && <KonvaImage image={konvaImage} />}
            {lines.map((line, i) => (
              <KonvaLine
                key={i}
                points={line.points.flatMap((p) => [p.x, p.y])}
                stroke={line.color}
                strokeWidth={line.width ?? widthOptions[1]}
                lineCap="round"
                lineJoin="round"
                tension={0.3}
              />
            ))}
          </Layer>
        </Stage>
      </Box>

      {/* Legend + color swatches */}
      <Flex justifyContent="center" alignItems="center" flexDirection="column" flexShrink={0} bgcolor="white">
        {hideLabelInput ? null : (
          <Flex px="16px" width="100%" pt="8px" mb={{ xs: "16px", lg: "32px" }}>
            <Input
              sx={{ width: "100%" }}
              label="Légende"
              nativeInputProps={{
                value: internalLabel,
                onChange: (e) => setInternalLabel(e.target.value),
              }}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

const ColorSelection = ({
  activeColor,
  setActiveColor,
}: {
  activeColor: string;
  setActiveColor: (color: string) => void;
}) => {
  return (
    <Stack gap="8px" flexDirection="row" justifyContent="center" alignItems="center">
      {colors.map((color) => {
        const isActive = activeColor === color;
        const size = isActive ? 30 : 20;
        return (
          <Box
            key={color}
            component="button"
            type="button"
            onClick={() => setActiveColor(color)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
              padding: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                width: size,
                height: size,
                bgcolor: color,
                border: "1px solid #000091",
                transition: "width 0.1s, height 0.1s",
              }}
            >
              {isActive && (
                <Box
                  className={fr.cx("fr-icon--sm", "ri-pencil-line")}
                  component="i"
                  color={blackPenColors.includes(color) ? "black" : "white"}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};

const Tools = ({ tool, setTool }: { tool: "draw" | "pan"; setTool: (tool: "draw" | "pan") => void }) => {
  return (
    <Flex sx={{ "& > button": { marginLeft: "-1px !important" } }}>
      <Button
        type="button"
        priority={"secondary"}
        style={{}}
        iconId="ri-pencil-line"
        title="Dessiner"
        onClick={() => setTool("draw")}
        sx={tool === "draw" ? { bgcolor: "#EAEAEA !important" } : { bgcolor: "white !important" }}
      ></Button>
      <Button
        type="button"
        priority={"secondary"}
        iconId="ri-drag-move-2-fill"
        title="Déplacer"
        onClick={() => setTool("pan")}
        sx={{
          ...(tool === "pan" ? { bgcolor: "#EAEAEA !important" } : { bgcolor: "white !important" }),
          "&::before": { fontSize: "1.5rem !important" },
        }}
      ></Button>
    </Flex>
  );
};
