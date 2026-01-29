import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { Badge, Button, Input, Tile } from "#components/MUIDsfr.tsx";
import { getDiff } from "#components/SyncForm.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Box, Dialog, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import useDebounce from "react-use/lib/useDebounce";
import { v4, v7 } from "uuid";
import { useLiveUser, useUser } from "../../../contexts/AuthContext";
import { VisitedSection } from "../../../db/AppSchema";
import { attachmentQueue, attachmentStorage, db, useDbQuery } from "../../../db/db";
import { ModalCloseButton } from "../../menu/MenuTitle";
import { UploadImageModal, UploadImageWithEditModal } from "../../upload/UploadImageButton";
import { PictureThumbnail, processImage } from "../../upload/UploadReportImage";
import { defaultSections } from "@cr-vif/pdf/constat";
import { useSpeechToTextV2 } from "../../audio-record/SpeechRecorder.hook";
import { useIsStateReportDisabled } from "../utils";
import { MinimalAttachment, UploadImage } from "../../upload/UploadImage";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { fr } from "@codegouvfr/react-dsfr";

const routeApi = getRouteApi("/constat/$constatId");
export const ConstatDetaille = () => {
  const { constatId } = routeApi.useParams();
  const sectionsQuery = useDbQuery(
    db.selectFrom("visited_section").selectAll().where("state_report_id", "=", constatId),
  );

  return (
    <Stack mb={{ xs: "40px", lg: "80px" }} px="16px" pl={{ xs: "16px", lg: "64px" }} pt={{ xs: "16px", lg: "44px" }}>
      <Typography variant="h6" mb="32px" display={{ xs: "none", lg: "block" }}>
        Constat détaillé
      </Typography>
      <Typography fontSize="14px" mb="16px">
        Renseignez vos observations pour chaque partie visitée. À défaut, chacune sera notée comme non-visitée.
      </Typography>

      <SectionsList visitedSections={sectionsQuery.data} />
    </Stack>
  );
};

const SectionsList = ({ visitedSections }: { visitedSections: VisitedSection[] }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<VisitedSection["id"] | null>(null);
  const user = useUser();
  const constatId = routeApi.useParams().constatId;

  const isDisabled = useIsStateReportDisabled();

  const selectSectionMutation = useMutation({
    mutationFn: async (section: string) => {
      const existing = visitedSections?.find((vs) => vs.section === section);
      if (existing) {
        setSelectedSectionId(existing.id);
        return;
      }
      const newSection = await db
        .insertInto("visited_section")
        .values({
          id: v4(),
          state_report_id: constatId,
          section,
          etat_general: "",
          proportion_dans_cet_etat: "",
          commentaires: "",
          service_id: user!.service_id,
        })
        .returningAll()
        .execute();
      if (!newSection[0]) return;
      setSelectedSectionId(newSection[0].id);
    },
  });

  const selectedSection = visitedSections?.find((vs) => vs.id === selectedSectionId) || null;

  return (
    <Stack gap="8px" flexWrap="wrap" flexDirection="row">
      <SectionModal
        isDisabled={isDisabled}
        selectedSection={selectedSection}
        onClose={() => setSelectedSectionId(null)}
      />
      {defaultSections.map((section) => {
        const visited = visitedSections?.find((vs) => vs.section === section);
        const isVisited = visited && (visited.etat_general || visited.commentaires || visited.proportion_dans_cet_etat);
        return (
          <SectionItem
            key={section}
            isVisited={!!isVisited}
            section={section}
            onClick={() => {
              selectSectionMutation.mutate(section);
            }}
          />
        );
      })}
    </Stack>
  );
};

