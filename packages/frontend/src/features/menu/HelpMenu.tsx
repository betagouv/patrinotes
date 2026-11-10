import { MenuTitle } from "./MenuTitle";
import { getPendingLocalChanges, PendingLocalChanges, resetLocalData } from "./resetLocalData";
import { ConfirmationModal } from "#components/ui/ConfirmationModal.tsx";

import { useState } from "react";
import { TitleH3 } from "../../routes/compte";
import { Box, Stack, Typography } from "@mui/material";
import { Divider } from "#components/ui/Divider.tsx";
import { Button, Alert } from "#components/MUIDsfr.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Flex } from "#components/ui/Flex.tsx";
import { useMutation } from "@tanstack/react-query";

export const HelpMenu = () => {
  const [showClipboardSuccess, setShowClipboardSuccess] = useState(false);

  const [pendingChanges, setPendingChanges] = useState<PendingLocalChanges | null>(null);
  const [offlineError, setOfflineError] = useState(false);

  // Opens the confirmation, after counting the local changes a reset would destroy.
  const prepareReset = useMutation({
    mutationFn: async () => {
      // Without network the app can neither download the data again nor reload once
      // its service worker is gone: the user would be left on a blank page.
      if (!navigator.onLine) {
        setOfflineError(true);
        return;
      }
      setOfflineError(false);
      setPendingChanges(await getPendingLocalChanges());
    },
  });

  const deleteLocalData = useMutation({
    mutationFn: resetLocalData,
  });

  const hasPendingChanges = !!pendingChanges && (pendingChanges.changes > 0 || pendingChanges.attachments > 0);

  return (
    <>
      <Box pl="16px">
        <MenuTitle>Aide</MenuTitle>
      </Box>

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
          {offlineError ? (
            // @ts-ignore
            <Alert
              severity="warning"
              sx={{ mt: "16px" }}
              small
              description="Vous êtes hors connexion. Reconnectez-vous à internet avant de réinitialiser les données locales."
            />
          ) : null}
          <Button
            priority="secondary"
            sx={{
              mt: "16px",
            }}
            disabled={prepareReset.isPending || deleteLocalData.isPending}
            onClick={() => prepareReset.mutate()}
          >
            {deleteLocalData.isPending ? "Réinitialisation en cours…" : "Réinitialiser les données locales"}
          </Button>
          {pendingChanges && !deleteLocalData.isPending ? (
            <ConfirmationModal
              title="Réinitialiser les données locales ?"
              buttonLabel="Réinitialiser"
              onClose={() => setPendingChanges(null)}
              onConfirm={() => deleteLocalData.mutate()}
              content={
                <>
                  {hasPendingChanges ? (
                    // @ts-ignore
                    <Alert
                      severity="warning"
                      sx={{ mb: "16px" }}
                      small
                      description={pendingChangesMessage(pendingChanges)}
                    />
                  ) : null}
                  Les données enregistrées sur cet appareil seront supprimées puis téléchargées à nouveau depuis le
                  serveur. Vous devrez vous reconnecter.
                </>
              }
            />
          ) : null}
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

const pendingChangesMessage = ({ changes, attachments }: PendingLocalChanges) => {
  const parts = [
    changes > 0 ? `${changes} modification${changes > 1 ? "s" : ""}` : null,
    attachments > 0 ? `${attachments} photo${attachments > 1 ? "s" : ""}` : null,
  ].filter(Boolean);
  return `${parts.join(" et ")} n'${changes + attachments > 1 ? "ont" : "a"} pas encore été envoyée${
    changes + attachments > 1 ? "s" : ""
  } au serveur et ser${changes + attachments > 1 ? "ont" : "a"} définitivement perdue${
    changes + attachments > 1 ? "s" : ""
  }. Attendez la fin de la synchronisation avant de réinitialiser.`;
};
