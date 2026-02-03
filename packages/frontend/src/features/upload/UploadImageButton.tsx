import { Button, Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, ComponentProps, RefObject, useRef, useState } from "react";
import { db, getAttachmentUrl } from "../../db/db";
import { ImageCanvas } from "./DrawingCanvas";
import { MinimalAttachment } from "./UploadImage";

type UploadImageButtonProps = {
  addImage: ({ files }: { files: File[] }) => Promise<void>;
  multiple?: boolean;
  isDisabled?: boolean;
};

export const UploadImageButton = ({ addImage, multiple, isDisabled }: UploadImageButtonProps) => {
  const uploadImageMutation = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      await addImage({ files });
      ref.current!.value = "";
    },
  });

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    await uploadImageMutation.mutateAsync({ files: Array.from(files) });
  };

  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Button
        type="button"
        iconId="fr-icon-image-add-fill"
        priority="secondary"
        nativeButtonProps={{
          type: "button",
          onClick: () => ref.current?.click(),
          disabled: isDisabled,
        }}
      >
        Ajouter photo
      </Button>
      <input
        disabled={isDisabled}
        ref={ref as any}
        type="file"
        accept="image/*"
        onChange={onChange}
        multiple={multiple}
        style={{ display: "none" }}
      />
    </>
  );
};

export const UploadImageWithEditModal = ({
  addImage,
  selectedAttachment,
  onClose,
  hideButton,
  imageTable,
  multiple,
}: UploadImageButtonProps & {
  selectedAttachment: MinimalAttachment | null;
  onClose: () => void;
  hideButton?: boolean;
  imageTable: string;
}) => {
  return (
    <Flex>
      {selectedAttachment ? (
        <UploadImageModal selectedAttachment={selectedAttachment} onClose={onClose} imageTable={imageTable} />
      ) : null}
      {!hideButton ? <UploadImageButton addImage={addImage} multiple={multiple} /> : null}
    </Flex>
  );
};

export const UploadImageModal = ({
  selectedAttachment,
  onClose,
  onSave,
  imageTable,
  hideLabelInput,
}: {
  selectedAttachment: MinimalAttachment | null;
  onClose: () => void;
  onSave?: (props: MinimalAttachment & { url: string }) => void;
  imageTable?: string;
  hideLabelInput?: boolean;
}) => {
  const urlQuery = useQuery({
    queryKey: ["attachment-url", selectedAttachment?.id],
    queryFn: async () => {
      const url = await getAttachmentUrl(selectedAttachment!.id);
      return url;
    },
    enabled: !!selectedAttachment,
  });

  const linesQuery = useQuery({
    queryKey: ["lines", selectedAttachment?.id],
    queryFn: async () => {
      const linesQuery = await db
        .selectFrom("picture_lines")
        .where("attachmentId", "=", selectedAttachment!.id)
        .selectAll()
        .execute();

      return JSON.parse(linesQuery?.[0]?.lines ?? "[]");
    },
    enabled: !!selectedAttachment,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Box
      display={selectedAttachment ? "initial" : "none"}
      zIndex="1000"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      width="100vw"
      height="100vh"
    >
      <Box bgcolor="rgba(0, 0, 0, 0.5)" position="fixed" top="0" left="0" right="0" bottom="0"></Box>
      <Center width="100%" height="100%">
        <Box
          ref={containerRef}
          bgcolor="white"
          position="relative"
          width={{ xs: "100%", lg: "634px" }}
          height={{ xs: "auto", lg: "792px" }}
          maxHeight={{ xs: "100vh", lg: "100vh" }}
        >
          {urlQuery.data && selectedAttachment ? (
            <ImageCanvas
              imageTable={imageTable}
              attachment={selectedAttachment}
              closeModal={() => onClose()}
              onSave={onSave}
              url={urlQuery.data!}
              containerRef={containerRef}
              lines={linesQuery.data}
              hideLabelInput={hideLabelInput}
            />
          ) : null}
        </Box>
      </Center>
    </Box>
  );
};
