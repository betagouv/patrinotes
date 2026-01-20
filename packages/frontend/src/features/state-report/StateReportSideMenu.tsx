import { Box, Drawer, Stack, Typography } from "@mui/material";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { useStateReportFormContext } from "./utils";
import { ReactNode, useId, useState } from "react";
import { MenuTitle, ModalBackButton } from "../menu/MenuTitle";
import { SectionItem } from "./steps/ConstatDetaille";
import { fr } from "@codegouvfr/react-dsfr";
import { useLiveUser, useService, useUser } from "../../contexts/AuthContext";
import { useSpeechToTextV2 } from "../audio-record/SpeechRecorder.hook";
import { useForm, useWatch } from "react-hook-form";
import { useIsFormDisabled } from "../DisabledContext";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { useMutation } from "@tanstack/react-query";
import { db, useDbQuery } from "../../db/db";
import { v7 } from "uuid";
import { getRouteApi } from "@tanstack/react-router";
import { StateReportAlert } from "../../db/AppSchema";
import { Spinner } from "#components/Spinner.tsx";

export const StateReportSideMenu = () => {
  const [sideMenu, setSideMenu] = useState<MenuStates>("closed");
  const onClose = () => setSideMenu("closed");

  const form = useStateReportFormContext();

  const referencePop = form.watch("reference_pop");
  if (!referencePop) return null;

  // TODO enable this
  return null;

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
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { constatId } = routeApi.useParams();

  const existingSectionsQuery = useDbQuery(
    db.selectFrom("state_report_alert").where("state_report_id", "=", constatId).selectAll(),
  );

  const existingSections = existingSectionsQuery.data ?? [];
  const existingSectionNames = existingSections.map((s) => s.alert);

  if (selectedSection) {
    return (
      <SelectedSection
        fullSection={existingSections.find((s) => s.alert === selectedSection)}
        section={selectedSection}
        onClose={onClose}
        onBack={() => setSelectedSection(null)}
      />
    );
  }

  return (
    <Stack px={{ xs: "16px", lg: 0 }}>
      <MenuTitle hideDivider onClose={onClose}>
        Alertes
      </MenuTitle>
      <Typography mb="24px">
        Vous avez remarqué un problème lié au monument historique ?<br />
        Signalez une alerte auprès du service concerné :
      </Typography>
      <Stack
        gap="8px"
        flexWrap="wrap"
        flexDirection="row"
        sx={{
          ".fr-tile__content": { paddingBottom: "0 !important" },
        }}
      >
        {existingSectionsQuery.isLoading ? (
          <Box mt="24px">
            <Spinner />
          </Box>
        ) : (
          sections.map(({ title, details }) => (
            <SectionItem
              key={title}
              withIcon
              section={title}
              details={details}
              isVisited={existingSectionNames.includes(title)}
              onClick={() => setSelectedSection(title)}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
};

const routeApi = getRouteApi("/constat/$constatId");

type SectionForm = {
  commentaires: string;
  show_in_report: boolean;
};

const SelectedSection = ({
  section,
  onClose,
  onBack,
  fullSection,
}: {
  section: string;
  onClose: () => void;
  onBack: () => void;
  fullSection: StateReportAlert | undefined;
}) => {
  const formId = useId();
  const { constatId } = routeApi.useParams();
  const service = useService();

  const createOrUpdateAlertMutation = useMutation({
    mutationFn: async ({ commentaires, show_in_report }: SectionForm) => {
      if (fullSection) {
        await db
          .updateTable("state_report_alert")
          .where("id", "=", fullSection.id)
          .set({ commentaires, show_in_report })
          .execute();
        return;
      }

      await db
        .insertInto("state_report_alert")
        .values({
          id: v7(),
          alert: section,
          state_report_id: constatId,
          commentaires: commentaires,
          show_in_report: show_in_report,
          service_id: service?.id ?? null,
        })
        .execute();
    },
  });

  const form = useForm<SectionForm>({
    defaultValues: { commentaires: fullSection?.commentaires ?? "", show_in_report: !!fullSection?.show_in_report },
  });

  const sectionStaticData = sections.find((s) => s.title === section);

  const emailKey = "courriel_" + (sectionStaticData?.details ?? "").toLowerCase();
  const email = service?.[emailKey as keyof typeof service] ?? "";

  return (
    <Stack
      component="form"
      onSubmit={form.handleSubmit((values) => createOrUpdateAlertMutation.mutate(values))}
      id={formId}
    >
      <MenuTitle onClose={onClose} hideDivider>
        <ModalBackButton onClick={onBack} />
      </MenuTitle>

      <Typography fontSize="16px" fontWeight="bold">
        Alerte : {section}
        {email ? (
          <>
            <br />
            {email}
          </>
        ) : null}
      </Typography>
      <Typography mt="8px" fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
        Service destinataire : {fullSection?.details}
      </Typography>

      <SectionCommentaires form={form} />
      <Divider my="16px" />

      <ShowInReportToggle form={form} />

      <FullWidthButton type="submit" form={formId} style={{ marginTop: "16px" }}>
        Enregistrer
      </FullWidthButton>
    </Stack>
  );
};

const ShowInReportToggle = ({ form }) => {
  const value = useWatch({ control: form.control, name: "show_in_report" });
  const setValue = (val: boolean) => form.setValue("show_in_report", val);

  return (
    <ToggleSwitch
      inputTitle="Afficher dans le rapport"
      showCheckedHint={false}
      onChange={setValue}
      checked={value}
      label="Afficher dans le rapport"
    />
  );
};

const SectionCommentaires = ({ form }) => {
  const isFormDisabled = useIsFormDisabled();

  const value = useWatch({ control: form.control, name: "commentaires" });
  const setValue = (val: string) => form.setValue("commentaires", val);

  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      setValue(form.getValues("commentaires") + " " + text);
    },
  });

  const isIdleProps = form.register("commentaires");
  const isListeningProps = {
    ...isIdleProps,
    value: value + " " + transcript,
    onChange: () => {},
  };
  const textAreaProps = isRecording ? isListeningProps : isIdleProps;

  return (
    <Stack>
      <Input
        sx={{ mt: "16px" }}
        disabled={(isFormDisabled || isRecording) ?? false}
        label="Commentaires"
        textArea
        nativeTextAreaProps={{ ...textAreaProps, rows: 5 }}
      />
      <Flex justifyContent="space-between" mt="-8px">
        <Button
          disabled={isFormDisabled}
          type="button"
          priority={isRecording ? "primary" : "tertiary"}
          iconId="ri-mic-fill"
          onClick={() => toggle()}
        >
          {isRecording ? <>En cours</> : <>Dicter</>}
        </Button>
      </Flex>
    </Stack>
  );
};

const sections = [
  { title: "Edifice en péril", details: "CRMH" },
  { title: "Abords de l'édifice", details: "UDAP" },
  { title: "Objets et mobiliers", details: "CAOA" },
  { title: "Archéologie", details: "SRA" },
  { title: "Site classé ou inscrit", details: "DREAL" },
  { title: "Biodiversité", details: "OFB" },
  { title: "Sécurité", details: "Mairie" },
];

const StateReportNotesMenu = ({ onClose }: ModalContentProps) => {
  return null;
};
