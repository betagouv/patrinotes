import { ReactNode, useState } from "react";

import { useSelector } from "@xstate/react";
import { useIsDesktop, useIsXL } from "../../hooks/useIsDesktop";
import { ClauseMenu } from "./ClauseMenu";
import { HelpMenu } from "./HelpMenu";
import { MenuActions } from "./MenuActions";
import Badge from "@codegouvfr/react-dsfr/Badge";

import { Button, Center } from "#components/MUIDsfr.tsx";
import { ReportSearch } from "#components/ReportSearch.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Drawer, Modal, Typography } from "@mui/material";
import { useLocation, useRouter } from "@tanstack/react-router";
import { useLogout } from "../../contexts/AuthContext";
import { menuActor, MenuStates } from "./menuMachine";
import { ModalCloseButton } from "./MenuTitle";
import { useStatus } from "@powersync/react";

export const MenuButton = ({ noProvider }: { noProvider?: boolean }) => {
  const logout = useLogout();
  const menu = useSelector(menuActor, (state) => state.value);
  const isDesktop = useIsDesktop();
  const isXL = useIsXL();

  return (
    <>
      <Flex alignItems={{ xs: "unset", lg: "center" }} height="100%">
        {isDesktop ? (
          <Flex alignItems="center">
            <Button
              sx={{
                ml: "16px",
                mb: "0",
                textWrap: "nowrap",
                "::before": { mr: isXL ? undefined : "0 !important" },
              }}
              size={!isXL ? "large" : "medium"}
              priority="tertiary no outline"
              linkProps={{ to: "/account" }}
              iconId="fr-icon-account-circle-fill"
            >
              <Typography
                sx={{
                  display: { xs: "none", xl: "inline" },
                }}
              >
                Mon compte
              </Typography>
            </Button>
            <Button
              sx={{
                ml: "16px",
                mb: "0",
                "::before": { mr: isXL ? undefined : "0 !important" },
              }}
              size={!isXL ? "large" : "medium"}
              priority="tertiary no outline"
              linkProps={{ to: "/service" }}
              iconId="fr-icon-france-fill"
            >
              <Typography
                sx={{
                  display: { xs: "none", xl: "inline" },
                }}
              >
                Service
              </Typography>
            </Button>
            <Button
              sx={{
                ml: "16px",
                mb: "0",
                "::before": { mr: isXL ? undefined : "0 !important" },
              }}
              size={!isXL ? "large" : "medium"}
              priority="tertiary no outline"
              onClick={() => menuActor.send({ type: "GO_TO_HELP" })}
              iconId="fr-icon-info-fill"
            >
              <Typography
                sx={{
                  display: { xs: "none", xl: "inline" },
                }}
              >
                Aide
              </Typography>
            </Button>
            <Button
              sx={{
                ml: "16px",
                mb: "0",
                "::before": { mr: isXL ? undefined : "0 !important" },
              }}
              size={!isXL ? "large" : "medium"}
              onClick={() => logout()}
              priority="tertiary no outline"
              iconId="fr-icon-logout-box-r-line"
            >
              <Typography
                sx={{
                  display: { xs: "none", xl: "inline" },
                }}
              >
                Déconnexion
              </Typography>
            </Button>
          </Flex>
        ) : (
          <Center zIndex="1150" position="absolute" top="0" right="24px" height="100%">
            <Box mr="24px">
              <StatusBadge noProvider={noProvider} />
            </Box>
            <Button
              sx={{
                "::before": { width: "24px", height: "24px" },
                p: 0,
              }}
              iconId="ri-menu-fill"
              priority="tertiary no outline"
              nativeButtonProps={{
                onClick: () => menuActor.send({ type: "OPEN" }),
                type: "button",
              }}
            >
              {null}
            </Button>
          </Center>
        )}
      </Flex>
    </>
  );
};

