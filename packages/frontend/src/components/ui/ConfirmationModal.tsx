import { Dialog, Box, DialogTitle } from "@mui/material";
import { ReactNode } from "react";
import { ModalCloseButton } from "../../features/menu/MenuTitle";
import { Flex } from "./Flex";
import { Button } from "#components/MUIDsfr.tsx";

export const ConfirmationModal = ({
  title,
  content,
  buttonLabel = "Confirmer",
  onClose,
  onConfirm,
}: {
  title: ReactNode;
  content: ReactNode;
  buttonLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog
      open
      onClose={onClose}
      sx={{
        ".MuiPaper-root": {
          maxWidth: { xs: "100%", sm: "800px" },
          width: "800px",
        },
      }}
    >
      <Box p="16px" width={"100%"}>
        <ModalCloseButton onClose={onClose} />
        <DialogTitle>{title}</DialogTitle>
        <Box p="8px 24px 24px 24px">{content}</Box>

        <Flex justifyContent="flex-end" gap="16px" px="24px" pb="16px">
          <Button priority="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button onClick={() => onConfirm()} type="button">
            {buttonLabel}
          </Button>
        </Flex>
      </Box>
    </Dialog>
  );
};
