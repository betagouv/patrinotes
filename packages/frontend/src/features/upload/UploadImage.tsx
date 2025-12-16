import { Box } from "@mui/material";
import { UploadImageButton } from "./UploadImageButton";
import { useState } from "react";
import { v7 } from "uuid";
import { PictureThumbnail, processImage } from "./UploadReportImage";
import { attachmentQueue, db } from "../../db/db";

export const UploadImage = ({ onFiles, attachments, multiple, onClick, onDelete, isDisabled }: UploadImageProps) => {
  const attachment = attachments.length > 0 ? attachments[0] : null;
  const hideButton = !multiple && !!attachment;

  return (
    <Box>
      {hideButton ? null : (
        <UploadImageButton
          multiple={multiple}
          isDisabled={isDisabled}
          addImage={async (files) => {
            await onFiles(files.files);
          }}
        />
      )}
      <Box display="flex" height="100%" mt="8px" flexWrap="wrap">
        {attachment
          ? attachments.map((attachment) => (
              <PictureThumbnail
                label={attachment.label || ""}
                picture={{ id: attachment.id }}
                onEdit={() => onClick?.(attachment)}
                onDelete={onDelete ? () => onDelete({ id: attachment.id }) : () => {}}
                key={attachment.id}
                isDisabled={isDisabled}
              />
            ))
          : null}
      </Box>
    </Box>
  );
};

type UploadImageProps = {
  attachments: MinimalAttachment[];
  onFiles: (files: File[]) => any | Promise<any>;
  multiple?: boolean;
  onClick?: (attachment: MinimalAttachment) => void;
  onDelete?: (props: { id: string }) => void;
  isDisabled?: boolean;
};

export type MinimalAttachment = {
  id: string;
  label?: string | null;
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
  const picId = `${constatId}/images/${v7()}.jpg`;
  const buffer = await processImage(file);

  await attachmentQueue.saveAttachment({
    attachmentId: picId,
    buffer,
    mediaType: "image/jpeg",
  });

  const attachment = await db
    .insertInto("state_report_attachment")
    .values({
      id: picId,
      attachment_id: picId,
      state_report_id: constatId,
      service_id: serviceId,
      created_at: new Date().toISOString(),
      is_deprecated: 0,
    })
    .returningAll()
    .execute();

  return attachment?.[0];
};
