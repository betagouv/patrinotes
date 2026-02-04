import { fr } from "@codegouvfr/react-dsfr";
import React, { useState, useRef, useEffect } from "react";
import { v4, v7 } from "uuid";
import { db } from "../../db/db";
import { Box, Stack } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { useUser } from "../../contexts/AuthContext";
import { MinimalAttachment } from "./UploadImage";

type DrawEvent = React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>;
export type Line = { points: Array<{ x: number; y: number }>; color: string };
export const ImageCanvas = ({
  url,
  attachment,
  lines: dbLines,
  containerRef,
  imageTable,
  onSave,
  closeModal,
  hideLabelInput,
}: {
  attachment: MinimalAttachment;
  containerRef: any;
  url: string;
  lines: Array<Line>;
  imageTable?: string;
  onSave?: (props: MinimalAttachment & { url: string }) => void;
  closeModal: () => void;
  hideLabelInput?: boolean;
}) => {
  const { id: pictureId } = attachment;
  const [internalLabel, setInternalLabel] = useState<string>(attachment.label ?? "");
  const user = useUser()!;
  const [tool, setTool] = useState("draw");
  const [lines, setLines] = useState<Array<{ points: Array<{ x: number; y: number }>; color: string }>>([]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<"idle" | "drawing" | "hold">("idle");
  const [startPan, setStartPan] = useState<{ x: number; y: number } | null>(null);
  const [activeColor, setActiveColor] = useState(colors[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const isDrawing = state === "drawing" || state === "hold";

  useEffect(() => {
    if (dbLines) {
      setLines(dbLines);
    }
  }, [dbLines]);

  const setColor = (color: string) => {
    contextRef.current!.strokeStyle = color;
    setActiveColor(color);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    const boundingRect = containerRef?.current?.getBoundingClientRect();
    if (!boundingRect) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = boundingRect.width * dpr;
    canvas.height = boundingRect.height * dpr;
    context.scale(dpr, dpr);

    context.strokeStyle = activeColor;

    canvas.style.width = "100%";
    canvas.style.height = "auto";
    contextRef.current = context;

    const image = new Image();
    image.src = url;
    image.onload = () => {
      imageRef.current = image;
      const boundingRect = containerRef?.current?.getBoundingClientRect();

      const scaleX = boundingRect.width / image.width;
      const scaleY = boundingRect.height / image.height;
      const initialScale = Math.min(scaleX, scaleY);

      const xOffset = (boundingRect.width - image.width * initialScale) / 2;
      const yOffset = (boundingRect.height - image.height * initialScale) / 2;

      setScale(initialScale);
      setOffset({ x: xOffset, y: yOffset });
      drawCanvas();
    };
  }, [url]);

  const drawCanvas = () => {
    const ctx = contextRef.current!;
    const canvas = canvasRef.current!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    const width = imageRef.current?.width || 0;
    const height = imageRef.current?.height || 0;

    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, width, height);
    }

    lines.forEach((line) => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 5 / scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      line.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });

    ctx.restore();
  };

  useEffect(() => {
    drawCanvas();
  }, [scale, offset, lines]);

  const isWithinImageBounds = (x: number, y: number) => {
    if (!imageRef.current) return false;

    return x >= 0 && x <= imageRef.current.width && y >= 0 && y <= imageRef.current.height;
  };

  const getMousePos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    console.log({ clientX, clientY });
    const x = ((clientX - rect.left) * (canvas.width / rect.width / dpr) - offset.x) / scale;
    const y = ((clientY - rect.top) * (canvas.height / rect.height / dpr) - offset.y) / scale;

    return { x, y };
  };

  const handleMouseDown = (e: any) => {
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;
    const pos = getMousePos(e);

    if (tool === "draw") {
      if (!isWithinImageBounds(pos.x, pos.y)) {
        return;
      }

      setState("drawing");
      setLines([...lines, { points: [pos], color: activeColor }]);
    } else if (tool === "move") {
      setStartPan({ x: clientX - offset.x, y: clientY - offset.y });
    }
  };

  const handleMouseMove = (e: any) => {
    const pos = getMousePos(e);

    if (isDrawing) {
      if (!isWithinImageBounds(pos.x, pos.y)) {
        setState("hold");
        return;
      }

      setState("drawing");

      const lastLine = [...lines];
      lastLine[lastLine.length - 1].points.push(pos);
      setLines(lastLine);
    } else if (startPan) {
      const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
      const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;

      setOffset({
        x: clientX - startPan.x,
        y: clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setState("idle");
    setStartPan(null);
  };

  const handleWheel = () => {};

  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleTouchStart = (e: any) => {
    handleMouseDown(e);
  };

  const handleTouchMove = (e: any) => {
    handleMouseMove(e);
  };

  const handleTouchEnd = () => {
    // setLastDistance(null);
    handleMouseUp();
  };

  const handleSave = async () => {
    const existingLinesQuery = await db
      .selectFrom("picture_lines")
      .where("attachmentId", "=", pictureId)
      .selectAll()
      .execute();
    const existingLines = existingLinesQuery?.[0];

    if (existingLines) {
      await db
        .updateTable("picture_lines")
        .where("id", "=", existingLines.id)
        .set({ lines: JSON.stringify(lines) })
        .execute();
    } else {
      await db
        .insertInto("picture_lines")
        .values({
          id: v7(),
          attachmentId: pictureId,
          lines: JSON.stringify(lines),

          createdAt: new Date().toISOString(),
          service_id: user.service_id,
          table: imageTable,
        })
        .execute();
    }
    onSave?.({ ...attachment, label: internalLabel, url });
    closeModal();
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%" maxHeight="100vh">
      <Stack position="absolute" top="26px" right={{ xs: "16px" }} gap="18px" flexDirection="row" alignItems="center">
        {/* @ts-ignore */}
        <Button
          sx={{ bgcolor: "white !important" }}
          type="button"
          priority="secondary"
          iconId="ri-arrow-go-back-line"
          onClick={handleUndo}
          disabled={lines.length === 0}
        />
        <Button sx={{ bgcolor: "white !important" }} type="button" priority="secondary" onClick={handleSave}>
          OK
        </Button>
      </Stack>

      <Box flex="1" borderRadius="0.25rem" overflow="hidden">
        <Box
          ref={canvasRef}
          component="canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          sx={{
            touchAction: "none",
            userSelect: "none",
          }}
        />
      </Box>
      <Flex justifyContent="center" alignItems="center" flexDirection="column" mt="16px">
        {hideLabelInput ? null : (
          <Flex px="16px" width="100%">
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
        <Stack gap="14px" flexDirection="row" justifyContent="center" alignItems="center" p="18px">
          {colors.map((color) => (
            <Button
              type="button"
              key={color}
              priority="tertiary no outline"
              onClick={() => setColor(color)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                widht: "40px",
                height: "40px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  width: activeColor === color ? "40px" : "20px",
                  height: activeColor === color ? "40px" : "20px",
                  bgcolor: color,
                  border: color === "white" ? "1px solid black" : "none",
                }}
              >
                <Box
                  className={fr.cx("fr-icon--md", "ri-pencil-line")}
                  component="i"
                  style={{ display: activeColor === color ? "block" : "none" }}
                  color={blackPenColors.includes(color) ? "black" : "white"}
                />
              </Box>
            </Button>
          ))}
        </Stack>
      </Flex>
    </Box>
  );
};

const blackPenColors = ["#FFD600", "#3DFF7F", "white"];
const colors = ["#000AFF", "#FF3F3F", "#FF8A00", "#FFD600", "#3DFF7F", "white", "black"];
