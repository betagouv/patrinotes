import { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import { Box, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { Badge, Button } from "#components/MUIDsfr.tsx";
import { AttachmentState } from "@powersync/web";
import { UploadImageModal } from "./UploadImageButton";
import { fr } from "@codegouvfr/react-dsfr";
import { MinimalAttachment, UploadImage } from "./UploadImage";
import { useActor } from "@xstate/react";
import { thumbnailMachine } from "./machines/thumbnailMachine";
import { useAttachmentImages } from "./hooks/useAttachmentImages";

export const UploadReportImage = ({ reportId }: { reportId: string }) => {
  const [selected, setSelected] = useState<{ attachment: MinimalAttachment; blobUrl: string } | null>(null);
  const { attachments, addMutation, deleteMutation, replaceAttachment } = useAttachmentImages(
    { table: "report_attachment", fkColumn: "report_id", fkValue: reportId },
    reportId,
  );

  return (
    <Box flex="1">
      <UploadImageModal
        selectedAttachment={selected?.attachment ?? null}
        blobUrl={selected?.blobUrl ?? null}
        onClose={() => setSelected(null)}
        onSave={() => {}}
        onReplaceAttachment={replaceAttachment}
      />
      <UploadImage
        onFiles={async (files) => {
          for (const file of files) {
            await addMutation.mutateAsync(file);
          }
        }}
        multiple
        attachments={attachments}
        onDelete={({ id }) => deleteMutation.mutate({ id })}
        onClick={(attachment, blobUrl) => setSelected({ attachment, blobUrl })}
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
}: {
  picture: MinimalAttachment;
  label: string;
  onEdit: (attachment: MinimalAttachment, blobUrl: string) => void;
  onDelete: (props: { id: string }) => void;
  isDisabled?: boolean;
}) => {
  const [snapshot, send] = useActor(thumbnailMachine, {
    input: { attachment: picture, hasLines: false },
  });

  // Push attachment changes into the machine.
  const prevPictureRef = useRef(picture);
  useEffect(() => {
    if (picture !== prevPictureRef.current) {
      send({ type: "ATTACHMENT_UPDATED", attachment: picture, hasLines: false });
      prevPictureRef.current = picture;
    }
  }, [picture, send]);

  // Revoke the final blob URL on unmount (machine handles intermediate revocations).
  const blobUrlRef = useRef<string | null>(null);
  blobUrlRef.current = snapshot.context.blobUrl;
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const { blobUrl, attachment, error: loadError, retryCount } = snapshot.context;
  const machineState = snapshot.value;

  const isLoading = machineState === "init" || machineState === "waitingForUri" || machineState === "loadingBlob";
  // Only show the error state after the first silent retry (retryCount > 1).
  // The first failure (retryCount === 1) is a known IndexedDB write-commit race
  // on fresh uploads — it resolves in ~100 ms and should not flash "Erreur".
  const hasError = machineState === "blobError" && retryCount > 1;

  const badgeStatus = (() => {
    if (hasError) return AttachmentState.ARCHIVED;
    if (isLoading) return AttachmentState.QUEUED_UPLOAD;
    return attachment.state ?? AttachmentState.QUEUED_UPLOAD;
  })();

  return (
    <Stack gap="4px" width={{ xs: "180px", sm: "200px", md: "240px" }}>
      <ReportStatus status={badgeStatus as any} />
      <Flex flexDirection="column" justifyContent="flex-end" width="100%" maxWidth="480px">
        <Box position="relative" width="100%" sx={{ height: "160px", overflow: "hidden", bgcolor: "#f0f0f0" }}>
          {
            hasError ? (
              <Flex height="100%" alignItems="center" justifyContent="center" flexDirection="column" gap="4px">
                <Typography fontSize="12px" color="text.secondary" textAlign="center" px="8px">
                  {loadError ?? "Impossible de charger l'image"}
                </Typography>
                <Button
                  type="button"
                  size="small"
                  priority="tertiary no outline"
                  iconId="fr-icon-refresh-line"
                  onClick={() => send({ type: "RETRY" })}
                >
                  Réessayer
                </Button>
              </Flex>
            ) : blobUrl ? (
              <Box
                component="img"
                src={blobUrl}
                data-picture-id={picture.id}
                sx={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
              />
            ) : null /* grey background shows during loading */
          }
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
            <Box borderRight="1px solid" borderColor={fr.colors.decisions.border.default.grey.default}>
              <Button
                type="button"
                iconId="ri-pencil-fill"
                priority="tertiary no outline"
                nativeButtonProps={{
                  "aria-label": "Annoter",
                  onClick: () => {
                    if (blobUrl) onEdit(picture, blobUrl);
                  },
                }}
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
  [AttachmentState.ARCHIVED]: { label: "Ok", bgColor: "#B8FEC9", color: "#18753C", icon: "fr-icon-success-line" },
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
