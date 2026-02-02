import { Box, Drawer, Stack, Typography } from "@mui/material";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { useIsStateReportDisabled, useStateReportFormContext } from "./utils";
import { ReactNode, useId, useState } from "react";
import { EmailInput } from "#components/EmailInput.tsx";
import { MenuTitle, ModalBackButton } from "../menu/MenuTitle";
import { SectionItem } from "./steps/ConstatDetaille";
import { fr } from "@codegouvfr/react-dsfr";
import { useLiveService, useLiveUser, useService } from "../../contexts/AuthContext";
import { useSpeechToTextV2 } from "../audio-record/SpeechRecorder.hook";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { useMutation } from "@tanstack/react-query";
import { attachmentQueue, attachmentStorage, db, useDbQuery } from "../../db/db";
import { v7 } from "uuid";
import { getRouteApi } from "@tanstack/react-router";
import { StateReportAlert } from "../../db/AppSchema";
import { Spinner } from "#components/Spinner.tsx";
import { MinimalAttachment, UploadImage } from "../upload/UploadImage";
import { UploadImageModal } from "../upload/UploadImageButton";
import { processImage } from "../upload/UploadReportImage";
import { alertSections } from "@cr-vif/pdf/constat";
import { OBJETS_MOBILIERS_SECTION, ObjetsEtMobiliersPage } from "./alerts/ObjetEtMobilier";
import { SectionCommentaires, SectionPhotos, ShowInReportToggle } from "./alerts/SectionCommentaires";

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
type ModalContentProps = {
  onClose: () => void;
};

const modalContents: Record<MenuStates, (props: ModalContentProps) => ReactNode> = {
  alerts: (props) => <StateReportAlertsMenu {...props} />,
  notes: (props) => <StateReportNotesMenu {...props} />,
  closed: () => null,
};

export const useStateReportAlerts = (constatId: string) => {
  return useDbQuery(db.selectFrom("state_report_alert").where("state_report_id", "=", constatId).selectAll());
};

export const useStateReportAlertsWithEmail = (constatId: string) => {
  const alertsQuery = useStateReportAlerts(constatId);
  const alerts = alertsQuery.data ?? [];

  const service = useLiveService();

  const populatedAlerts = alerts
    .map((alert) => {
      if (alert.email) {
        return { ...alert, email: String(alert.email) };
      }
      const emailKey = "courriel_" + (alert?.alert ?? "").toLowerCase();
      const emailRaw = service?.[emailKey as keyof typeof service] ?? "";
      const email = String(emailRaw || "");

      return { ...alert, email };
    })
    .sort((a, b) => a.alert!.localeCompare(b.alert!));

  return { ...alertsQuery, data: populatedAlerts };
};

