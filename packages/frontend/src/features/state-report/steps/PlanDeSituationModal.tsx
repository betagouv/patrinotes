import { Dialog, Box, DialogTitle, Typography } from "@mui/material";
import { ModalCloseButton } from "../../menu/MenuTitle";
import { MapLibre } from "../../map/MapLibre";
import { useStateReportFormContext } from "../utils";
import { useWatch } from "react-hook-form";
import { db, useDbQuery } from "../../../db/db";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";

export const PlanDeSituationModal = ({ referencePop, onClose }: { referencePop: string; onClose: () => void }) => {
  const form = useStateReportFormContext();
  const coordonnees = useWatch({ name: "coordonnees", control: form.control });
  const popMHQuery = useDbQuery(db.selectFrom("pop_immeubles").selectAll().where("id", "=", referencePop));
  const popMH = popMHQuery.data?.[0];

  if (popMHQuery.isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Dialog
      open
      onClose={onClose}
      sx={{
        ".MuiPaper-root": {
          width: { xs: "100%", lg: "634px" },
          height: { xs: "100dvh", lg: 792 },
          maxHeight: { xs: "100dvh", lg: "100dvh" },
          margin: "0!important",
        },
        zIndex: 1400,
      }}
    >
      {popMH ? (
        <Box p="0" width="100%" height="100%">
          <Box p="0" height="100%">
            <MapLibre
              popMH={popMH}
              onClose={onClose}
              onSaveCoordinates={(coords) => form.setValue("coordonnees", coords)}
              initialCoordinates={coordonnees}
            />
          </Box>
        </Box>
      ) : (
        <Typography>Plan de situation non disponible</Typography>
      )}
    </Dialog>
  );
};
