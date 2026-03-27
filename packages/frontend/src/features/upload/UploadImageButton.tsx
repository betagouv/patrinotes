import { Button, Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef } from "react";
import { ImageCanvas } from "./KonvaDrawingCanvas";
import { MinimalAttachment } from "./UploadImage";
import { usePictureLines } from "./hooks/usePictureLines";
import { attachmentLocalStorage } from "../../db/db";

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
  const localUri = selectedAttachment?.local_uri;
  const mediaType = selectedAttachment?.mediaType;
  const blobQuery = useQuery({
    queryKey: ["image-blob-url-direct", localUri],
    queryFn: async () => {
      const buffer = await attachmentLocalStorage.readFile(localUri!);
      const blob = new Blob([buffer], { type: mediaType ?? "image/jpeg" });
      return URL.createObjectURL(blob);
    },
    enabled: !!localUri,
    refetchOnWindowFocus: false,
    retry: 2,
  });
  const prevUrlRef = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, [blobQuery.data]);
  if (blobQuery.data && blobQuery.data !== prevUrlRef.current) {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    prevUrlRef.current = blobQuery.data;
  }
  const url = prevUrlRef.current;

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
