import { Box, BoxProps, Stack, Typography } from "@mui/material";
import { StateReportFormType, useStateReportFormContext } from "../utils";
import { UseFormReturn, useWatch } from "react-hook-form";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { v7 } from "uuid";
import { PictureThumbnail, processImage } from "../../upload/UploadReportImage";
import { attachmentQueue, attachmentStorage, db } from "../../../db/db";
import { useLiveUser } from "../../../contexts/AuthContext";
import { UploadImageModal, UploadImageWithEditModal } from "../../upload/UploadImageButton";
import { Flex } from "#components/ui/Flex.tsx";
import { StateReport } from "../../../db/AppSchema";
import { useRef, useState } from "react";
import { useSpeechToTextV2 } from "../../audio-record/SpeechRecorder.hook";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { fr } from "@codegouvfr/react-dsfr";
import { deserializePreconisations, serializePreconisations } from "@cr-vif/pdf/constat";
import { MinimalAttachment, UploadImage } from "../../upload/UploadImage";

const routeApi = getRouteApi("/constat/$constatId");

export const ConstatGeneral = () => {
  const form = useStateReportFormContext();

  return (
    <Stack px="16px" pl={{ xs: "16px", lg: "64px" }} pt={{ xs: "16px", lg: "44px" }} mb="16px">
      <Typography variant="h6" mb="32px" display={{ xs: "none", lg: "block" }}>
        Constat général
      </Typography>
      <MandatoryFieldReminder />
      <EtatGeneralRadioButtons />
      <ProportionsRadioButtons />
      <StateReportTextAreaWithSpeechToText label="Commentaire" name="etat_commentaires" mb="40px" />
      <Divider mb={{ xs: "24px", lg: "32px" }} />
      <EtatGeneralImages />
      <Divider my={{ xs: "24px", lg: "32px" }} />
      <Preconisations />
    </Stack>
  );
};

export const MandatoryFieldReminder = () => {
  return (
    <Typography variant="caption" color={fr.colors.decisions.text.mention.grey.default} mb="24px">
      Les champs avec le symbole * sont obligatoires
    </Typography>
  );
};

const StateReportTextAreaWithSpeechToText = ({
  label,
  name,
  ...props
}: { label: string; name: keyof StateReportFormType } & BoxProps) => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: name }) ?? "";
  const setValue = (val: string) => form.setValue(name, val);

  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      const currentValue = form.getValues(name) || "";
      setValue(currentValue + " " + text);
    },
  });

  const isIdleProps = form.register(name);
  const isListeningProps = {
    ...isIdleProps,
    value: value + " " + transcript,
    onChange: () => {},
  };

  const textAreaProps = isRecording ? isListeningProps : isIdleProps;
  return (
    <Flex flexDirection="column" {...props}>
      <Input
        sx={{ mb: "16px !important", "& > textarea": { mt: "0 !important" } }}
        disabled={isRecording}
        label={<Box mb="8px">{label}</Box>}
        textArea
        nativeTextAreaProps={{
          ...textAreaProps,
          rows: 5,
        }}
      />
      <Button
        type="button"
        priority={isRecording ? "primary" : "tertiary"}
        iconId="ri-mic-fill"
        onClick={() => toggle()}
      >
        {isRecording ? <>En cours</> : <>Dicter</>}
      </Button>
    </Flex>
  );
};

const PlanSituation = ({
  setSelectedAttachment,
}: {
  setSelectedAttachment: (attachment: MinimalAttachment | null) => void;
}) => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "plan_situation" });

  const attachmentQuery = useStateReportAttachmentQuery(value);
  const attachment = attachmentQuery.data;

  const addPlanSituationFileMutation = useAddStateReportFileMutation("plan_situation");
  const deletePlanSituationFileMutation = useDeleteAttachmentMutation("plan_situation");

  return (
    <Box flex="1">
      <Typography mb="8px">Plan de situation</Typography>
      <UploadImage
        onFile={async (file: File) => addPlanSituationFileMutation.mutateAsync({ file })}
        attachments={attachment ? [attachment] : []}
        multiple={false}
        onClick={() => setSelectedAttachment(attachment!)}
        onDelete={() => deletePlanSituationFileMutation.mutate(attachment!.id)}
      />
    </Box>
  );
};

const useDeleteAttachmentMutation = (property: keyof StateReport) => {
  const { constatId } = routeApi.useParams();
  return useMutation({
    mutationFn: async (attachmentId: string) => {
      await attachmentStorage.deleteFile(attachmentId);
      await db
        .updateTable("state_report")
        .set({ [property]: null })
        .where("id", "=", constatId)
        .execute();
    },
  });
};

