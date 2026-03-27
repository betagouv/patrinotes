import { useMemo } from "react";
import { useDbQuery, db } from "../../../db/db";
import { Line } from "../types";

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

  const rawLines = result.data?.[0]?.lines ?? "[]";

  return useMemo(() => {
    if (!attachmentId || !imageTable) return [];
    return JSON.parse(rawLines) as Line[];
  }, [attachmentId, imageTable, rawLines]);
}
