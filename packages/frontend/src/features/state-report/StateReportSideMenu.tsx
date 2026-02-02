import { Button, Input } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Drawer, Stack, Typography } from "@mui/material";
import { getRouteApi } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useSpeechToTextV2 } from "../audio-record/SpeechRecorder.hook";
import { MenuTitle } from "../menu/MenuTitle";
import { useIsStateReportDisabled, useStateReportFormContext } from "./utils";
import { StateReportAlertsMenu } from "./alerts/StateReportAlertsMenu";

export const StateReportSideMenu = () => {
  const [sideMenu, setSideMenu] = useState<MenuStates>("closed");
  const onClose = () => setSideMenu("closed");

  const form = useStateReportFormContext();

  const referencePop = form.watch("reference_pop");
  if (!referencePop) return null;

  return (
    <>
      <MenuModal menu={sideMenu} onClose={onClose} />
      <Stack mt={{ xs: "16px", lg: "0" }} gap="8px" flexDirection={{ xs: "row", lg: "column" }}>
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
export type StateReportAlertModalContentProps = {
  onClose: () => void;
};

const modalContents: Record<MenuStates, (props: StateReportAlertModalContentProps) => ReactNode> = {
  alerts: (props) => <StateReportAlertsMenu {...props} />,
  notes: (props) => <StateReportNotesMenu {...props} />,
  closed: () => null,
};

const StateReportNotesMenu = ({ onClose }: StateReportAlertModalContentProps) => {
  const form = useStateReportFormContext();
  const isFormDisabled = useIsStateReportDisabled();

  const value = useWatch({ control: form.control, name: "notes" });
  const setValue = (val: string) => form.setValue("notes", val);

  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      setValue(form.getValues("notes") + " " + text);
    },
  });

  const isIdleProps = form.register("notes");
  const isListeningProps = {
    ...isIdleProps,
    value: value + " " + transcript,
    onChange: () => {},
  };
  const textAreaProps = isRecording ? isListeningProps : isIdleProps;

  return (
    <Stack px={{ xs: "16px", lg: 0 }}>
      <MenuTitle hideDivider onClose={onClose}>
        Notes
      </MenuTitle>
      <Typography mb="24px">Ces notes n’apparaîtront pas dans le document envoyé pour le constat d’état.</Typography>
      <Stack
        flexWrap="wrap"
        flexDirection="row"
        sx={{
          ".fr-tile__content": { paddingBottom: "0 !important" },
        }}
      >
        <Input
          sx={{ width: "100%" }}
          textArea
          label=""
          nativeTextAreaProps={{
            ...textAreaProps,
            rows: 10,
          }}
          disabled={(isFormDisabled || isRecording) ?? false}
        />

        <Flex justifyContent="space-between" alignItems="center" mt="-8px" width="100%">
          <Button
            disabled={isFormDisabled}
            type="button"
            priority={isRecording ? "primary" : "tertiary"}
            iconId="ri-mic-fill"
            onClick={() => toggle()}
          >
            {isRecording ? <>En cours</> : <>Dicter</>}
          </Button>
          <Typography fontSize="12px">Sauvegarde automatique.</Typography>
        </Flex>
      </Stack>
    </Stack>
  );
};