const PlanEdifice = ({
  setSelectedAttachment,
}: {
  setSelectedAttachment: (attachment: MinimalAttachment | null) => void;
}) => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "plan_edifice" });

  const attachmentQuery = useStateReportAttachmentQuery(value);
  const attachment = attachmentQuery.data;

  const addPlanEdificeFileMutation = useAddStateReportFileMutation("plan_edifice");
  const deletePlanEdificeFileMutation = useDeleteAttachmentMutation("plan_edifice");

  return (
    <Box flex="1">
      <Typography mb="8px">Plan de l'édifice</Typography>
      <UploadImage
        onFile={async (file: File) => addPlanEdificeFileMutation.mutateAsync({ file })}
        attachments={attachment ? [attachment] : []}
        multiple={false}
        onClick={() => setSelectedAttachment(attachment!)}
        onDelete={() => deletePlanEdificeFileMutation.mutate(attachment!.id)}
      />
    </Box>
  );
};

const VuesGenerales = ({
  setSelectedAttachment,
}: {
  setSelectedAttachment: (attachment: MinimalAttachment | null) => void;
}) => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "vue_generale" });

  const attachmentQuery = useStateReportAttachmentQuery(value);
  const attachment = attachmentQuery.data;

  const addVueGeneraleFileMutation = useAddStateReportFileMutation("vue_generale");
  const deleteVueGeneraleFileMutation = useDeleteAttachmentMutation("vue_generale");

  return (
    <Box flex="1">
      <Typography mb="8px">Vues générales de l'édifice</Typography>
      <UploadImage
        onFile={async (file: File) => addVueGeneraleFileMutation.mutateAsync({ file })}
        attachments={attachment ? [attachment] : []}
        multiple={false}
        onClick={() => setSelectedAttachment(attachment!)}
        onDelete={() => deleteVueGeneraleFileMutation.mutate(attachment!.id)}
      />
    </Box>
  );
};

const useStateReportAttachmentQuery = (attachmentId: string | null) => {
  return useQuery({
    queryKey: ["attachment", attachmentId],
    queryFn: async () => {
      return db.selectFrom("state_report_attachment").where("id", "=", attachmentId).selectAll().executeTakeFirst();
    },
    enabled: !!attachmentId,
  });
};

const useAddStateReportFileMutation = (property: keyof StateReport) => {
  const { constatId } = routeApi.useParams();
  const form = useStateReportFormContext();
  const user = useLiveUser()!;

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const attachmentId = await uploadFile({ constatId, serviceId: user.service_id!, file });
      form.setValue(property, attachmentId);
      return attachmentId;
    },
  });
};

const EtatGeneralImages = () => {
  const form = useStateReportFormContext();
  const { constatId } = routeApi.useParams();
  const [selectedAttachment, setSelectedAttachment] = useState<MinimalAttachment | null>(null);

  const queryClient = useQueryClient();

  const onEdit = (props: { id: string; url: string }) => {
    setSelectedAttachment(props);
  };

  const onClose = () => {
    setSelectedAttachment(null);
  };

  const onDelete = async (props: { id: string; property: string }) => {
    const { id, property } = props;
    await attachmentStorage.deleteFile(id);
    await db
      .updateTable("state_report")
      .set({ [property]: null })
      .where("id", "=", constatId)
      .execute();
  };

  const onLabelChange = async (attachmentId: string, newLabel: string) => {
    console.log("new label", newLabel);
    await db.updateTable("state_report_attachment").set({ label: newLabel }).where("id", "=", attachmentId).execute();
    await queryClient.invalidateQueries({ queryKey: ["attachment", attachmentId] });
  };

  return (
    <Flex width="100%" flexWrap="wrap" gap={{ xs: "20px", lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }}>
      <UploadImageModal
        selectedAttachment={selectedAttachment}
        onClose={onClose}
        imageTable="state_report_attachment"
        onSave={({ id, label }) => onLabelChange(id, label || "")}
      />
      <PlanSituation setSelectedAttachment={setSelectedAttachment} />
      <PlanEdifice setSelectedAttachment={setSelectedAttachment} />
      <VuesGenerales setSelectedAttachment={setSelectedAttachment} />
    </Flex>
  );
};