const StateReportAlertsMenu = ({ onClose }: ModalContentProps) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const { constatId } = routeApi.useParams();
  const existingSectionsQuery = useStateReportAlerts(constatId);
  const service = useLiveService();

  const existingSections = existingSectionsQuery.data ?? [];
  const existingSectionNames = existingSections.map((s) => s.alert);

  const objetsMobiliersCount = existingSections.filter((s) => s.alert === OBJETS_MOBILIERS_SECTION).length;

  const createAlertMutation = useMutation({
    mutationFn: async (sectionTitle: string) => {
      if (existingSectionNames.includes(sectionTitle)) {
        return;
      }

      const sectionData = alertSections.find((s) => s.title === sectionTitle);
      const emailKey = "courriel_" + (sectionData?.details ?? "").toLowerCase();
      const emailRaw = service?.[emailKey as keyof typeof service] ?? "";
      const email = String(emailRaw || "") || null;

      await db
        .insertInto("state_report_alert")
        .values({
          id: v7(),
          alert: sectionTitle,
          state_report_id: constatId,
          commentaires: "",
          show_in_report: 0,
          service_id: service?.id ?? null,
          email,
        })
        .execute();
    },
    onSuccess: (_, sectionTitle) => {
      setSelectedSection(sectionTitle);
    },
  });

  const handleSectionClick = (title: string) => {
    if (title === OBJETS_MOBILIERS_SECTION) {
      setSelectedSection(title);
    } else if (existingSectionNames.includes(title)) {
      setSelectedSection(title);
    } else {
      createAlertMutation.mutate(title);
    }
  };

  if (selectedSection === OBJETS_MOBILIERS_SECTION) {
    return (
      <ObjetsEtMobiliersPage
        onClose={onClose}
        onBack={() => setSelectedSection(null)}
        items={existingSections
          .filter((s) => s.alert === OBJETS_MOBILIERS_SECTION)
          .sort((a, b) => a.id.localeCompare(b.id))}
        isLoading={existingSectionsQuery.isLoading}
      />
    );
  }

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
          alertSections.map(({ title, details }) => {
            const isObjetsMobiliers = title === OBJETS_MOBILIERS_SECTION;
            const displayDetails =
              isObjetsMobiliers && objetsMobiliersCount > 0 ? `${details} (${objetsMobiliersCount})` : details;
            const isVisited = isObjetsMobiliers ? objetsMobiliersCount > 0 : existingSectionNames.includes(title);

            return (
              <SectionItem
                key={title}
                withIcon
                section={title}
                details={displayDetails}
                isVisited={isVisited}
                onClick={() => handleSectionClick(title)}
              />
            );
          })
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
  const service = useLiveService();
  const isFormDisabled = useIsStateReportDisabled();

  const sectionStaticData = alertSections.find((s) => s.title === section);

  const emailKey = "courriel_" + (sectionStaticData?.details ?? "").toLowerCase();
  const emailRaw = service?.[emailKey as keyof typeof service] ?? "";
  const email = String(emailRaw || "");

  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Use saved email if it exists (even if empty), otherwise fall back to service email
  const savedEmail = fullSection?.email != null ? String(fullSection.email) : String(email || "");
  const [editedEmails, setEditedEmails] = useState<string[]>([]);

  const displayEmails = isEditingEmail
    ? editedEmails
    : savedEmail
      ? savedEmail
          .split(",")
          .map((e: string) => e.trim())
          .filter(Boolean)
      : [];

  const startEditingEmail = () => {
    setEditedEmails(
      savedEmail
        ? savedEmail
            .split(",")
            .map((e: string) => e.trim())
            .filter(Boolean)
        : [],
    );
    setIsEditingEmail(true);
  };

  const updateEmailMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      if (!fullSection?.id) return;
      const emailString = emails.join(", ");
      await db.updateTable("state_report_alert").where("id", "=", fullSection.id).set({ email: emailString }).execute();
    },
  });

  const handleEmailChange = (emails: string[]) => {
    setEditedEmails(emails);
    updateEmailMutation.mutate(emails);
  };

  const createOrUpdateAlertMutation = useMutation({
    mutationFn: async ({ commentaires, show_in_report }: SectionForm) => {
      const showInReportValue = show_in_report ? 1 : 0;
      if (fullSection) {
        await db
          .updateTable("state_report_alert")
          .where("id", "=", fullSection.id)
          .set({ commentaires, show_in_report: showInReportValue })
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
          show_in_report: showInReportValue,
          service_id: service?.id ?? null,
          email: email || null,
        })
        .execute();
    },
  });

  const form = useForm<SectionForm>({
    defaultValues: { commentaires: fullSection?.commentaires ?? "", show_in_report: !!fullSection?.show_in_report },
  });

  return (
    <Stack
      component="form"
      sx={{ px: { xs: "16px", lg: 0 }, pb: { xs: "32px", lg: 0 } }}
      onSubmit={form.handleSubmit((values) => createOrUpdateAlertMutation.mutate(values))}
      id={formId}
    >
      <MenuTitle onClose={onClose} hideDivider>
        <ModalBackButton onClick={onBack} />
      </MenuTitle>

      <Typography fontSize="16px" fontWeight="bold">
        Alerte : {section}
      </Typography>
      <Typography mt="8px" fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
        Service destinataire : {sectionStaticData?.details}
      </Typography>

      {isEditingEmail ? (
        <Box mt="16px">
          <EmailInput
            label="Courriels"
            hintText="Ajoutez plusieurs courriels si nécessaire"
            value={displayEmails}
            onValueChange={handleEmailChange}
          />
          <Button type="button" priority="secondary" onClick={() => setIsEditingEmail(false)} sx={{ mt: "8px" }}>
            Fermer
          </Button>
        </Box>
      ) : (
        <Flex alignItems="center" gap="8px" mt="8px">
          <Typography fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
            {savedEmail || "Aucun courriel configuré"}
          </Typography>
          {!isFormDisabled && (
            <Button
              type="button"
              priority="tertiary no outline"
              onClick={startEditingEmail}
              sx={{ minHeight: "auto", padding: "0 8px" }}
            >
              Modifier
            </Button>
          )}
        </Flex>
      )}

      <SectionCommentaires form={form} />

      <SectionPhotos
        alertId={fullSection?.id}
        section={section}
        constatId={constatId}
        form={form}
        isDisabled={isFormDisabled}
      />

      <Divider my="16px" />

      <ShowInReportToggle form={form} />

      <FullWidthButton
        type="submit"
        nativeButtonProps={{ form: formId }}
        disabled={isFormDisabled}
        style={{ marginTop: "16px" }}
      >
        Enregistrer
      </FullWidthButton>
    </Stack>
  );
};

type Form = UseFormReturn<SectionForm>;

const StateReportNotesMenu = ({ onClose }: ModalContentProps) => {
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
        Alertes
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
