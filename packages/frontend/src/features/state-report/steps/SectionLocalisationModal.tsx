import { useCallback, useMemo, useRef, useState } from "react";
import { Dialog, Box, Typography } from "@mui/material";
import { useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LocalisationMap, LocalisationMapHandle, getZoneBounds } from "../../map/LocalisationMap";
import {
  LocalisationLine,
  LocalisationPin,
  parseLocalisationDrawings,
  parseLocalisationPins,
  parseLocalisationZone,
} from "../../map/localisationTypes";
import { cropMapToZone } from "../localisationSnapshot";
import { upsertLocalisationAttachment } from "../localisationAttachment";
import { resolveCoordonnees } from "../planSituationAttachment";
import { useStateReportFormContext } from "../utils";
import { db } from "../../../db/db";
import { VisitedSection } from "../../../db/AppSchema";
import { useUser } from "../../../contexts/AuthContext";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";

export const SectionLocalisationModal = ({
  visitedSection,
  onClose,
}: {
  visitedSection: VisitedSection;
  onClose: () => void;
}) => {
  const form = useStateReportFormContext();
  const coordonnees = useWatch({ name: "coordonnees", control: form.control });
  const referencePop = useWatch({ name: "reference_pop", control: form.control });
  const adresse = useWatch({ name: "adresse", control: form.control });
  const user = useUser();

  // Falls back to the MH's own coordinates / a geocoded address when the user never
  // explicitly placed a pin — same resolution chain used for the plan de situation, so
  // this map can be used without requiring that flow to be done first.
  const resolvedCoordonneesQuery = useQuery({
    queryKey: ["localisation-coordonnees", coordonnees, referencePop, adresse],
    queryFn: () => resolveCoordonnees({ coordonnees, referencePop, adresse }),
  });
  const resolvedCoordonnees = resolvedCoordonneesQuery.data;

  const initialPins = useMemo(() => parseLocalisationPins(visitedSection.localisation_pins), [visitedSection.id]);
  const initialDrawings = useMemo(
    () => parseLocalisationDrawings(visitedSection.localisation_drawings),
    [visitedSection.id],
  );
  const initialZone = useMemo(() => parseLocalisationZone(visitedSection.localisation_zone), [visitedSection.id]);

  const [pins, setPins] = useState<LocalisationPin[]>(initialPins);
  const [drawings, setDrawings] = useState<LocalisationLine[]>(initialDrawings);
  const [isDirty, setIsDirty] = useState(false);
  const markDirty = useCallback(() => setIsDirty(true), []);
  const handleRef = useRef<LocalisationMapHandle | null>(null);

  const validateMutation = useMutation({
    mutationFn: async () => {
      const handle = handleRef.current;
      if (!handle) return;
      const zone = getZoneBounds(handle.map, handle.containerEl, handle.zoneEl);
      const blob = await cropMapToZone({ map: handle.map, containerEl: handle.containerEl, zoneEl: handle.zoneEl });
      await db
        .updateTable("visited_section")
        .set({
          localisation_pins: JSON.stringify(pins),
          localisation_drawings: JSON.stringify(drawings),
          localisation_zone: JSON.stringify(zone),
        })
        .where("id", "=", visitedSection.id)
        .execute();
      await upsertLocalisationAttachment({ visitedSectionId: visitedSection.id, serviceId: user!.service_id, blob });
      onClose();
    },
  });

  const dialogSx = {
    ".MuiPaper-root": {
      width: { xs: "100%", lg: "1200px" },
      height: { xs: "100dvh", lg: 792 },
      maxHeight: { xs: "100dvh", lg: "100dvh" },
      margin: "0!important",
    },
    zIndex: 1400,
  };

  if (resolvedCoordonneesQuery.isLoading) {
    return (
      <Dialog open onClose={onClose} maxWidth={false} sx={dialogSx}>
        <Center width="100%" height="100%">
          <Spinner />
        </Center>
      </Dialog>
    );
  }

  if (!resolvedCoordonnees) {
    return (
      <Dialog open onClose={onClose} maxWidth={false} sx={dialogSx}>
        <Box p={4}>
          <Typography>
            Aucune localisation n'a pu être déterminée pour ce constat. Renseignez d'abord un emplacement dans
            "Contexte de la visite".
          </Typography>
        </Box>
      </Dialog>
    );
  }

  const [lat, lng] = resolvedCoordonnees.split(",").map(Number);

  return (
    <Dialog open onClose={onClose} maxWidth={false} sx={dialogSx}>
      <Box p="0" width="100%" height="100%">
        <LocalisationMap
          center={[lng, lat]}
          initialZone={initialZone}
          onReady={(handle) => {
            handleRef.current = handle;
          }}
          onClose={onClose}
          onCancel={onClose}
          onValidate={() => validateMutation.mutate()}
          isDirty={isDirty}
          isSaving={validateMutation.isPending}
          pins={pins}
          setPins={setPins}
          drawings={drawings}
          setDrawings={setDrawings}
          markDirty={markDirty}
        />
      </Box>
    </Dialog>
  );
};
