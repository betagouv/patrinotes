import { useState, useRef, ChangeEvent, useEffect, RefObject } from "react";
import { v4, v7 } from "uuid";
import { deleteImageFromIdb, getPicturesStore, getUploadStatusStore } from "../idb";
import { InputGroup } from "#components/InputGroup.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { del, get, set } from "idb-keyval";
import { useFormContext } from "react-hook-form";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { ImageCanvas, Line } from "./DrawingCanvas";
import { api } from "../../api";
import { attachmentQueue, attachmentStorage, db, getAttachmentUrl, useDbQuery } from "../../db/db";
import { Pictures, Report, ReportAttachment } from "../../db/AppSchema";
import imageCompression from "browser-image-compression";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { Badge, Button, Center } from "#components/MUIDsfr.tsx";
import { useLiveUser } from "../../contexts/AuthContext";
import { AttachmentState } from "@powersync/attachments";
import { UploadImageButton, UploadImageModal, UploadImageWithEditModal } from "./UploadImageButton";
import { fr } from "@codegouvfr/react-dsfr";
import { MinimalAttachment, UploadImage } from "./UploadImage";

export const UploadReportImage = ({ reportId }: { reportId: string }) => {
  const form = useFormContext<Report>();
  const [selectedAttachment, setSelectedAttachment] = useState<MinimalAttachment | null>(null);
  const user = useLiveUser();

  const addImageFileMutation = useMutation(async (file: File) => {
    const attachmentId = `${reportId}/images/${v7()}.jpg`;
    const buffer = await processImage(file);

    await attachmentQueue.saveAttachment({
      attachmentId,
      buffer,
      mediaType: "image/jpeg",
    });

    await db
      .insertInto("report_attachment")
      .values({
        id: attachmentId,
        attachment_id: attachmentId,
        report_id: reportId,
        service_id: user!.service_id,
        created_at: new Date().toISOString(),
        is_deprecated: 0,
      })
      .execute();

    return attachmentId;
  });

  const picturesQuery = useDbQuery(
    db
      .selectFrom("report_attachment")
      .where("is_deprecated", "=", 0)
      .where("attachment_id", "like", "%.jpg")
      .where("report_id", "=", reportId)
      .selectAll()
      .orderBy("created_at", "asc"),
  );

  const pictures = picturesQuery.data ?? [];

  const deletePictureMutation = useMutation(async ({ id }: { id: string }) => {
    await attachmentStorage.deleteFile(id);
    await db.deleteFrom("report_attachment").where("id", "=", id).execute();
  });

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
        onFiles={async (files) => addImageFileMutation.mutateAsync(files[0])}
        multiple
        attachments={pictures}
        onDelete={({ id }) => deletePictureMutation.mutate({ id })}
        onClick={(attachment) => setSelectedAttachment(attachment)}
      />
    </Box>
  );
};

const useReportAttachmentQuery = (attachmentId: string | null) => {
  return useQuery({
    queryKey: ["report-attachment", attachmentId],
    queryFn: async () => {
      return db.selectFrom("report_attachment").where("id", "=", attachmentId).selectAll().executeTakeFirst();
    },
    enabled: !!attachmentId,
  });
};
const ReportPictures = ({
  onEdit,
  onDelete,
  pictures,
}: {
  onEdit: (props: { id: string; url: string }) => void;
  onDelete: (props: { id: string }) => void;
  pictures: ReportAttachment[];
}) => {
  if (!pictures?.length) return null;

  return (
    <Flex flexDirection="column" width="100%" my="40px">
      <InputGroup>
        <Grid
          display="grid"
          gap="16px"
          gridTemplateColumns={{ xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
        >
          {pictures?.map((picture, index) => (
            <PictureThumbnail
              key={picture.id}
              onEdit={onEdit}
              onDelete={onDelete}
              picture={picture}
              label={`N° ${index + 1}`}
            />
          ))}
        </Grid>
      </InputGroup>
    </Flex>
  );
};

export const PictureThumbnail = ({
  picture,
  label,
  onEdit,
  onDelete,
  isDisabled,
}: {
  picture: { id: string };
  label: string;
  onEdit: (props: { id: string; url: string }) => void;
  onDelete: (props: { id: string }) => void;
  isDisabled?: boolean;
}) => {
  const idbStatusQuery = useDbQuery(db.selectFrom("attachments").where("id", "=", picture.id).select("state"));
  const status = idbStatusQuery.data?.[0]?.state;
  const bgUrlQuery = useQuery({
    queryKey: ["picture", picture.id, status],
    queryFn: async () => {
      const buffer = await getAttachmentUrl(picture.id);
      return buffer;
    },
    refetchOnWindowFocus: false,
    enabled: status === AttachmentState.SYNCED || status === AttachmentState.QUEUED_UPLOAD,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pictureLines = useDbQuery(db.selectFrom("picture_lines").where("attachmentId", "=", picture.id).selectAll());

  useEffect(() => {
    drawCanvas();
  }, [pictureLines.data, bgUrlQuery.data]);
  const drawCanvas = () => {
    if (!canvasRef.current) return;
    if (!bgUrlQuery.data) return;
    if (!pictureLines.data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    const image = new Image();
    image.src = bgUrlQuery.data!;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    ctx.scale(dpr, dpr);

    image.onload = () => {
      const scaleX = displayWidth / image.width;
      const scaleY = displayHeight / image.height;
      const initialScale = Math.min(scaleX, scaleY) * 1.5;

      const xOffset = (displayWidth - image.width * initialScale) / 2;
      const yOffset = (displayHeight - image.height * initialScale) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.translate(xOffset, yOffset);
      ctx.scale(initialScale, initialScale);

      ctx.drawImage(image, 0, 0, image.width, image.height);

      const lines = JSON.parse(pictureLines.data?.[0]?.lines ?? "[]");

      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      lines.forEach((line: any) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        if (line.points.length > 0) {
          ctx.moveTo(line.points[0].x, line.points[0].y);
          for (let i = 1; i < line.points.length; i++) {
            ctx.lineTo(line.points[i].x, line.points[i].y);
          }
          ctx.stroke();
        }
      });
    };
  };
  const finalStatus = idbStatusQuery.data?.[0]?.state ?? AttachmentState.QUEUED_UPLOAD;

  return (
    <Stack gap="4px" width={{ xs: "100%", sm: "180px", md: "240px" }}>
      <ReportStatus status={finalStatus as any} />
      <Flex flexDirection="column" justifyContent="flex-end" width="100%">
        <Box ref={canvasRef} component="canvas" flex="1"></Box>
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
                onEdit({ id: picture.id, url: bgUrlQuery.data! });
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
  [AttachmentState.QUEUED_SYNC]: {
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