const useUpdateImageMutation = ({
  constatId,
  onSuccess,
}: {
  constatId: string;
  onSuccess: (attachmentId: string) => void | Promise<void>;
}) => {
  const user = useLiveUser();
  return useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      for (const file of files) {
        const attachmentId = `${constatId}/images/${v7()}.jpg`;
        const buffer = await processImage(file);

        await attachmentQueue.saveAttachment({
          attachmentId: attachmentId,
          buffer,
          mediaType: "image/jpeg",
        });

        await db
          .insertInto("state_report_attachment")
          .values({
            id: attachmentId,
            attachment_id: attachmentId,
            state_report_id: constatId,
            created_at: new Date().toISOString(),
            is_deprecated: 0,
            service_id: user!.service_id,
          })
          .execute();

        await onSuccess(attachmentId);
      }
    },
  });
};

const uploadFile = async ({ constatId, serviceId, file }: { constatId: string; serviceId: string; file: File }) => {
  const attachmentId = `${constatId}/images/${v7()}.jpg`;
  const buffer = await processImage(file);

  await attachmentQueue.saveAttachment({
    attachmentId: attachmentId,
    buffer,
    mediaType: "image/jpeg",
  });

  await db
    .insertInto("state_report_attachment")
    .values({
      id: attachmentId,
      attachment_id: attachmentId,
      state_report_id: constatId,
      created_at: new Date().toISOString(),
      is_deprecated: 0,
      service_id: serviceId,
    })
    .execute();

  return attachmentId;
};

export const EtatGeneralRadioButtons = () => {
  const form = useStateReportFormContext();

  const isDesktop = useIsDesktop();

  const value = useWatch({ control: form.control, name: "etat_general" });
  const options = ["Bon", "Moyen", "Mauvais", "Péril"].map((label) => ({
    label,
    nativeInputProps: {
      checked: value === label,
      onChange: () => form.setValue("etat_general", label),
    },
  }));

  return (
    <RadioButtons
      orientation={isDesktop ? "horizontal" : "vertical"}
      legend={<Box className="mandatory-field">État général de l'édifice</Box>}
      options={options}
    />
  );
};

const ProportionsRadioButtons = () => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "proportion_dans_cet_etat" });

  const isDesktop = useIsDesktop();

  const options = ["50%", "60%", "70%", "80%", "90%", "100%"].map((label) => ({
    label,
    nativeInputProps: {
      checked: value === label,
      onChange: () => form.setValue("proportion_dans_cet_etat", label),
    },
  }));

  return (
    <RadioButtons
      orientation={isDesktop ? "horizontal" : "vertical"}
      legend={<Box className="mandatory-field">Proportion dans cet état</Box>}
      options={options}
    />
  );
};

const Preconisations = () => {
  const form = useStateReportFormContext();
  const rawValue = useWatch({ control: form.control, name: "preconisations" });

  const commentairesCache = useRef<Record<string, string>>({});

  const value = deserializePreconisations(rawValue);
  const setValue = (formValue: { preconisation: string; commentaire?: string }[]) => {
    form.setValue("preconisations", serializePreconisations(formValue));
  };

  const selectedNames: string[] = value.map((item) => item.preconisation);

  const options = [
    "Étude diagnostique",
    "Travaux d'entretien",
    "Travaux de réparation",
    "Travaux de restauration",
    "Mesures d'urgence",
  ].map((label) => ({
    label,
    nativeInputProps: {
      checked: selectedNames.includes(label),
      onChange: () => {
        if (selectedNames.includes(label)) {
          setValue(value.filter((item) => item.preconisation !== label));
        } else {
          setValue([...value, { preconisation: label, commentaire: commentairesCache.current[label] }]);
        }
      },
    },
  }));
  return (
    <Stack
      sx={{
        ".fr-checkbox-group > label": { p: "0.75rem 0 0px 0" },
        ".fr-fieldset": { marginBottom: 0 },
      }}
    >
      <Box mb="0">Préconisations</Box>
      {options.map((option) => (
        <>
          <Checkbox legend={null} options={[option]} />
          {selectedNames.includes(option.label)
            ? (() => {
                const currentCommentaire = value.find((item) => item.preconisation === option.label)?.commentaire || "";
                return (
                  <Box mb="24px" mt="16px">
                    <Input
                      label="Commentaire"
                      textArea
                      nativeTextAreaProps={{
                        rows: 4,
                        value: currentCommentaire,
                        onChange: (e) => {
                          const newCommentaire = e.target.value;
                          commentairesCache.current[option.label] = newCommentaire;
                          const newValue = value.map((item) =>
                            item.preconisation === option.label ? { ...item, commentaire: newCommentaire } : item,
                          );
                          setValue(newValue);
                        },
                      }}
                    />
                  </Box>
                );
              })()
            : null}
        </>
      ))}
    </Stack>
  );
};
