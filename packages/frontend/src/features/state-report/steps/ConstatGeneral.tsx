import { Button, Input } from "#components/MUIDsfr.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { deserializePreconisations, serializePreconisations } from "@patrinotes/pdf/constat";
import { Box, BoxProps, Stack, Typography } from "@mui/material";
import { getRouteApi } from "@tanstack/react-router";
import { useActorRef, useSelector } from "@xstate/react";
import { useCallback, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { useLiveUser } from "../../../contexts/AuthContext";
import { StateReport } from "../../../db/AppSchema";
import { attachmentLocalStorage, db, useDbQuery } from "../../../db/db";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { useSpeechToTextV2 } from "../../audio-record/SpeechRecorder.hook";
import { attachmentUploadMachine } from "../../upload/machines/attachmentUploadMachine";
import { MinimalAttachment, UploadImage } from "../../upload/UploadImage";
import { UploadImageModal } from "../../upload/UploadImageButton";
import { StateReportFormType, useIsStateReportDisabled, useStateReportFormContext } from "../utils";
import { ButtonsSwitch } from "../WithReferencePop";

const routeApi = getRouteApi("/constat/$constatId");

export const ConstatGeneral = () => {
  const isDisabled = useIsStateReportDisabled();

  return (
    <Stack px="16px" pl={{ xs: "16px", lg: "64px" }} pt={{ xs: "16px", lg: "14px" }} mb="60px">
      <Typography
        display={{
          xs: "none",
          lg: "block",
        }}
        fontSize="16px !important"
        variant="h3"
        fontWeight="500"
        pt="0 !important"
        mb="40px"
        color={fr.colors.decisions.text.actionHigh.blueFrance.default}
      >
        Constat général
      </Typography>
      <MandatoryFieldReminder />
      <EtatGeneralRadioButtons isDisabled={isDisabled} />
      <ProportionsRadioButtons isDisabled={isDisabled} />
      <StateReportTextAreaWithSpeechToText
        label="Commentaire"
        name="etat_commentaires"
        mb="40px"
        isDisabled={isDisabled}
      />
      <Divider mb={{ xs: "24px", lg: "32px" }} />
      <EtatGeneralImages isDisabled={isDisabled} />
      <Divider my={{ xs: "24px", lg: "32px" }} />
      <Preconisations isDisabled={isDisabled} />
      <Box mt="32px">
        <ButtonsSwitch />
      </Box>
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
  isDisabled,
  ...props
}: { label: string; name: keyof StateReportFormType; isDisabled: boolean } & BoxProps) => {
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
        disabled={isDisabled || isRecording}
        label={<Box mb="8px">{label}</Box>}
        textArea
        nativeTextAreaProps={{
          ...textAreaProps,
          rows: 5,
        }}
      />
      {isDisabled ? null : (
        <Button
          type="button"
          priority={isDisabled || isRecording ? "primary" : "tertiary"}
          iconId="ri-mic-fill"
          onClick={() => toggle()}
        >
          {isRecording ? <>En cours</> : <>Dicter</>}
        </Button>
      )}
    </Flex>
  );
};

const PlanSituation = ({
  setSelectedAttachment,
  isDisabled,
}: {
  setSelectedAttachment: (attachment: MinimalAttachment, blobUrl: string) => void;
  isDisabled: boolean;
}) => {
  const { constatId } = routeApi.useParams();
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "plan_situation" });

  const attachmentQuery = useStateReportAttachmentQuery(value);
  const attachment = attachmentQuery.data;

  const { addMutation, deleteMutation } = useStateReportAttachmentUpload({
    constatId,
    onInserted: async (attachmentId) => {
      form.setValue("plan_situation", attachmentId);
    },
    onDelete: async (attachmentId) => {
      await attachmentLocalStorage.deleteFile(attachmentId);
      await db.updateTable("state_report").set({ plan_situation: null }).where("id", "=", constatId).execute();
    },
  });

  return (
    <Box flex="1">
      <Typography mb="8px">Plan de situation</Typography>
      <UploadImage
        onFiles={async (files) => addMutation.mutateAsync(files[0])}
        attachments={attachment ? [attachment] : []}
        multiple={false}
        onClick={(attachment, blobUrl) => setSelectedAttachment(attachment, blobUrl)}
        onDelete={() => deleteMutation.mutate(attachment!.id)}
        isDisabled={isDisabled}
        imageTable="state_report_attachment"
      />
    </Box>
  );
};

