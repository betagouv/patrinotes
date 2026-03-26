import { useDbQuery, db } from "../../../db/db";
import { Line } from "../DrawingCanvas";

export function usePictureLines(
  attachmentId: string | null | undefined,
  imageTable: string | null | undefined,
): Line[] {
  const result = useDbQuery(
    db
      .selectFrom("picture_lines")
      .where("attachmentId", "=", attachmentId ?? "")
      .where("table", "=", imageTable ?? "")
      .selectAll(),
  );

  if (!attachmentId || !imageTable) return [];

  return JSON.parse(result.data?.[0]?.lines ?? "[]") as Line[];
}
