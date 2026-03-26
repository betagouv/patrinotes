import { RefObject, useEffect } from "react";
import { Line } from "../DrawingCanvas";

export function useThumbnailCanvas(
  canvasRef: RefObject<HTMLCanvasElement>,
  bgUrl: string | null,
  lines: Line[],
): void {
  useEffect(() => {
    if (!canvasRef.current || !bgUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const displayWidth = rect.width;
    const displayHeight = rect.height;

    const image = new Image();
    image.src = bgUrl;
    image.onload = () => {
      const scaleX = displayWidth / image.width;
      const scaleY = displayHeight / image.height;
      // cover-scale: Math.max so the image fills the thumbnail
      const initialScale = Math.max(scaleX, scaleY);
      const xOffset = (displayWidth - image.width * initialScale) / 2;
      const yOffset = (displayHeight - image.height * initialScale) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(xOffset, yOffset);
      ctx.scale(initialScale, initialScale);
      ctx.drawImage(image, 0, 0, image.width, image.height);

      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        if (line.points.length > 0) {
          ctx.moveTo(line.points[0].x, line.points[0].y);
          for (let i = 1; i < line.points.length; i++) {
            ctx.lineTo(line.points[i].x, line.points[i].y);
          }
          ctx.stroke();
        }
      });

      ctx.restore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgUrl, lines]);
}
