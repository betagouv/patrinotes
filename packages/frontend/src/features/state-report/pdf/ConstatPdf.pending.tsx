import { Button, Center } from "#components/MUIDsfr.tsx";
import { getRouteApi } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";
import pendingImage from "../../../assets/sent.svg";

const routeApi = getRouteApi("/constat_/$constatId/pdf");

export const PendingConstatPdf = ({ supervisorEmail }: { supervisorEmail?: string }) => {
  const navigate = routeApi.useNavigate();

  return (
    <Center height="100%">
      <Center flexDirection="column" width="100%" mt="24px" px="24px">
        <Box component="img" src={pendingImage} alt="En attente de validation" width={{ xs: "80px", lg: "120px" }} />
        <Box mt="16px" color="text-title-blue-france" textAlign="center" fontSize={{ xs: "18px", lg: "24px" }}>
          Constat envoyé pour validation
        </Box>
        <Typography mt="16px" textAlign="center" maxWidth="500px" color="text.secondary">
          Votre constat d'état a été envoyé à votre responsable hiérarchique
          {supervisorEmail && (
            <>
              {" "}(<strong>{supervisorEmail}</strong>)
            </>
          )}
          {" "}pour validation.
        </Typography>
        <Typography mt="8px" textAlign="center" maxWidth="500px" color="text.secondary">
          Vous recevrez un email lorsque la décision sera prise. Si le constat est validé, il sera automatiquement envoyé aux destinataires.
        </Typography>
        <Button
          sx={{ mt: { xs: "24px", lg: "48px" } }}
          type="button"
          onClick={() => navigate({ to: "/", search: { document: "constats" } })}
        >
          Accueil
        </Button>
      </Center>
    </Center>
  );
};
