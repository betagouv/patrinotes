import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import type { StateReportFormType } from "../state-report/utils";
import type { UseFormReturn } from "react-hook-form";

/** Unité patrimoniale as served by GET /api/up/* (see backend features/up/upTypes.ts). */
export type UnitePatrimoniale = {
  id: string;
  identifiant: string | null;
  intitule: string;
  intituleComplet: string | null;
  referenceMerimee: string | null;
  niveau: string | null;
  protection: string | null;
  typeImmeuble: string | null;
  autresAppellations: string[];
  adresse: {
    rue: string | null;
    commune: string | null;
    communeCodeInsee: string | null;
    departementCode: string | null;
  } | null;
  coordonnees: { latitude: number; longitude: number } | null;
  enfantsIds: string[];
  complete: boolean;
};

/** Whole hierarchy of a monument, flattened (see backend UpTree); the root is the monument itself. */
export type UpTree = { rootId: string; ups: UnitePatrimoniale[] };

/** One level of the tree: an UP and its direct children (sorted by name). */
export type UpLevel = { parent: UnitePatrimoniale; enfants: UnitePatrimoniale[] };

export const getUpLevel = (tree: UpTree, id: string): UpLevel => {
  const byId = new Map(tree.ups.map((up) => [up.id, up]));
  const parent = byId.get(id)!;
  return { parent, enfants: parent.enfantsIds.map((childId) => byId.get(childId)!).filter(Boolean) };
};

export const getUpRoot = (tree: UpTree) => tree.ups.find((up) => up.id === tree.rootId)!;

/** Ids from the monument root down to (and including) the given UP, or undefined when it is not in the tree. */
export const getPathToUp = (tree: UpTree, upId: string): string[] | undefined => {
  const parentOf = new Map<string, string>();
  for (const up of tree.ups) {
    for (const childId of up.enfantsIds) if (!parentOf.has(childId)) parentOf.set(childId, up.id);
  }
  const path = [upId];
  const seen = new Set(path);
  while (path[0] !== tree.rootId) {
    const parentId = parentOf.get(path[0]!);
    if (!parentId || seen.has(parentId)) return undefined;
    seen.add(parentId);
    path.unshift(parentId);
  }
  return path;
};

/** The selection of a constat on this UP (null or the root = ensemble du monument). */
export const getUpSelection = (tree: UpTree, upId: string | null): UpSelection => {
  const monument = getUpRoot(tree);
  if (!upId || upId === tree.rootId) return { up: null, chemin: [], monument };
  const byId = new Map(tree.ups.map((up) => [up.id, up]));
  const path = getPathToUp(tree, upId) ?? [tree.rootId, upId];
  return {
    up: byId.get(upId) ?? null,
    chemin: path.slice(1, -1).map((id) => ({ id, intitule: byId.get(id)?.intitule ?? "" })),
    monument,
  };
};

/** Ancestors of the chosen UP, below the monument root (the root itself is not included). */
export type UpCheminItem = { id: string; intitule: string };

export const upQueryKeys = {
  monument: (reference: string) => ["up", "monument", reference] as const,
};

export const fetchMonumentUpTree = async (reference: string): Promise<UpTree | null> => {
  const response = await api.get("/api/up/monument", { query: { reference } });
  return (response.tree ?? null) as UpTree | null;
};

export const upStaleTime = 60 * 60 * 1000;

/** UP tree of a monument; disabled for constats without Mérimée reference. */
export const useMonumentUpTree = (reference: string | null | undefined, enabled = true) =>
  useQuery({
    queryKey: upQueryKeys.monument(reference ?? ""),
    queryFn: () => fetchMonumentUpTree(reference!),
    enabled: enabled && !!reference && reference !== "CUSTOM",
    staleTime: upStaleTime,
    retry: 1,
  });

export type UpSelection = {
  /** null = ensemble du monument */
  up: UnitePatrimoniale | null;
  chemin: UpCheminItem[];
  monument: UnitePatrimoniale | null;
};

export const upFormFields = [
  "up_id",
  "up_identifiant",
  "up_intitule",
  "up_intitule_complet",
  "up_niveau",
  "up_protection",
  "up_type_immeuble",
  "up_monument_identifiant",
  "up_chemin",
] as const satisfies readonly (keyof StateReportFormType)[];

/** Copies the chosen UP into the constat (like immeubleMapping does for the monument). */
export const applyUpSelection = (form: UseFormReturn<StateReportFormType>, selection: UpSelection | null) => {
  const up = selection?.up ?? null;
  const values: Record<(typeof upFormFields)[number], string | null> = {
    up_id: up?.id ?? null,
    up_identifiant: up?.identifiant ?? null,
    up_intitule: up?.intitule ?? null,
    up_intitule_complet: up?.intituleComplet ?? null,
    up_niveau: up?.niveau ?? null,
    up_protection: up?.protection ?? null,
    up_type_immeuble: up?.typeImmeuble ?? null,
    up_monument_identifiant: selection?.monument?.identifiant ?? null,
    up_chemin: up && selection?.chemin.length ? JSON.stringify(selection.chemin) : null,
  };

  for (const [field, value] of Object.entries(values)) {
    form.setValue(field as keyof StateReportFormType, value);
  }
};

export const parseUpChemin = (value: string | null | undefined): UpCheminItem[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
