import { Button, Input } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, SxProps } from "@mui/material";
import { ReactNode, TextareaHTMLAttributes, useId } from "react";

type DictationTextAreaProps = {
  label: ReactNode;
  hintText?: ReactNode;
  /** Visually hides the label while keeping it available to assistive technologies */
  hideLabel?: boolean;
  disabled?: boolean;
  isRecording: boolean;
  onToggleRecording: () => void;
  hideDictationButton?: boolean;
  isDictationDisabled?: boolean;
  nativeTextAreaProps?: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> };
  sx?: SxProps;
};

/**
 * Textarea with a "Dicter" toggle button displayed on the right of its label.
 * The label is rendered outside of the DSFR Input so the button is not nested inside the <label> element.
 */
export const DictationTextArea = ({
  label,
  hintText,
  hideLabel,
  disabled,
  isRecording,
  onToggleRecording,
  hideDictationButton,
  isDictationDisabled,
  nativeTextAreaProps,
  sx,
}: DictationTextAreaProps) => {
  const generatedId = useId();
  const textAreaId = nativeTextAreaProps?.id ?? `dictation-textarea-${generatedId}`;
  const labelId = `${textAreaId}-label`;
  const statusId = `${textAreaId}-dictation-status`;

  return (
    <Box className={fr.cx("fr-input-group", disabled && "fr-input-group--disabled")} sx={sx}>
      <Flex justifyContent="space-between" alignItems="flex-end" gap="8px">
        <label
          id={labelId}
          className={fr.cx("fr-label", hideLabel && "fr-sr-only")}
          htmlFor={textAreaId}
          style={{ marginBottom: "8px" }}
        >
          {label}
          {hintText ? <span className={fr.cx("fr-hint-text")}>{hintText}</span> : null}
        </label>
        {hideDictationButton ? null : (
          <Button
            type="button"
            size="small"
            sx={{ flexShrink: 0, ml: "auto" }}
            disabled={isDictationDisabled}
            priority={isRecording ? "primary" : "tertiary"}
            iconId="ri-mic-fill"
            onClick={() => onToggleRecording()}
            nativeButtonProps={{
              "aria-pressed": isRecording,
              "aria-controls": textAreaId,
              "aria-describedby": labelId,
            }}
          >
            {isRecording ? "En cours" : "Dicter"}
          </Button>
        )}
      </Flex>
      <span id={statusId} role="status" className={fr.cx("fr-sr-only")}>
        {isRecording ? "Dictée en cours, appuyez à nouveau sur le bouton pour l'arrêter" : ""}
      </span>
      <Input
        sx={{ "& .fr-input": { mt: "0 !important" } }}
        label={null}
        textArea
        disabled={disabled}
        nativeTextAreaProps={{ ...nativeTextAreaProps, id: textAreaId }}
      />
    </Box>
  );
};
