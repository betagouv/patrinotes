import { MenuTitle } from "./MenuTitle";
import { clearDb } from "../../db/db";
import { menuActor } from "./menuMachine";

import { useState } from "react";
import { TitleH3 } from "../../routes/account";
import { Box, Stack, Typography } from "@mui/material";
import { Divider } from "#components/ui/Divider.tsx";
import { Button, Alert } from "#components/MUIDsfr.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Flex } from "#components/ui/Flex.tsx";

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

      <Stack mb="64px">
        <Stack px="16px">
          <TitleH3>Guides d'utilisation</TitleH3>
          <Box mt="8px">
            Besoin d’aide pour configurer votre compte, créer un compte-rendu ou un constat d’état ? Retrouvez les
            guides d’utilisation dédiés sur le site vitrine.
          </Box>
          <Flex gap={{ xs: "8px", lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }} mt="16px">
            <Button
              priority="secondary"
              linkProps={{ target: "_blank", href: "https://patrinotes.beta.gouv.fr/compte-rendu/" }}
              sx={{
                width: { xs: "100%", lg: undefined },
                justifyContent: { xs: "center", lg: undefined },
              }}
            >
              Compte-rendu
            </Button>
            <Button
              priority="secondary"
              linkProps={{ target: "_blank", href: "https://patrinotes.beta.gouv.fr/constat-d%C3%A9tat/" }}
              sx={{
                width: { xs: "100%", lg: undefined },
                justifyContent: { xs: "center", lg: undefined },
              }}
            >
              Constat d'état
            </Button>
          </Flex>
        </Stack>
        <Box px="16px">
          <Divider height="2px" my="32px" color="#C1C1FB" />
        </Box>
        <Stack px="16px">
          <TitleH3>Foire aux questions</TitleH3>
          <Box mt="8px">
            À qui s’adresse Patrinotes ? Comment créer un nouveau compte-rendu ? Comment ajouter des photos... Découvrez
            toutes les réponses sur la FAQ.
          </Box>
          <Button
            priority="secondary"
            sx={{ mt: "16px" }}
            linkProps={{ target: "_blank", href: "https://patrinotes.beta.gouv.fr/faq" }}
          >
            Consulter la FAQ
          </Button>
        </Stack>
        <Box px="16px">
          <Divider height="2px" my="32px" color="#C1C1FB" />
        </Box>
        <Stack px="16px">
          <TitleH3>Assistance technique</TitleH3>
          <Box>
            Vous ne voyez pas vos dernières informations enregistrées ? Essayez de réinitialiser les données locales.
          </Box>
          <Button
            priority="secondary"
            sx={{
              mt: "16px",
            }}
            onClick={() => deleteLocalData()}
          >
            Réinitialiser les données locales
          </Button>
        </Stack>

        <Box px="16px">
          <Divider height="2px" my="32px" color="#C1C1FB" />
        </Box>

        <Stack px="16px">
          <TitleH3>Contact</TitleH3>

          {showClipboardSuccess ? (
            // @ts-ignore
            <Alert
              severity="info"
              sx={{ mb: "16px" }}
              title={undefined}
              description="Courriel ajouté au presse-papier"
            />
          ) : null}
          <Box>
            Besoin d'accompagnement ? Écrivez-nous à{" "}
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
