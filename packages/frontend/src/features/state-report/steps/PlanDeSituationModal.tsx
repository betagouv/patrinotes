import { Dialog, Box, DialogTitle, Typography } from "@mui/material";
import { ModalCloseButton } from "../../menu/MenuTitle";
import { MapLibre } from "../../map/MapLibre";
import { useStateReportFormContext } from "../utils";
import { useWatch } from "react-hook-form";
import { db, useDbQuery } from "../../../db/db";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { getRouteApi } from "@tanstack/react-router";
import { invalidatePlanSituationAttachment } from "../planSituationAttachment";

const routeApi = getRouteApi("/constat/$constatId");

export const PlanDeSituationModal = ({ referencePop, onClose }: { referencePop: string; onClose: () => void }) => {
  const form = useStateReportFormContext();
  const { constatId } = routeApi.useParams();
  const coordonnees = useWatch({ name: "coordonnees", control: form.control });
  const referenceCadastrale = useWatch({ name: "reference_cadastrale", control: form.control });
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
      {popMH ? (
        <Box p="0" width="100%" height="100%">
          <Box p="0" height="100%">
            <MapLibre
              popMH={popMH}
              onClose={onClose}
              onSaveCoordinates={(coords) => {
                form.setValue("coordonnees", coords);
                invalidatePlanSituationAttachment(constatId);
              }}
              onSaveReferenceCadastrale={(ref) => {
                form.setValue("reference_cadastrale", ref);
                invalidatePlanSituationAttachment(constatId);
              }}
              initialCoordinates={coordonnees}
              initialReferenceCadastrale={referenceCadastrale}
            />
          </Box>
        </Box>
      ) : (
        <Typography>Plan de situation non disponible</Typography>
      )}
    </Dialog>
  );
};
