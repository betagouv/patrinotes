import { Box, Drawer, Stack } from "@mui/material";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { Button } from "#components/MUIDsfr.tsx";
import { useStateReportFormContext } from "./utils";
import { ReactNode, useState } from "react";

export const StateReportSideMenu = () => {
  const [sideMenu, setSideMenu] = useState<MenuStates>("closed");
  const onClose = () => setSideMenu("closed");

  const form = useStateReportFormContext();

  const referencePop = form.watch("reference_pop");
  if (!referencePop) return null;

  return (
    <>
      <MenuModal menu={sideMenu} onClose={onClose} />
      <Stack spacing="8px">
        <Button
          priority="secondary"
          onClick={() => setSideMenu("alerts")}
          sx={{ width: "254px", justifyContent: "center" }}
          iconId="ri-alarm-warning-fill"
        >
          Alertes
        </Button>
        <Button
          priority="secondary"
          onClick={() => setSideMenu("notes")}
          sx={{ width: "254px", justifyContent: "center" }}
          iconId="ri-draft-fill"
        >
          Notes
        </Button>
      </Stack>
    </>
  );
};

export const MenuModal = ({ menu, onClose }: { menu: MenuStates; onClose: () => void }) => {
  const Content = modalContents[menu] ?? null;
  const isModalOpen = menu !== "closed";

  return (
    <Drawer open={isModalOpen} onClose={onClose} anchor="right">
      <Box
        zIndex="1300 !important"
        width={{ xs: "100vw", lg: "800px" }}
        px={{ xs: 0, lg: "64px" }}
        pt={{ xs: "16px", lg: 0 }}
      >
        <Content onClose={onClose} />
      </Box>
    </Drawer>
  );
};

type MenuStates = "closed" | "notes" | "alerts";
type ModalContentProps = {
  onClose: () => void;
};

const modalContents: Record<MenuStates, (props: ModalContentProps) => ReactNode> = {
  alerts: (props) => <StateReportAlertsMenu {...props} />,
  notes: (props) => <StateReportNotesMenu {...props} />,
  closed: () => null,
};

const StateReportAlertsMenu = ({ onClose }: ModalContentProps) => {
  return null;
};

const StateReportNotesMenu = ({ onClose }: ModalContentProps) => {
  return null;
};