export const SectionItem = ({
  section,
  isVisited,
  details,
  onClick,
  withIcon,
}: {
  section: string;
  isVisited?: boolean;
  details?: string;
  withIcon?: boolean;
  onClick: (section: string) => void;
}) => {
  const isDisabled = useIsStateReportDisabled();

  return (
    <Tile
      disabled={isDisabled && !isVisited}
      detail={details}
      title={
        <Flex alignItems="center" flexDirection="column">
          {isVisited ? (
            <Badge severity="success" sx={{ mb: "8px" }}>
              Renseigné
            </Badge>
          ) : null}
          <Box fontSize="16px">{section}</Box>
        </Flex>
      }
      buttonProps={{
        onClick: () => onClick(section),
      }}
      noIcon={!withIcon}
      sx={{
        width: { xs: "100%", lg: "48%" },
        py: isVisited ? "16px" : undefined,
      }}
    />
  );
};

const SectionModal = ({
  selectedSection,
  onClose,
  isDisabled,
}: {
  selectedSection: VisitedSection | null;
  onClose: () => void;
  isDisabled: boolean;
}) => {
  return (
    <Dialog
      open={selectedSection !== null}
      sx={{
        ".MuiPaper-root": {
          overflowY: "auto",
          maxHeight: { xs: "unset", lg: "calc(100% - 64px)" },
          maxWidth: { xs: "unset", lg: "750px" },
          width: { xs: "100%", lg: "926px" },
          height: { xs: "100%", lg: "unset" },
          margin: { xs: "0", lg: undefined },
        },
      }}
    >
      <Box p={{ xs: "16px" }}>
        <ModalCloseButton onClose={onClose} />

        <DialogTitle
          flex="1"
          sx={{
            paddingLeft: { xs: "0", lg: "16px" },
          }}
          whiteSpace="wrap"
        >
          {selectedSection?.section}
        </DialogTitle>

        {selectedSection ? (
          <Stack gap="16px" px={{ xs: "0", lg: "16px" }}>
            <SectionForm visitedSection={selectedSection} isDisabled={isDisabled} />
            <FullWidthButton disabled={isDisabled} onClick={() => onClose()}>
              Enregistrer
            </FullWidthButton>
          </Stack>
        ) : null}
      </Box>
    </Dialog>
  );
};

const SectionForm = ({ visitedSection, isDisabled }: { visitedSection: VisitedSection; isDisabled: boolean }) => {
  const [values, setValues] = useState(visitedSection);

  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      const currentValue = values.commentaires || "";
      setValues({ ...values, commentaires: currentValue + " " + text });
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (Object.keys(diff).length === 0) {
        return;
      }

      await db
        .updateTable("visited_section")
        .set({
          etat_general: values.etat_general,
          proportion_dans_cet_etat: values.proportion_dans_cet_etat,
          commentaires: values.commentaires,
        })
        .where("id", "=", visitedSection.id)
        .returningAll()
        .execute();
    },
  });

  const diff = getDiff(visitedSection, values);
  useDebounce(() => syncMutation.mutate(), 500, [diff]);

  const isIdleProps = {
    value: values.commentaires || "",
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValues({ ...values, commentaires: e.target.value });
    },
  };
  const isListeningProps = {
    ...isIdleProps,
    value: values.commentaires + " " + transcript,
    onChange: () => {},
  };

  const textAreaProps = isRecording ? isListeningProps : isIdleProps;

  return (
    <Stack>
      <SectionEtatGeneralRadioButtons
        section={values}
        onChange={(label) => setValues({ ...values, etat_general: label })}
        disabled={isDisabled}
      />
      <SectionProportionsRadioButtons
        section={values}
        onChange={(label) => setValues({ ...values, proportion_dans_cet_etat: label })}
        disabled={isDisabled}
      />

      <SectionImageUpload section={visitedSection} isDisabled={isDisabled} />

      <Flex flexDirection="column" mt="24px">
        <Input
          sx={{ mb: "16px !important" }}
          textArea
          disabled={isDisabled || isRecording}
          label="Commentaires"
          nativeTextAreaProps={{
            rows: 6,
            ...textAreaProps,
          }}
        />
        {isDisabled ? null : (
          <Button
            type="button"
            priority={isRecording ? "primary" : "tertiary"}
            iconId="ri-mic-fill"
            onClick={() => toggle()}
          >
            {isRecording ? <>En cours</> : <>Dicter</>}
          </Button>
        )}
      </Flex>
    </Stack>
  );
};

