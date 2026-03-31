import { Box } from "@mui/material";
import { UploadImageButton } from "./UploadImageButton";
import { v7 } from "uuid";
import { PictureThumbnail, processImage } from "./UploadReportImage";
import { attachmentQueue, db } from "../../db/db";

type UploadImageButtonSubProps = {
  onFiles: (files: File[]) => any | Promise<any>;
  multiple?: boolean;
  isDisabled?: boolean;
};

type UploadImageImagesSubProps = {
  attachments: MinimalAttachment[];
  multiple?: boolean;
  onClick?: (attachment: MinimalAttachment, blobUrl: string) => void;
  onDelete?: (props: { id: string }) => void;
  isDisabled?: boolean;
};

type UploadImageProps = UploadImageButtonSubProps & UploadImageImagesSubProps;

const Button = ({ onFiles, multiple, isDisabled }: UploadImageButtonSubProps) => (
  <UploadImageButton multiple={multiple} isDisabled={isDisabled} addImage={onFiles} />
);

const Images = ({ attachments, onClick, onDelete, isDisabled }: UploadImageImagesSubProps) => {
  const attachment = attachments.length > 0 ? attachments[0] : null;
  if (!attachment) return null;

  return (
    <Box display="flex" height="100%" flexWrap="wrap" gap="8px">
      {attachments.map((attachment) => (
        <PictureThumbnail
          label={attachment.label || ""}
          picture={attachment}
          onEdit={(a, blobUrl) => onClick?.(a, blobUrl)}
          onDelete={onDelete ? () => onDelete({ id: attachment.id }) : () => {}}
          key={attachment.id}
          isDisabled={isDisabled}
        />
      ))}
    </Box>
  );
};

const Basic = ({ onFiles, attachments, multiple, onClick, onDelete, isDisabled }: UploadImageProps) => {
  const attachment = attachments.length > 0 ? attachments[0] : null;
  const hideButton = !multiple && !!attachment;

  return (
    <Box>
      <Images
        attachments={attachments}
        multiple={multiple}
        onClick={onClick}
        onDelete={onDelete}
        isDisabled={isDisabled}
      />
      {hideButton ? null : (
        <Box mt={!!attachment ? "16px" : "0"}>
          <Button onFiles={onFiles} multiple={multiple} isDisabled={isDisabled} />
        </Box>
      )}
    </Box>
  );
};

export const UploadImage = Object.assign(Basic, { Button, Images });

export type MinimalAttachment = {
  id: string;
  label?: string | null;
  local_uri?: string | null;
  state?: number | null;
  mediaType?: string | null;
};

export const onStateReportFile = async ({
  constatId,
  serviceId,
  file,
}: {
  constatId: string;
  serviceId: string;
  file: File;
}) => {
  const attachmentId = `${constatId}/images/${v7()}.jpg`;
  const processedFile = await processImage(file);

  await attachmentQueue.saveFile({
    id: attachmentId,
    fileExtension: "jpg",
    data: processedFile,
    mediaType: "image/jpeg",
  });

  const attachment = await db
    .insertInto("state_report_attachment")
    .values({
      id: attachmentId,
      attachment_id: attachmentId,
      state_report_id: constatId,
      service_id: serviceId,
      created_at: new Date().toISOString(),
      is_deprecated: 0,
    })
    .returningAll()
    .execute();

  return attachment?.[0];
};