const PlanEdifice = ({
  setSelectedAttachment,
  isDisabled,
}: {
  setSelectedAttachment: (attachment: MinimalAttachment, blobUrl: string) => void;
  isDisabled: boolean;
}) => {
  const { constatId } = routeApi.useParams();
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "plan_edifice" });

  const attachmentQuery = useStateReportAttachmentQuery(value);
  const attachment = attachmentQuery.data;

  const { addMutation, deleteMutation } = useStateReportAttachmentUpload({
    constatId,
    onInserted: async (attachmentId) => {
      form.setValue("plan_edifice", attachmentId);
    },
    onDelete: async (attachmentId) => {
      await attachmentLocalStorage.deleteFile(attachmentId);
      await db.updateTable("state_report").set({ plan_edifice: null }).where("id", "=", constatId).execute();
    },
  });

  return (
    <Box flex="1">
      <Typography mb="8px">Plan de l'édifice</Typography>
      <UploadImage
        onFiles={async (files) => addMutation.mutateAsync(files[0])}
        attachments={attachment ? [attachment] : []}
        multiple={false}
        onClick={(attachment, blobUrl) => setSelectedAttachment(attachment, blobUrl)}
        onDelete={() => deleteMutation.mutate(attachment!.id)}
        isDisabled={isDisabled}
        imageTable="state_report_attachment"
      />
    </Box>
  );
};

const VuesGenerales = ({
  setSelectedAttachment,
  isDisabled,
}: {
  setSelectedAttachment: (attachment: MinimalAttachment, blobUrl: string) => void;
  isDisabled: boolean;
}) => {
  const { constatId } = routeApi.useParams();

  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "vue_generale" });

  const ids = value ? value.split(";") : [""];
  const attachmentsQuery = useDbQuery(
    db
      .selectFrom("state_report_attachment")
      .leftJoin("attachments", "attachments.id", "state_report_attachment.attachment_id")
      .where("state_report_attachment.id", "in", ids)
      .select((eb) => [
        "state_report_attachment.id",
        "state_report_attachment.label",
        "attachments.local_uri",
        "attachments.state",
        eb.ref("attachments.media_type").as("mediaType"),
      ]) as any,
  );

  const attachments = (attachmentsQuery.data ?? []) as MinimalAttachment[];

  const { addMutation, deleteMutation } = useStateReportAttachmentUpload({
    constatId,
    onInserted: async (attachmentId) => {
      const current = form.getValues("vue_generale") || "";
      form.setValue("vue_generale", current ? `${current};${attachmentId}` : attachmentId);
    },
    onDelete: async (attachmentId) => {
      await attachmentLocalStorage.deleteFile(attachmentId);
      const current = form.getValues("vue_generale") || "";
      const newValue = current
        .split(";")
        .filter((id) => id !== attachmentId)
        .join(";");
      form.setValue("vue_generale", newValue || null);
    },
  });

  return (
    <Box flex="1">
      <Typography mb="8px">Vues générales de l'édifice</Typography>
      <UploadImage
        onFiles={async (files) => {
          for (const file of files) {
            await addMutation.mutateAsync(file);
          }
        }}
        attachments={attachments}
        multiple
        onClick={(attachment, blobUrl) => setSelectedAttachment(attachment, blobUrl)}
        onDelete={({ id }) => deleteMutation.mutate(id)}
        isDisabled={isDisabled}
        imageTable="state_report_attachment"
      />
    </Box>
  );
};

const useStateReportAttachmentQuery = (attachmentId: string | null) => {
  const result = useDbQuery(
    db
      .selectFrom("state_report_attachment")
      .leftJoin("attachments", "attachments.id", "state_report_attachment.attachment_id")
      .where("state_report_attachment.id", "=", attachmentId ?? "")
      .select((eb) => [
        "state_report_attachment.id",
        "state_report_attachment.label",
        "attachments.local_uri",
        "attachments.state",
        eb.ref("attachments.media_type").as("mediaType"),
      ]) as any,
  );
  return { data: (result.data?.[0] as MinimalAttachment) ?? null };
};

const EtatGeneralImages = ({ isDisabled }: { isDisabled: boolean }) => {
  const [selected, setSelected] = useState<{ attachment: MinimalAttachment; blobUrl: string } | null>(null);

  const onLabelChange = async (attachmentId: string, newLabel: string) => {
    await db.updateTable("state_report_attachment").set({ label: newLabel }).where("id", "=", attachmentId).execute();
  };

  return (
    <Flex width="100%" flexWrap="wrap" gap={{ xs: "20px", lg: "16px" }} flexDirection={{ xs: "column", lg: "column" }}>
      <UploadImageModal
        selectedAttachment={selected?.attachment ?? null}
        blobUrl={selected?.blobUrl ?? null}
        onClose={() => setSelected(null)}
        imageTable="state_report_attachment"
        onSave={({ id, label }) => onLabelChange(id, label || "")}
      />
      <PlanSituation
        setSelectedAttachment={(a, url) => setSelected({ attachment: a, blobUrl: url })}
        isDisabled={isDisabled}
      />
      <PlanEdifice
        setSelectedAttachment={(a, url) => setSelected({ attachment: a, blobUrl: url })}
        isDisabled={isDisabled}
      />
      <VuesGenerales
        setSelectedAttachment={(a, url) => setSelected({ attachment: a, blobUrl: url })}
        isDisabled={isDisabled}
      />
    </Flex>
  );
};