const SectionImageUpload = ({ section, isDisabled }: { section: VisitedSection; isDisabled: boolean }) => {
  const [selectedAttachment, setSelectedAttachment] = useState<MinimalAttachment | null>(null);
  const { constatId } = routeApi.useParams();
  const user = useLiveUser()!;

  const sectionAttachmentQuery = useDbQuery(
    db
      .selectFrom("visited_section_attachment")
      .selectAll()
      .where("visited_section_id", "=", section.id)
      .where("is_deprecated", "=", 0)
      .orderBy("created_at", "asc"),
  );

  const sectionAttachments = sectionAttachmentQuery.data || [];

  const onClose = () => setSelectedAttachment(null);
  const onEdit = (image: { id: string; url: string }) => setSelectedAttachment(image);
  const onDelete = async (section: { id: string }) => {
    await attachmentStorage.deleteFile(section.id);
    await db.updateTable("visited_section_attachment").set({ is_deprecated: 1 }).where("id", "=", section.id).execute();
  };

  const addSectionAttachmentMutation = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const processedFile = await processImage(file);
      const attachmentId = `${constatId}/images/${v7()}.jpg`;
      await attachmentQueue.saveAttachment({
        attachmentId,
        buffer: processedFile,
        mediaType: "image/jpeg",
      });

      await db
        .insertInto("visited_section_attachment")
        .values({
          id: attachmentId,
          visited_section_id: section.id,
          attachment_id: attachmentId,
          label: "",
          service_id: user.service_id,
          created_at: new Date().toISOString(),
          is_deprecated: 0,
        })
        .execute();

      return attachmentId;
    },
  });

  const onLabelChange = async (attachmentId: string, newLabel: string) => {
    await db
      .updateTable("visited_section_attachment")
      .set({ label: newLabel })
      .where("id", "=", attachmentId)
      .execute();
  };

  return (
    <Box width="100%">
      <UploadImageModal
        selectedAttachment={selectedAttachment}
        onClose={onClose}
        imageTable="visited_section_attachment"
        onSave={({ id, label }) => onLabelChange(id, label || "")}
      />

      <UploadImage
        onFiles={async (files) => addSectionAttachmentMutation.mutateAsync({ file: files[0] })}
        multiple
        attachments={sectionAttachments}
        onClick={(a) => setSelectedAttachment(a!)}
        onDelete={(section) => onDelete(section)}
        isDisabled={isDisabled}
      />
    </Box>
  );
};

const SectionEtatGeneralRadioButtons = ({
  section,
  onChange,
  disabled,
}: {
  section: VisitedSection;
  onChange: (label: string) => void;
  disabled: boolean;
}) => {
  const options = ["Bon", "Moyen", "Mauvais", "Péril"].map((label) => ({
    label,
    nativeInputProps: {
      checked: section.etat_general === label,
      onChange: () => onChange(label),
    },
  }));
  const isDesktop = useIsDesktop();
  return (
    <RadioButtons
      orientation={isDesktop ? "horizontal" : "vertical"}
      legend="État général"
      options={options}
      disabled={disabled}
    />
  );
};

const SectionProportionsRadioButtons = ({
  section,
  onChange,
  disabled,
}: {
  section: VisitedSection;
  onChange: (label: string) => void;
  disabled: boolean;
}) => {
  const options = ["50%", "60%", "70%", "80%", "90%", "100%"].map((label) => ({
    label,
    nativeInputProps: {
      checked: section.proportion_dans_cet_etat === label,
      onChange: () => onChange(label),
    },
  }));
  const isDesktop = useIsDesktop();
  return (
    <RadioButtons
      orientation={isDesktop ? "horizontal" : "vertical"}
      legend="Proportion dans cet état"
      options={options}
      disabled={disabled}
    />
  );
};
