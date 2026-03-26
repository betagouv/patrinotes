import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { Box, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { Badge, Button } from "#components/MUIDsfr.tsx";
import { AttachmentState } from "@powersync/web";
import { UploadImageModal } from "./UploadImageButton";
import { fr } from "@codegouvfr/react-dsfr";
import { MinimalAttachment, UploadImage } from "./UploadImage";
import { useImageBlobUrl } from "./hooks/useImageBlobUrl";
import { usePictureLines } from "./hooks/usePictureLines";
import { useThumbnailCanvas } from "./hooks/useThumbnailCanvas";
import { useAttachmentImages } from "./hooks/useAttachmentImages";

export const UploadReportImage = ({ reportId }: { reportId: string }) => {
  const [selectedAttachment, setSelectedAttachment] = useState<MinimalAttachment | null>(null);
  const { attachments, addMutation, deleteMutation } = useAttachmentImages(
    { table: "report_attachment", fkColumn: "report_id", fkValue: reportId },
    reportId,
  );

  return (
    <Box flex="1">
      <UploadImageModal
        selectedAttachment={selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
        imageTable="report_attachment"
        onSave={() => {}}
        hideLabelInput
      />
      <UploadImage
        onFiles={async (files) => addMutation.mutateAsync(files[0])}
        multiple
        attachments={attachments}
        onDelete={({ id }) => deleteMutation.mutate({ id })}
        onClick={(attachment) => setSelectedAttachment(attachment)}
        imageTable="report_attachment"
      />
    </Box>
  );
};

export const PictureThumbnail = ({
  picture,
  label,
  onEdit,
  onDelete,
  isDisabled,
  imageTable,
}: {
  picture: MinimalAttachment;
  label: string;
  onEdit: (props: { id: string; url: string }) => void;
  onDelete: (props: { id: string }) => void;
  isDisabled?: boolean;
  imageTable: string;
}) => {
  const bgUrl = useImageBlobUrl(picture.local_uri, picture.mediaType, picture.state);
  const lines = usePictureLines(picture.id, imageTable);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useThumbnailCanvas(canvasRef, bgUrl, lines);

  const finalStatus = picture.state;

  return (
    <Stack gap="4px" width={{ xs: "180px", sm: "200px", md: "240px" }}>
      <ReportStatus status={finalStatus as any} />
      <Flex flexDirection="column" justifyContent="flex-end" width="100%" maxWidth="480px">
        <Box
          ref={canvasRef}
          component="canvas"
          sx={{ width: "100%", height: "160px", display: "block" }}
          data-state={picture.state}
          data-picture-id={picture.local_uri}
        ></Box>
        <Flex
          display={isDisabled ? "none" : "flex"}
          bgcolor="white"
          alignItems="center"
          border="1px solid"
          borderColor={fr.colors.decisions.border.default.grey.default}
          height="40px"
        >
          {isDisabled ? null : (
            <Box
              onClick={() => {
                onEdit({ id: picture.id, url: bgUrl! });
              }}
              borderRight="1px solid"
              borderColor={fr.colors.decisions.border.default.grey.default}
            >
              <Button
                type="button"
                iconId="ri-pencil-fill"
                priority="tertiary no outline"
                sx={{
                  "::before": {
                    marginRight: "0 !important",
                    width: "24px",
                    height: "24px",
                  },
                }}
              >
                {null}
              </Button>
            </Box>
          )}
          <Typography
            mt="4px"
            flex="1"
            px="12px"
            fontSize="14px"
            fontWeight="500"
            color={fr.colors.decisions.text.actionHigh.blueFrance.default}
            noWrap
            width={{ xs: "100%", lg: "100%" }}
          >
            {label}
          </Typography>
          {isDisabled ? null : (
            <Box borderLeft="1px solid" borderColor={fr.colors.decisions.border.default.grey.default}>
              <Button
                type="button"
                iconId="fr-icon-delete-bin-fill"
                priority="tertiary no outline"
                sx={{
                  "::before": {
                    marginRight: "0 !important",
                    width: "24px",
                    height: "24px",
                  },
                }}
                nativeButtonProps={{
                  onClick: () => onDelete({ id: picture.id }),
                }}
              >
                {null}
              </Button>
            </Box>
          )}
        </Flex>
      </Flex>
    </Stack>
  );
};

const ReportStatus = ({ status }: { status: AttachmentState }) => {
  const { color, bgColor, label, icon } = statusData[status];

  return (
    <Badge
      severity={"info"}
      noIcon
      small
      style={{
        backgroundColor: bgColor,
        color,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        className={icon}
        sx={{
          "::before": {
            width: "12px !important",
            height: "12px !important",
            verticalAlign: "middle !important",
          },
        }}
      />
      <Typography ml="4px">{label}</Typography>
    </Badge>
  );
};

const statusData: Record<AttachmentState, any> = {
  [AttachmentState.QUEUED_UPLOAD]: {
    label: "En cours",
    bgColor: "#FEE7FC",
    color: "#855080",
    icon: "fr-icon-refresh-line",
  },
  [AttachmentState.SYNCED]: { label: "Ok", bgColor: "#B8FEC9", color: "#18753C", icon: "fr-icon-success-line" },
  [AttachmentState.ARCHIVED]: { label: "Erreur", bgColor: "#FEC9C9", color: "#853C3C", icon: "fr-icon-warning-line" },
  [AttachmentState.QUEUED_DELETE]: {
    label: "En cours",
    bgColor: "#FEE7FC",
    color: "#855080",
    icon: "fr-icon-refresh-line",
  },
  [AttachmentState.QUEUED_DOWNLOAD]: {
    label: "En cours",
    bgColor: "#FEE7FC",
    color: "#855080",
    icon: "fr-icon-refresh-line",
  },
};

export const processImage = async (file: File) => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      preserveExif: false,
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile.arrayBuffer();
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};
