import { Button, Input } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { Box, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { v7 } from "uuid";
import { useLiveUser, useService } from "../../../contexts/AuthContext";
import { attachmentQueue, attachmentStorage, db, useDbQuery } from "../../../db/db";
import { useSpeechToTextV2 } from "../../audio-record/SpeechRecorder.hook";
import { MinimalAttachment, UploadImage } from "../../upload/UploadImage";
import { UploadImageModal } from "../../upload/UploadImageButton";
import { processImage } from "../../upload/UploadReportImage";
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
  const user = useLiveUser()!;
  const service = useService();

  const attachmentsQuery = useDbQuery(
    db
      .selectFrom("state_report_alert_attachment")
      .selectAll()
      .where("state_report_alert_id", "=", alertId ?? "")
      .where("is_deprecated", "=", 0)
      .orderBy("created_at", "asc"),
  );

  const attachments = attachmentsQuery.data ?? [];

  const onClose = () => setSelectedAttachment(null);
  const onDelete = async (attachment: { id: string }) => {
    await attachmentStorage.deleteFile(attachment.id);
    await db
      .updateTable("state_report_alert_attachment")
      .set({ is_deprecated: 1 })
      .where("id", "=", attachment.id)
      .execute();
  };

  const addPhotoMutation = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      let currentAlertId = alertId;

      const processedFile = await processImage(file);
      const attachmentId = `${constatId}/images/${v7()}.jpg`;

      await attachmentQueue.saveAttachment({
        attachmentId,
        buffer: processedFile,
        mediaType: "image/jpeg",
      });

      await db
        .insertInto("state_report_alert_attachment")
        .values({
          id: attachmentId,
          state_report_alert_id: currentAlertId,
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
      .updateTable("state_report_alert_attachment")
      .set({ label: newLabel })
      .where("id", "=", attachmentId)
      .execute();
  };

  return (
    <Box width="100%" mt="16px">
      <UploadImageModal
        selectedAttachment={selectedAttachment}
        onClose={onClose}
        imageTable="state_report_alert_attachment"
        onSave={({ id, label }) => onLabelChange(id, label || "")}
      />

      <UploadImage
        onFiles={async (files) => addPhotoMutation.mutateAsync({ file: files[0] })}
        multiple
        attachments={attachments}
        onClick={(a) => setSelectedAttachment(a!)}
        onDelete={(attachment) => onDelete(attachment)}
        isDisabled={isDisabled}
      />
    </Box>
  );
};

export const ShowInReportToggle = ({ form, name }: { name: AlertSectionName; form: AlertSectionsForm }) => {
  const value = useWatch({ control: form.control, name: `${name}.show_in_report` });
  const setValue = (val: boolean) => form.setValue(`${name}.show_in_report`, val as any);

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
