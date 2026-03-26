import { Button, Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useRef } from "react";
import { ImageCanvas } from "./KonvaDrawingCanvas";
import { MinimalAttachment } from "./UploadImage";
import { useImageBlobUrl } from "./hooks/useImageBlobUrl";
import { usePictureLines } from "./hooks/usePictureLines";

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
        capture="environment"
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
  const url = useImageBlobUrl(selectedAttachment?.local_uri, selectedAttachment?.mediaType, selectedAttachment?.state);
  const lines = usePictureLines(selectedAttachment?.id, imageTable);
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
          {url && selectedAttachment ? (
            <ImageCanvas
              imageTable={imageTable}
              attachment={selectedAttachment}
              closeModal={() => onClose()}
              onSave={onSave}
              url={url}
              containerRef={containerRef}
              lines={lines}
              hideLabelInput={hideLabelInput}
            />
          ) : null}
        </Box>
      </Center>
    </Box>
  );
};
