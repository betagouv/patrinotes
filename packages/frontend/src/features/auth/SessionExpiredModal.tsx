import { Dialog, Box, DialogTitle } from "@mui/material";
import { Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";

export const SessionExpiredModal = ({ onReconnect }: { onReconnect: () => void }) => {
  return (
    <Dialog
      open
      disablePortal
      sx={{
        ".MuiPaper-root": {
          maxWidth: { xs: "100%", sm: "600px" },
          width: "600px",
        },
        zIndex: 1400,
      }}
    >
      <Box p="16px" width="100%">
        <DialogTitle>Session expirée</DialogTitle>
        <Box p="8px 24px 24px 24px">
          Votre session a expiré. Veuillez vous reconnecter pour continuer à utiliser l'application.
        </Box>

        <Flex justifyContent="flex-end" gap="16px" px="24px" pb="16px">
          <Button onClick={onReconnect} type="button">
            Se reconnecter
          </Button>
        </Flex>
      </Box>
    </Dialog>
  );
};
