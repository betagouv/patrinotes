import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { Box, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { Badge, Button } from "#components/MUIDsfr.tsx";
import { AttachmentState } from "@powersync/web";
import { UploadImageModal } from "./UploadImageButton";
import { fr } from "@codegouvfr/react-dsfr";
import { MinimalAttachment, UploadImage } from "./UploadImage";
import { useImageBlobUrl, useImageBlobUrlDirect } from "./hooks/useImageBlobUrl";
import { usePictureLines } from "./hooks/usePictureLines";
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
  // Layer A: always loads local image for pending/transitioning display
  const localBlobUrl = useImageBlobUrlDirect(picture.local_uri, picture.mediaType);
  // Layer B: only resolves when SYNCED — this is the backend-processed snapshot
  const snapshotBlobUrl = useImageBlobUrl(picture.local_uri, picture.mediaType, picture.state);
  const lines = usePictureLines(picture.id, imageTable);
  const hasLines = lines.length > 0;

  // Natural image size for SVG viewBox
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    if (!localBlobUrl) return;
    const img = new Image();
    img.onload = () => setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = localBlobUrl;
  }, [localBlobUrl]);

  // Show "En cours" badge while picture_lines exist (backend is processing)
  const isPending = hasLines;
  const displayStatus = isPending ? AttachmentState.QUEUED_UPLOAD : picture.state;

  return (
    <Stack gap="4px" width={{ xs: "180px", sm: "200px", md: "240px" }}>
      <ReportStatus status={displayStatus as any} />
      <Flex flexDirection="column" justifyContent="flex-end" width="100%" maxWidth="480px">
        {/* Two-layer thumbnail with SVG overlay and crossfade */}
        <Box position="relative" width="100%" sx={{ height: "160px", overflow: "hidden", bgcolor: "#f0f0f0" }}>
          {/* Layer A: local image + SVG lines overlay */}
          {localBlobUrl && (
            <>
              <Box
                component="img"
                src={localBlobUrl}
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {hasLines && imageSize && (
                <Box
                  component="svg"
                  viewBox={`0 0 ${imageSize.w} ${imageSize.h}`}
                  preserveAspectRatio="xMidYMid slice"
                  sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                >
                  {lines.map((line, i) => (
                    <polyline
                      key={i}
                      points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
                      stroke={line.color}
                      strokeWidth={5}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </Box>
              )}
            </>
          )}
          {/* Layer B: snapshot crossfades in once locally available */}
          <Box
            component="img"
            src={snapshotBlobUrl ?? undefined}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: snapshotBlobUrl ? 1 : 0,
              transition: "opacity 0.4s ease-in-out",
            }}
          />
        </Box>
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
                onEdit({ id: picture.id, url: localBlobUrl! });
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
