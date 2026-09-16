import { Dialog, Box } from "@mui/material";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Report } from "../db/AppSchema";
import { PopImmeuble } from "../db/AppSchema";
import { MapLibre } from "./map/MapLibre";

export const CadastreMapModal = ({ onClose }: { onClose: () => void }) => {
  const form = useFormContext<Report>();
  const cadastralRef = useWatch({ control: form.control, name: "projectCadastralRef" });
  const address = useWatch({ control: form.control, name: "applicantAddress" });
  const zipCode = useWatch({ control: form.control, name: "zipCode" });
  const city = useWatch({ control: form.control, name: "city" });

  const editorialAddress = [address, [zipCode, city].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  // MapLibre only reads `adresse_forme_editoriale` / `coordonnees_au_format_wgs84`
  // to center the map, so a minimal object built from the report address is enough.
  // Memoized so MapLibre doesn't re-center on every render while the user pans.
  const popMH = useMemo(
    () =>
      ({
        adresse_forme_editoriale: editorialAddress || null,
        coordonnees_au_format_wgs84: null,
      }) as PopImmeuble,
    [editorialAddress],
  );

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth={false}
      sx={{
        ".MuiPaper-root": {
          width: { xs: "100%", lg: "1200px" },
          maxWidth: { xs: "100%", lg: "1200px" },
          height: { xs: "100dvh", lg: 792 },
          maxHeight: { xs: "100dvh", lg: "100dvh" },
          margin: "0 !important",
        },
        zIndex: 1400,
      }}
    >
      <Box p="0" width="100%" height="100%">
        <MapLibre
          popMH={popMH}
          onClose={onClose}
          onSaveReferenceCadastrale={(ref) => {
            form.setValue("projectCadastralRef", ref);
            onClose();
          }}
          initialCoordinates={null}
          initialReferenceCadastrale={cadastralRef ?? null}
        />
      </Box>
    </Dialog>
  );
};
