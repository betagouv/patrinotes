import { Button, Input } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { useSpeechToTextV2 } from "../../audio-record/SpeechRecorder.hook";
import { MinimalAttachment, UploadImage } from "../../upload/UploadImage";
import { UploadImageModal } from "../../upload/UploadImageButton";
import { useAttachmentImages } from "../../upload/hooks/useAttachmentImages";
import { useIsStateReportDisabled } from "../utils";
import { AlertSectionName, AlertSectionsForm } from "./StateReportAlertsMenu";

export const SectionCommentaires = ({ form, name }: { form: AlertSectionsForm; name: AlertSectionName }) => {
  const isFormDisabled = useIsStateReportDisabled();

  const value = useWatch({ control: form.control, name: `${name}.commentaires` });
  const setValue = (val: string) => form.setValue(`${name}.commentaires`, val);

  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      setValue(form.getValues(`${name}.commentaires`) + " " + text);
    },
  });

  const isIdleProps = form.register(`${name}.commentaires`);
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

export const SectionPhotos = ({
  alertId,
  constatId,
  isDisabled,
}: {
  alertId: string | undefined;
  constatId: string;
  isDisabled: boolean;
}) => {
  const [selectedAttachment, setSelectedAttachment] = useState<MinimalAttachment | null>(null);
  const { attachments, addMutation, deleteMutation, onLabelChange } = useAttachmentImages(
    { table: "state_report_alert_attachment", fkColumn: "state_report_alert_id", fkValue: alertId ?? "" },
    constatId,
  );

  return (
    <Box width="100%" mt="16px">
      <UploadImageModal
        selectedAttachment={selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
        imageTable="state_report_alert_attachment"
        onSave={({ id, label }) => onLabelChange(id, label || "")}
      />

      <UploadImage
        onFiles={async (files) => addMutation.mutateAsync(files[0])}
        multiple
        attachments={attachments}
        onClick={(a) => setSelectedAttachment(a!)}
        onDelete={(attachment) => deleteMutation.mutate(attachment)}
        isDisabled={isDisabled}
        imageTable="state_report_alert_attachment"
      />
    </Box>
  );
};

export const ShowInReportToggle = ({ form, names }: { names: AlertSectionName[]; form: AlertSectionsForm }) => {
  const value = useWatch({ control: form.control, name: `${names[0]}.show_in_report` });
  const setValue = (val: boolean) => {
    for (const name of names) {
      form.setValue(`${name}.show_in_report`, val ? 1 : 0);
    }
  };

  const isDisabled = useIsStateReportDisabled();

  return (
    <ToggleSwitch
      inputTitle="Afficher dans le rapport"
      disabled={isDisabled}
      showCheckedHint={false}
      onChange={setValue}
      checked={!!value}
      label="Afficher dans le rapport"
    />
  );
};

export const ShouldSendToggle = ({ form, names }: { names: AlertSectionName[]; form: AlertSectionsForm }) => {
  const value = useWatch({ control: form.control, name: `${names[0]}.should_send` });
  const setValue = (val: boolean) => {
    for (const name of names) {
      form.setValue(`${name}.should_send`, val ? 1 : 0);
    }
  };

  const isDisabled = useIsStateReportDisabled();

  return (
    <ToggleSwitch
      inputTitle="Envoyer par courriel"
      disabled={isDisabled}
      showCheckedHint={false}
      onChange={setValue}
      checked={!!value}
      label="Envoyer par courriel"
    />
  );
};
