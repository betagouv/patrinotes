import { useEffect, useMemo, useState } from "react";
import { Dialog, Box } from "@mui/material";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { db, useDbQuery } from "../../db/db";
import { PopImmeuble } from "../../db/AppSchema";
import { useUser } from "../../contexts/AuthContext";
import { getCurrentPosition } from "../../hooks/useGeolocation";
import { MonumentPickerMap, MonumentMarker } from "./MonumentPickerMap";

// Ministère de la Culture, Paris - used when geolocation and every fallback below are unavailable.
const PARIS_FALLBACK_CENTER: [number, number] = [2.3376, 48.8637];

type FilterablePopImmeuble = Pick<
  PopImmeuble,
  "reference" | "id" | "titre_editorial_de_la_notice" | "commune_forme_editoriale" | "adresse_forme_index"
>;

function parseCoordinates(raw: string | null | undefined): [number, number] | null {
  if (!raw) return null;
  const [lat, lng] = raw.split(",").map(Number);
  if (isNaN(lat) || isNaN(lng)) return null;
  return [lat, lng];
}

async function resolveFallbackCenter(userId: string, serviceId: string): Promise<[number, number]> {
  const ownReport = await db
    .selectFrom("state_report")
    .innerJoin("pop_immeubles", "pop_immeubles.id", "state_report.reference_pop")
    .select(["pop_immeubles.coordonnees_au_format_wgs84 as coords"])
    .where("state_report.created_by", "=", userId)
    .where("state_report.reference_pop", "is not", null)
    .where("state_report.reference_pop", "<>", "CUSTOM")
    .orderBy("state_report.created_at", "desc")
    .executeTakeFirst();
  const ownCoords = parseCoordinates(ownReport?.coords);
  if (ownCoords) return [ownCoords[1], ownCoords[0]];

  const serviceReport = await db
    .selectFrom("state_report")
    .innerJoin("pop_immeubles", "pop_immeubles.id", "state_report.reference_pop")
    .select(["pop_immeubles.coordonnees_au_format_wgs84 as coords"])
    .where("state_report.service_id", "=", serviceId)
    .where("state_report.reference_pop", "is not", null)
    .where("state_report.reference_pop", "<>", "CUSTOM")
    .orderBy("state_report.created_at", "desc")
    .executeTakeFirst();
  const serviceCoords = parseCoordinates(serviceReport?.coords);
  if (serviceCoords) return [serviceCoords[1], serviceCoords[0]];

  return PARIS_FALLBACK_CENTER;
}

export const MonumentMapModal = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: FilterablePopImmeuble) => void;
}) => {
  const user = useUser();
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    setCenter(null);
    setUserLocation(null);
    let cancelled = false;

    (async () => {
      const coords = await getCurrentPosition();
      if (cancelled) return;

      if (coords) {
        const resolved: [number, number] = [coords.longitude, coords.latitude];
        setCenter(resolved);
        setUserLocation(resolved);
        return;
      }

      setCenter(await resolveFallbackCenter(user.id, user.service.id));
    })();

    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const immeublesQuery = useDbQuery(
    db
      .selectFrom("pop_immeubles")
      .select([
        "reference",
        "id",
        "titre_editorial_de_la_notice",
        "commune_forme_editoriale",
        "adresse_forme_index",
        "coordonnees_au_format_wgs84",
      ]),
  );

  const countsQuery = useDbQuery(
    db
      .selectFrom("state_report")
      .select(["reference_pop", db.fn.countAll().as("count")])
      .where("attachment_id", "is not", null)
      .where("validation_status", "<>", "declined")
      .groupBy("reference_pop"),
  );

  const markers = useMemo<MonumentMarker[]>(() => {
    const counts = new Map((countsQuery.data ?? []).map((row) => [row.reference_pop, Number(row.count)]));
    return (immeublesQuery.data ?? []).flatMap((item) => {
      const coords = parseCoordinates(item.coordonnees_au_format_wgs84);
      if (!coords) return [];
      return [
        {
          id: item.id,
          title: item.titre_editorial_de_la_notice ?? item.reference ?? "",
          lat: coords[0],
          lng: coords[1],
          finalizedCount: counts.get(item.id) ?? 0,
        },
      ];
    });
  }, [immeublesQuery.data, countsQuery.data]);

  const handleSelect = (id: string) => {
    const item = immeublesQuery.data?.find((i) => i.id === id);
    if (item) onSelect(item);
  };

  const isLoading = !center || immeublesQuery.isLoading || countsQuery.isLoading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        ".MuiPaper-root": {
          width: { xs: "100%", lg: "1200px" },
          height: { xs: "100dvh", lg: 792 },
          maxHeight: { xs: "100dvh", lg: "100dvh" },
          margin: "0!important",
        },
        zIndex: 1400,
      }}
    >
      <Box p="0" width="100%" height="100%">
        {isLoading ? (
          <Center height="100%">
            <Spinner />
          </Center>
        ) : (
          <MonumentPickerMap
            center={center}
            markers={markers}
            userLocation={userLocation}
            onSelect={handleSelect}
            onClose={onClose}
          />
        )}
      </Box>
    </Dialog>
  );
};
