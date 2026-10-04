import { type ReactNode, useMemo, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";

export type SortDir = "asc" | "desc";
export type SortState<K extends string> = { key: K; dir: SortDir } | null;

// Cycles asc -> desc -> none on successive clicks of the same column
export const nextSort = <K extends string>(current: SortState<K>, key: K): SortState<K> => {
  if (current?.key !== key) return { key, dir: "asc" };
  if (current.dir === "asc") return { key, dir: "desc" };
  return null;
};

export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// ---------------------------------------------------------------------------
// Sortable header cell content (DSFR Table wraps it in a <th>)
// ---------------------------------------------------------------------------

export const SortableHeader = <K extends string>({
  label,
  sortKey,
  sort,
  onSortChange,
}: {
  label: ReactNode;
  sortKey: K;
  sort: SortState<K>;
  onSortChange: (sort: SortState<K>) => void;
}) => {
  const dir = sort?.key === sortKey ? sort.dir : null;
  const icon = dir === "asc" ? "ri-arrow-up-line" : dir === "desc" ? "ri-arrow-down-line" : "ri-arrow-up-down-line";
  const title = dir === "asc" ? "Trié par ordre croissant" : dir === "desc" ? "Trié par ordre décroissant" : "Trier";

  return (
    <Box
      component="button"
      type="button"
      title={title}
      onClick={() => onSortChange(nextSort(sort, sortKey))}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        p: 0,
        border: "none",
        background: "none",
        font: "inherit",
        fontWeight: "inherit",
        color: "inherit",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      {label}
      <Box
        component="span"
        aria-hidden="true"
        className={fr.cx(icon as any, "fr-icon--sm")}
        sx={{ opacity: dir ? 1 : 0.4, flexShrink: 0 }}
      />
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Client-side sort + filter for tables whose rows are all loaded
// ---------------------------------------------------------------------------

type SortValue = string | number | null | undefined;

export const useClientTable = <T, K extends string>({
  rows,
  getSearchText,
  sortValues,
}: {
  rows: T[];
  getSearchText: (row: T) => string;
  sortValues: Record<K, (row: T) => SortValue>;
}) => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortState<K>>(null);

  const visibleRows = useMemo(() => {
    const needle = normalizeText(filter.trim());
    const filtered = needle ? rows.filter((row) => normalizeText(getSearchText(row)).includes(needle)) : rows;
    if (!sort) return filtered;

    const getValue = sortValues[sort.key];
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      // Empty values always go last
      if (va == null) return vb == null ? 0 : 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * factor;
      return String(va).localeCompare(String(vb), "fr", { numeric: true, sensitivity: "base" }) * factor;
    });
  }, [rows, filter, sort, getSearchText, sortValues]);

  const header = (key: K, label: ReactNode) => (
    <SortableHeader label={label} sortKey={key} sort={sort} onSortChange={setSort} />
  );

  return { rows: visibleRows, filter, setFilter, sort, setSort, header };
};
