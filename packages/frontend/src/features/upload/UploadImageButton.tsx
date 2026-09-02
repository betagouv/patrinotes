import { Button } from "#components/MUIDsfr.tsx";
import { Dialog, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useRef, useState } from "react";
import { ImageCanvas } from "./KonvaDrawingCanvas";
import { MinimalAttachment } from "./UploadImage";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { MobileModalActions } from "#components/MobileModalActions.tsx";
import { ReportAction } from "../state-report/StateReportActions";
import { isDesktopDevice } from "../../hooks/useIsDesktop";

// Quick test
type UploadImageButtonProps = {
  addImage: (files: File[]) => Promise<void>;
  multiple?: boolean;
  isDisabled?: boolean;
};

export const UploadImageButton = ({ addImage, multiple, isDisabled }: UploadImageButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadImageMutation = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      await addImage(files);
      fileInputRef.current!.value = "";
    },
  });

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    await uploadImageMutation.mutateAsync({ files: Array.from(files) });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const captureInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      {isModalOpen ? (
        <MobileModalActions onClose={() => setIsModalOpen(false)}>
          <ReportAction
            iconId="fr-icon-camera-fill"
            label="Prendre une photo"
            onClick={() => {
              captureInputRef.current?.click();
              setIsModalOpen(false);
            }}
          />
          <ReportAction
            iconId="fr-icon-image-add-fill"
            label="Ajouter depuis la galerie"
            onClick={() => {
              fileInputRef.current?.click();
              setIsModalOpen(false);
            }}
          />
        </MobileModalActions>
      ) : null}

      <Flex
        alignItems={{ xs: "start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: "8px", md: "12px" }}
      >
        <Button
          type="button"
          iconId="fr-icon-image-add-fill"
          priority="secondary"
          nativeButtonProps={{
            type: "button",
            onClick: () => {
              if (isDesktopDevice) {
                fileInputRef.current?.click();
                return;
              }
              setIsModalOpen(true);
            },
            disabled: isDisabled,
          }}
        >
          Ajouter photo
        </Button>
        <Typography color={fr.colors.decisions.text.mention.grey.default} fontSize="12px">
          Taille maximale : 5 Mo. Formats supportés : jpg, png.{multiple ? " Plusieurs fichiers possibles" : ""}
        </Typography>
      </Flex>
      <input
        disabled={isDisabled}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        multiple={multiple}
        style={{ display: "none" }}
      />
      <input
        disabled={isDisabled}
        ref={captureInputRef}
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

// MUI <Dialog> (same pattern as SectionLocalisationModal) covers the RGAA
// requirements: focus trap + focus restore, Escape to close, backdrop click to
// close, role="dialog" / aria-modal and body scroll lock.
const dialogSx = {
  ".MuiPaper-root": {
    width: { xs: "100%", lg: "634px" },
    maxWidth: { xs: "100%", lg: "634px" },
    height: { xs: "100dvh", lg: 792 },
    maxHeight: { xs: "100dvh", lg: "calc(100dvh - 32px)" },
    margin: "0!important",
  },
  zIndex: 1400,
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
  onReplaceAttachment?: (oldId: string, data: ArrayBuffer, label?: string) => Promise<string>;
  hideLabelInput?: boolean;
}) => {
  const closeRequestRef = useRef<(() => void) | null>(null);

  if (!selectedAttachment || !blobUrl) return null;

  return (
    <Dialog
      open
      onClose={() => (closeRequestRef.current ?? onClose)()}
      maxWidth={false}
      sx={dialogSx}
      aria-label="Éditeur d'image"
    >
      <ImageCanvas
        attachment={selectedAttachment}
        closeModal={onClose}
        closeRequestRef={closeRequestRef}
        onSave={onSave}
        onReplaceAttachment={onReplaceAttachment}
        url={blobUrl}
        lines={[]}
        hideLabelInput={hideLabelInput}
      />
    </Dialog>
  );
};