function useStateReportAttachmentUpload({
  constatId,
  onInserted,
  onDelete,
}: {
  constatId: string;
  onInserted: (attachmentId: string) => Promise<void>;
  onDelete: (attachmentId: string) => Promise<void>;
}) {
  const user = useLiveUser()!;

  const insertRecordImplRef = useRef<(id: string) => Promise<void>>(null!);
  insertRecordImplRef.current = async (attachmentId: string) => {
    await db
      .insertInto("state_report_attachment")
      .values({
        id: attachmentId,
        attachment_id: attachmentId,
        state_report_id: constatId,
        service_id: user.service_id,
        created_at: new Date().toISOString(),
        is_deprecated: 0,
      })
      .execute();
    await onInserted(attachmentId);
  };

  const stableInsertRecord = useCallback((id: string) => insertRecordImplRef.current(id), []);

  const uploadActorRef = useActorRef(attachmentUploadMachine, {
    input: { parentId: constatId, insertRecord: stableInsertRecord },
  });

  const uploadState = useSelector(uploadActorRef, (snap) => snap.value);
  const uploadError = useSelector(uploadActorRef, (snap) => snap.context.error);

  const mutateAsync = useCallback(
    (file: File): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        uploadActorRef.send({ type: "UPLOAD_FILE", file });
        const sub = uploadActorRef.subscribe((snap) => {
          if (snap.matches("idle")) {
            sub.unsubscribe();
            resolve();
          } else if (snap.matches("failed")) {
            sub.unsubscribe();
            reject(new Error(snap.context.error ?? "Upload failed"));
          }
        });
      }),
    [uploadActorRef],
  );

  const isUploading = uploadState === "compressing" || uploadState === "saving" || uploadState === "inserting";

  return {
    addMutation: {
      mutateAsync,
      isPending: isUploading,
      isError: uploadState === "failed",
      error: uploadError,
      retry: () => uploadActorRef.send({ type: "RETRY" }),
      dismiss: () => uploadActorRef.send({ type: "DISMISS" }),
    },
    deleteMutation: {
      mutate: (attachmentId: string) => onDelete(attachmentId),
    },
  };
}

export const EtatGeneralRadioButtons = ({ isDisabled }: { isDisabled: boolean }) => {
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
      disabled={isDisabled}
    />
  );
};

const ProportionsRadioButtons = ({ isDisabled }: { isDisabled: boolean }) => {
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
      disabled={isDisabled}
    />
  );
};

const Preconisations = ({ isDisabled }: { isDisabled: boolean }) => {
  const form = useStateReportFormContext();
  const rawValue = useWatch({ control: form.control, name: "preconisations" });

  const commentairesCache = useRef<Record<string, string>>({});

  const value = deserializePreconisations(rawValue);
  const setValue = (formValue: { preconisation: string; commentaire?: string }[]) => {
    form.setValue("preconisations", serializePreconisations(formValue));
  };

  const selectedNames: string[] = value.map((item) => item.preconisation);

  const options = [
    "Études",
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
          <Checkbox legend={null} options={[option]} disabled={isDisabled} />
          {selectedNames.includes(option.label)
            ? (() => {
                const currentCommentaire = value.find((item) => item.preconisation === option.label)?.commentaire || "";
                return (
                  <SectionCommentaire
                    isDisabled={isDisabled}
                    commentaire={currentCommentaire}
                    onChange={(newCommentaire) => {
                      commentairesCache.current[option.label] = newCommentaire;
                      const newValue = value.map((item) =>
                        item.preconisation === option.label ? { ...item, commentaire: newCommentaire } : item,
                      );
                      setValue(newValue);
                    }}
                  />
                );
              })()
            : null}
        </>
      ))}
    </Stack>
  );
};

const SectionCommentaire = ({
  isDisabled,
  commentaire,
  onChange,
}: {
  isDisabled: boolean;
  commentaire: string;
  onChange: (newCommentaire: string) => void;
}) => {
  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      onChange(commentaire + " " + text);
    },
  });

  const inputProps = isRecording
    ? {
        value: commentaire + " " + transcript,
        onChange: () => {},
      }
    : {
        value: commentaire,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(e.target.value);
        },
      };

  return (
    <Box mb="24px" mt="16px">
      <Input
        label="Commentaire"
        disabled={isDisabled}
        textArea
        nativeTextAreaProps={{
          rows: 4,
          ...inputProps,
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
    </Box>
  );
};
