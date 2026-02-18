import { MenuTitle } from "./MenuTitle";
import { clearDb } from "../../db/db";
import { menuActor } from "./menuMachine";

import { useState } from "react";
import { TitleH3 } from "../../routes/account";
import { Box, Stack, Typography } from "@mui/material";
import { Divider } from "#components/ui/Divider.tsx";
import { Button, Alert } from "#components/MUIDsfr.tsx";
import { fr } from "@codegouvfr/react-dsfr";

export const HelpMenu = () => {
  const [showClipboardSuccess, setShowClipboardSuccess] = useState(false);

  const deleteLocalData = () => {
    localStorage.clear();
    indexedDB.deleteDatabase("crvif.db");
    unregisterSWs();
    clearDb().then(() => {
      window.location.reload();
    });
  };
  return (
    <>
      <MenuTitle backButtonOnClick={() => menuActor.send({ type: "BACK" })}>Aide</MenuTitle>
      <Box px="16px">
        <Divider
          bgcolor="#C1C1FB"
          height="2px"
          mt={{ xs: "0", lg: "0" }}
          mb={{ xs: "24px", lg: "32px" }}
          px={{ xs: "16px", lg: 0 }}
        />
      </Box>
      <Stack>
        <Stack px="16px">
          <TitleH3>Foire aux questions</TitleH3>
          <Box mt="8px">
            À qui s’adresse Patrinotes ? Comment créer un nouveau compte-rendu ? Comment ajouter des photos... Découvrez
            toutes les réponses sur la FAQ.
          </Box>
          <Button
            sx={{ mt: "16px", bgcolor: fr.colors.decisions.text.actionHigh.blueFrance.default + " !important" }}
            linkProps={{ target: "_blank", href: "https://patrinotes.beta.gouv.fr/faq" }}
          >
            Consulter FAQ
          </Button>
        </Stack>
        <Box px="16px">
          <Divider height="2px" mt={{ xs: "27px", lg: "32px" }} mb={{ xs: 0, lg: "24px" }} color="#C1C1FB" />
        </Box>
        <Stack mt="8px" px="16px">
          <TitleH3>Assistance technique</TitleH3>
          <Box>
            Vous ne voyez pas vos dernières informations enregistrées ? Essayez de réinitialiser les données locales.
          </Box>
          <Button
            sx={{
              mt: "16px",
            }}
            onClick={() => deleteLocalData()}
          >
            Réinitialiser
          </Button>
        </Stack>

        <Box px="16px">
          <Divider height="2px" mt={{ xs: "27px", lg: "32px" }} mb={{ xs: 0, lg: "24px" }} color="#C1C1FB" />
        </Box>

        <Stack mt="8px" mb="32px" px="16px">
          <TitleH3>Contact</TitleH3>

          {showClipboardSuccess ? (
            // @ts-ignore
            <Alert severity="info" sx={{ mb: "16px" }} title={undefined} description="Ajouté au presse-papier" />
          ) : null}
          <Box>
            Vous pouvez contacter l'équipe à{" "}
            <Typography
              component="span"
              className="fr-link"
              onClick={() => {
                navigator.clipboard.writeText("contact@patrinotes.beta.gouv.fr");
                setShowClipboardSuccess(true);
              }}
              sx={{
                cursor: "pointer",
                ":hover": { textDecoration: "underline" },
                textDecoration: "underline",
              }}
              color="text-active-blue-france"
            >
              contact@patrinotes.beta.gouv.fr
            </Typography>
            .
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

const unregisterSWs = async () => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();

    // Unregister all service workers
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
};
