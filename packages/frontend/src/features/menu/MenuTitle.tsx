import { ReactNode } from "react";
import { menuActor } from "./menuMachine";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Typography } from "@mui/material";
import { Button } from "#components/MUIDsfr.tsx";

export const MenuTitle = ({
  children,
  backButtonOnClick,
  buttons,
  hideDivider,
  alert,
  onClose,
}: {
  children: ReactNode;
  backButtonOnClick?: () => void;
  buttons?: ReactNode;
  hideDivider?: boolean;
  onClose?: () => void;
  alert?: ReactNode;
}) => (
  <>
    <Flex
      bgcolor="white"
      zIndex="5"
      position={{ xs: "sticky", lg: "sticky" }}
      top={{ xs: "0", lg: "0" }}
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      py={{ xs: "16px", lg: "30px" }}
      pl={{ xs: undefined, lg: "0" }}
    >
      <Box display={{ lg: "none" }}>
        {backButtonOnClick ? (
          <Button priority="tertiary no outline" iconId="ri-arrow-left-s-line" onClick={backButtonOnClick}>
            {null}
          </Button>
        ) : null}
      </Box>
      <Typography
        display={{
          xs: buttons ? "none" : "block",
          lg: "block",
        }}
        pl={backButtonOnClick ? "16px" : 0}
        textOverflow="ellipsis"
        fontSize="20px"
        fontWeight="bold"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {children}
      </Typography>
      <Flex
        gap="16px"
        pl={{ xs: "16px", lg: "24px" }}
        textOverflow="ellipsis"
        fontSize="20px"
        fontWeight="bold"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {buttons}
      </Flex>
      <ModalCloseButton onClose={onClose ?? (() => menuActor.send({ type: "CLOSE" }))} />
    </Flex>
    {alert ? alert : null}
    {!hideDivider ? (
      <Box mb="24px">
        {buttons ? (
          <Typography display={{ lg: "none" }} fontSize="20px" fontWeight="bold">
            {children}
          </Typography>
        ) : null}
      </Box>
    ) : null}
  </>
);

export const ModalCloseButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      className="fr-btn--close fr-btn"
      title="Fermer"
      type="button"
      data-fr-js-modal-button="true"
      onClick={onClose}
    >
      Fermer
    </button>
  );
};

export const ModalBackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      priority="tertiary no outline"
      sx={{
        fontSize: "14px",
      }}
      title="Retour"
      type="button"
      iconId="ri-arrow-left-line"
      data-fr-js-modal-button="true"
      onClick={onClick}
    >
      Retour
    </Button>
  );
};