export const StatusBadge = ({ noProvider }: { noProvider?: boolean }) => {
  const status = noProvider ? null : useStatus();

  if (noProvider) {
    return (
      <Badge small as="span" noIcon severity="info">
        Beta
      </Badge>
    );
  }

  const getTimeSinceLastSync = () => {
    const now = Date.now();
    const lastSync = status?.lastSyncedAt ? new Date(status.lastSyncedAt).getTime() : null;

    if (!lastSync) return -1;

    return Math.floor((now - lastSync) / 1000);
  };

  const timeSinceLastSync = getTimeSinceLastSync();

  const isConnected = status?.connected || timeSinceLastSync < 180;

  return (
    <Badge small as="span" noIcon severity={status ? (isConnected ? "success" : "error") : "success"}>
      {status ? (isConnected ? "En ligne" : "Hors ligne") : "Beta"}
    </Badge>
  );
};

const modalContents: Record<MenuStates, (props: ModalContentProps) => ReactNode> = {
  main: (_props) => <MenuActions />,
  help: (_props) => <HelpMenu />,
  clauses: (_props) => <ClauseMenu />,
  closed: () => null,
};

const SearchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Flex bgcolor="white" flexDirection="column" width="100%" height="100%" p="16px">
        <Flex justifyContent="flex-end" mb="8px">
          <ModalCloseButton onClose={onClose} />
        </Flex>
        <ReportSearch
          inputProps={{
            placeholder: "Rechercher",
            className: "",
            id: "search-input",
            type: "text",
          }}
        />
      </Flex>
    </Modal>
  );
};

export const MenuModal = () => {
  const menu = useSelector(menuActor, (state) => state.value);
  const isDesktop = useIsDesktop();

  const Content = modalContents[menu] ?? null;

  const isPopoverOpen = menu === "main" && isDesktop;
  const isModalOpen = !isPopoverOpen && menu !== "closed";

  return (
    <Drawer open={isModalOpen} onClose={() => menuActor.send({ type: "CLOSE" })} anchor="right">
      <Box
        zIndex="1300 !important"
        width={{ xs: "100vw", lg: "800px" }}
        px={{ xs: 0, lg: "64px" }}
        pt={{ xs: "16px", lg: 0 }}
      >
        <Content backButtonOnClick={() => menuActor.send({ type: "BACK" })} />
      </Box>
    </Drawer>
  );
};

export type ModalContentProps = {
  backButtonOnClick: () => void;
};

// const Modal = ({ isOpen, onClose, children }: PropsWithChildren & { isOpen: boolean; onClose: () => void }) => {
//   useEffect(() => {
//     const root = document.getElementById("root")!;

//     if (isOpen) {
//       root.style.pointerEvents = "none";
//       root.style.overflow = "hidden";
//     } else {
//       root.style.pointerEvents = "auto";
//       root.style.overflow = "auto";
//     }

//     return () => {
//       root.style.pointerEvents = "auto";
//       root.style.overflow = "auto";
//     };
//   }, [isOpen]);

//   return (
//     <Box
//       onClick={onClose}
//       bgcolor="rgba(0,0,0,0.5)"
//       sx={{
//         pointerEvents: "auto",
//       }}
//       display={isOpen ? "flex" : "none"}
//       zIndex="1800"
//       position="fixed"
//       top="0"
//       left="0"
//       right="0"
//       bottom="0"
//       justifyContent={{ xs: "center", lg: "flex-end" }}
//       alignItems="flex-start"
//       height="100vh"
//     >
//       <Box
//         component="dialog"
//         onClick={(e) => e.stopPropagation()}
//         open={isOpen}
//         bgcolor="white"
//         sx={{
//           pointerEvents: "auto",
//           outline: "none !important",
//           overflowY: "auto",
//         }}
//         position="relative"
//         width={{ xs: "full", lg: "800px" }}
//         height="full"
//         m="0"
//         px={{ xs: 0, lg: "64px" }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };
