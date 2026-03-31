import { Button, Center } from "#components/MUIDsfr.tsx";
import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImageCanvas } from "./KonvaDrawingCanvas";
import { MinimalAttachment } from "./UploadImage";

type UploadImageButtonProps = {
  addImage: (files: File[]) => Promise<void>;
  multiple?: boolean;
  isDisabled?: boolean;
};

export const UploadImageButton = ({ addImage, multiple, isDisabled }: UploadImageButtonProps) => {
  const uploadImageMutation = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      await addImage(files);
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

export const UploadImageModal = ({
  selectedAttachment,
  blobUrl,
  onClose,
  onSave,
  onReplaceAttachment,
  hideLabelInput,
}: {
  selectedAttachment: MinimalAttachment | null;
  blobUrl: string | null;
  onClose: () => void;
  onSave?: (props: MinimalAttachment & { url: string }) => void;
  onReplaceAttachment?: (oldId: string, data: ArrayBuffer) => Promise<string>;
  hideLabelInput?: boolean;
}) => {
  const [vvHeight, setVvHeight] = useState<number>(() => window.visualViewport?.height ?? window.innerHeight);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handler = () => setVvHeight(vv.height);
    vv.addEventListener("resize", handler);
    return () => vv.removeEventListener("resize", handler);
  }, []);

  if (!selectedAttachment) return null;

  return (
    <Box zIndex="1000" position="fixed" top="0" left="0" right="0" width="100vw" height={vvHeight}>
      <Box bgcolor="rgba(0, 0, 0, 0.5)" position="fixed" top="0" left="0" right="0" bottom="0" />
      <Center width="100%" height="100%">
        <Box
          bgcolor="white"
          position="relative"
          width={{ xs: "100%", lg: "634px" }}
          height={{ xs: vvHeight, lg: 792 }}
        >
          {blobUrl ? (
            <ImageCanvas
              attachment={selectedAttachment}
              closeModal={() => onClose()}
              onSave={onSave}
              onReplaceAttachment={onReplaceAttachment}
              url={blobUrl}
              lines={[]}
              hideLabelInput={hideLabelInput}
            />
          ) : null}
        </Box>
      </Center>
    </Box>
  );
};
