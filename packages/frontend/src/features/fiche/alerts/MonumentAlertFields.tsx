import { Input } from "#components/MUIDsfr.tsx";
import { LinkButton } from "#components/ui/LinkButton.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { fr } from "@codegouvfr/react-dsfr";
import { addSIfPlural, deserializeMandatoryEmails, serializeMandatoryEmails } from "@patrinotes/pdf/utils";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { DictationTextArea } from "../../audio-record/DictationTextArea";
import { useSpeechToTextV2 } from "../../audio-record/SpeechRecorder.hook";
import { MinimalAttachment, UploadImage } from "../../upload/UploadImage";
import { UploadImageModal } from "../../upload/UploadImageButton";
import { useAttachmentImages } from "../../upload/hooks/useAttachmentImages";
import { checkEmailValid } from "../../state-report/alerts/StateReportAlert.utils";

const mentionColor = fr.colors.decisions.text.mention.grey.default;

export const CommentairesField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => onChange([value, text].filter(Boolean).join(" ")),
  });

  return (
    <DictationTextArea
      sx={{ mt: "24px" }}
      label="Commentaires"
      disabled={isRecording}
      isRecording={isRecording}
      onToggleRecording={toggle}
      nativeTextAreaProps={{
        rows: 5,
        value: isRecording ? [value, transcript].filter(Boolean).join(" ") : value,
        onChange: (e) => (isRecording ? null : onChange(e.target.value)),
      }}
    />
  );
};

/** Photos of an alert, stored offline and uploaded by the attachment queue under the alert's id. */
export const AlertPhotosField = ({ alertId }: { alertId: string }) => {
  const [selected, setSelected] = useState<{ attachment: MinimalAttachment; blobUrl: string } | null>(null);
  const { attachments, batchUpload, deleteMutation, onLabelChange, replaceAttachment } = useAttachmentImages(
    { table: "monument_alert_attachment", fkColumn: "monument_alert_id", fkValue: alertId },
    alertId,
  );

  return (
    <Box
      width="100%"
      mt="16px"
      sx={{
        button: { display: "flex", width: { xs: "100%", lg: "initial" }, justifyContent: { xs: "center", lg: "initial" } },
      }}
    >
      <UploadImageModal
        selectedAttachment={selected?.attachment ?? null}
        blobUrl={selected?.blobUrl ?? null}
        onClose={() => setSelected(null)}
        onSave={({ id, label }) => onLabelChange(id, label || "")}
        onReplaceAttachment={replaceAttachment}
      />
      <UploadImage
        onFiles={batchUpload.uploadFiles}
        multiple
        attachments={attachments}
        onClick={(attachment, blobUrl) => setSelected({ attachment, blobUrl })}
        onDelete={(attachment) => deleteMutation.mutate(attachment)}
        onRetry={({ id }) => batchUpload.retry(id)}
        isDisabled={false}
      />
    </Box>
  );
};

export type RecipientsValue = { should_send: boolean; mandatory_emails: string; additional_emails: string };

/** Emails an alert will be sent to; empty when it is not emailed. */
export const getRecipients = ({ mandatory_emails, additional_emails }: RecipientsValue) =>
  Array.from(
    new Set(
      [...deserializeMandatoryEmails(mandatory_emails).map((e) => e.email), ...additional_emails.split(",")]
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

export const getRecipientsError = (value: RecipientsValue) => {
  if (!value.should_send) return null;
  const recipients = getRecipients(value);
  if (!recipients.length) return "Renseignez au moins un courriel destinataire.";
  const invalid = recipients.filter((email) => !checkEmailValid(email));
  if (invalid.length) return `Courriel invalide : ${invalid.join(", ")}`;
  return null;
};

/** « Alerter par courriel » toggle, recipients and their edition. */
export const RecipientsField = ({
  value,
  onChange,
  error,
  toggleLabel = "Alerter par courriel",
}: {
  value: RecipientsValue;
  onChange: (value: RecipientsValue) => void;
  error?: string | null;
  toggleLabel?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const mandatory = deserializeMandatoryEmails(value.mandatory_emails);
  const recipients = getRecipients(value);
  const serviceSuffix = addSIfPlural(mandatory.length);

  return (
    <Stack>
      <Flex
        alignItems={{ xs: "flex-start", lg: "center" }}
        flexDirection={{ xs: "column", lg: "row" }}
        gap={{ xs: "8px", lg: "16px" }}
      >
        <Box flexShrink={0} sx={{ ".fr-toggle": { width: "auto" }, ".fr-toggle__label": { whiteSpace: "nowrap" } }}>
          <ToggleSwitch
            inputTitle={toggleLabel}
            label={toggleLabel}
            showCheckedHint={false}
            checked={value.should_send}
            onChange={(checked) => onChange({ ...value, should_send: checked })}
          />
        </Box>
        {value.should_send && !isEditing ? (
          <Flex alignItems="center" gap="8px" flexWrap="wrap">
            <Typography fontSize="14px" color={mentionColor}>
              {recipients.join(", ") || "Aucun courriel configuré"}
            </Typography>
            <LinkButton type="button" onClick={() => setIsEditing(true)}>
              modifier
            </LinkButton>
          </Flex>
        ) : null}
      </Flex>

      {value.should_send && mandatory.length ? (
        <Typography mt="8px" fontSize="14px" color={mentionColor}>
          Service{serviceSuffix} destinataire{serviceSuffix} : {mandatory.map((e) => e.service).join(", ")}
        </Typography>
      ) : null}

      {value.should_send && isEditing ? (
        <Stack mt="16px" gap="8px">
          {mandatory.map((entry, index) => (
            <Input
              key={entry.service + index}
              label={`Courriel ${entry.service}`}
              nativeInputProps={{
                type: "email",
                value: entry.email,
                onChange: (e) => {
                  const next = mandatory.map((m, i) => (i === index ? { ...m, email: e.target.value.trim() } : m));
                  onChange({ ...value, mandatory_emails: serializeMandatoryEmails(next) });
                },
              }}
            />
          ))}
          <Input
            label="Autres destinataires"
            hintText="Courriels séparés par des virgules"
            nativeInputProps={{
              type: "text",
              value: value.additional_emails,
              onChange: (e) => onChange({ ...value, additional_emails: e.target.value }),
            }}
          />
        </Stack>
      ) : null}

      {error ? (
        <Typography mt="8px" fontSize="14px" color={fr.colors.decisions.text.default.error.default}>
          {error}
        </Typography>
      ) : null}
    </Stack>
  );
};
