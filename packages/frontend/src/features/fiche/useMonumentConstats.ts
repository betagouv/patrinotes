import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { db, useDbQuery } from "../../db/db";
import { useIsOnline } from "../../hooks/useIsOnline";

export type MonumentConstatRow = {
  id: string;
  created_at: string | null;
  nature_visite: string | null;
  redacted_by: string | null;
  titre_edifice: string | null;
  pdf_size: number | null;
  service_name: string | null;
  up_id: string | null;
  up_intitule: string | null;
  /** synced to this device (own service): it can be opened in the app */
  isLocal: boolean;
};

/**
 * Sent constats of a monument, newest first: those of any service sharing its department (online), plus those
 * already synced to this device (own service), which are the only ones offline.
 */
export const useMonumentConstats = (referencePop: string | null | undefined, excludeId?: string) => {
  const isOnline = useIsOnline();
  const reference = referencePop?.trim() ?? "";
  const enabled = !!reference && reference !== "CUSTOM";

  const localQuery = useDbQuery(
    db
      .selectFrom("state_report")
      .selectAll()
      .where("reference_pop", "like", "%" + (enabled ? reference : "__none__"))
      .where("id", "<>", excludeId ?? "")
      .where("disabled", "<>", 1)
      .where("attachment_id", "is not", null)
      .orderBy("created_at", "desc"),
    [reference, excludeId],
  );

  const remoteQuery = useQuery({
    queryKey: ["previous-constats", reference],
    queryFn: () => api.get("/api/state-report/previous", { query: { referencePop: reference } }),
    enabled: isOnline && enabled,
    retry: false,
  });

  const local = (localQuery.data ?? []).filter((c) => c.id !== excludeId);
  const localById = new Map(local.map((c) => [c.id, c]));
  const remote = (remoteQuery.data ?? []).filter((c) => c.id !== excludeId);
  const remoteIds = new Set(remote.map((c) => c.id));

  const rows: MonumentConstatRow[] = enabled
    ? [
        ...remote.map((c) => ({
          id: c.id,
          created_at: c.created_at,
          nature_visite: c.nature_visite,
          redacted_by: c.redacted_by,
          titre_edifice: c.titre_edifice,
          pdf_size: c.pdf_size,
          service_name: c.service_name,
          up_id: c.up_id,
          up_intitule: c.up_intitule,
          isLocal: localById.has(c.id),
        })),
        // keep local constats the backend didn't return (offline, or department mismatch)
        ...local
          .filter((c) => !remoteIds.has(c.id))
          .map((c) => ({
            id: c.id,
            created_at: c.created_at,
            nature_visite: c.nature_visite,
            redacted_by: c.redacted_by,
            titre_edifice: c.titre_edifice,
            pdf_size: c.pdf_size,
            service_name: null,
            up_id: c.up_id,
            up_intitule: c.up_intitule,
            isLocal: true,
          })),
      ].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    : [];

  return { rows, isLoading: localQuery.isLoading || (remoteQuery.isLoading && remoteQuery.fetchStatus !== "idle") };
};

/** Number of constats per UP id (null = ensemble du monument). */
export const countConstatsByUp = (rows: MonumentConstatRow[]) => {
  const counts = new Map<string | null, number>();
  for (const row of rows) counts.set(row.up_id ?? null, (counts.get(row.up_id ?? null) ?? 0) + 1);
  return counts;
};
