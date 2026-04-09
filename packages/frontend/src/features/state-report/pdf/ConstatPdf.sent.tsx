import { Button, Center } from "#components/MUIDsfr.tsx";
import { getRouteApi } from "@tanstack/react-router";
import { Box } from "@mui/material";
import sentImage from "../../../assets/sent.svg";
import { useUserSettings } from "../../../hooks/useUserSettings";
import { useWatch } from "react-hook-form";
import { useSendConstatFormContext } from "./ConstatPdfContext";

const routeApi = getRouteApi("/constat_/$constatId/pdf");

export const SentConstatPdf = () => {
  const navigate = routeApi.useNavigate();
  const form = useSendConstatFormContext();
  const { userSettings } = useUserSettings();
  const needValidation = useWatch({ control: form.control, name: "needValidation" });

  return (
    <Center height="100%">
      <Center flexDirection="column" width="100%" mt="24px" mb={{ xs: "48px", lg: "80px" }}>
        <Box component="img" src={sentImage} alt="Courriel envoyé" width={{ xs: "80px", lg: "120px" }} />
        <Box mt="16px" color="text-title-blue-france" textAlign="center" fontSize={{ xs: "18px", lg: "24px" }}>
          {needValidation && userSettings?.validation_enabled && userSettings?.validation_email
            ? "Votre constat a été transmis pour validation. Il sera envoyé aux destinataires après approbation."
            : "Votre constat d'état a bien été envoyé !"}
        </Box>
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
