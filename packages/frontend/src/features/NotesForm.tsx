import { ContactChips } from "#components/chips/ContactChips";
import { DecisionChips } from "#components/chips/DecisionChips";
import { FurtherInfoChips } from "#components/chips/FurtherInfoChips";
import { InputGroupWithTitle } from "#components/InputGroup";
import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Report } from "../db/AppSchema";
import { SpeechRecorder } from "./audio-record/SpeechRecorder";
import { useIsFormDisabled } from "./DisabledContext";
import { UploadReportImage } from "./upload/UploadReportImage";
import { useIsUploadingImages } from "./upload/pendingUploadsStore";
import { useUnsyncedReportAttachments } from "./upload/hooks/useUnsyncedReportAttachments";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Box, Stack, Typography } from "@mui/material";
import { Button, Center, Input } from "#components/MUIDsfr.tsx";
import { useStyles } from "tss-react";
import { useSpeechToTextV2 } from "./audio-record/SpeechRecorder.hook";
import { fr } from "@codegouvfr/react-dsfr";

export const NotesForm = () => {
  const form = useFormContext<Report>();
  const reportId = form.getValues().id;

  const isFormDisabled = useIsFormDisabled();

  const pendingDownloads = useUnsyncedReportAttachments(reportId);
  const isUploadingImages = useIsUploadingImages(reportId);
  const isMissingImages = pendingDownloads.length > 0 || isUploadingImages;

  return (
    <Flex flexDirection="column" width="100%" maxWidth="800px" padding="16px" mt={{ lg: "24px", xs: "16px" }}>
      <InputGroupWithTitle title="Décision & suite à donner">
        <DecisionChips disabled={isFormDisabled} />
        <PrecisionsTextArea />
      </InputGroupWithTitle>

      <UploadReportImage reportId={reportId} />

      <Divider mt="40px" mb="32px" />

      <Stack
        gap={{ xs: "0", lg: "118px" }}
        direction={{ xs: "column", lg: "row" }}
        sx={{
          "& label": {
            fontWeight: "bold",
            fontSize: "20px",
          },
        }}
      >
        <ContactChips disabled={isFormDisabled} />
        <FurtherInfoChips disabled={isFormDisabled} />
      </Stack>

      <Center justifyContent={{ xs: "center", lg: "flex-start" }} mt={{ xs: "80px", lg: "56px" }} mb="80px">
        <Box position="relative">
          <Button iconId="ri-article-fill" type="submit" disabled={isFormDisabled || isMissingImages}>
            Créer le CR
          </Button>

          {isMissingImages ? (
            <Typography
              className="fr-icon fr-icon__sm fr-icon-info-fill"
              sx={{ "::before": { mr: "4px" } }}
              position="absolute"
              fontSize="12px"
              color={fr.colors.decisions.text.default.info.default}
              left="0"
              top="calc(100% + 8px)"
              whiteSpace="nowrap"
            >
              Image(s) en cours d'ajout...
            </Typography>
          ) : null}
        </Box>
      </Center>
    </Flex>
  );
};

const PrecisionsTextArea = () => {
  const form = useFormContext<Report>();
  const isFormDisabled = useIsFormDisabled();

  const value = useWatch({ control: form.control, name: "precisions" });
  const setValue = (val: string) => form.setValue("precisions", val);

  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      setValue(form.getValues("precisions") + " " + text);
    },
  });

  const isIdleProps = form.register("precisions");
  const isListeningProps = {
    ...isIdleProps,
    value: value + " " + transcript,
    onChange: () => {},
  };

  const textAreaProps = isRecording ? isListeningProps : isIdleProps;
  return (
    <Flex flexDirection="column">
      <Input
        sx={{ mt: "24px" }}
        disabled={isFormDisabled || isRecording}
        label={"Commentaire"}
        textArea
        nativeTextAreaProps={{
          ...textAreaProps,
          id: "precisions",
          rows: 5,
        }}
      />
      <Button
        disabled={isFormDisabled}
        type="button"
        priority={isRecording ? "primary" : "tertiary"}
        iconId="ri-mic-fill"
        onClick={() => toggle()}
        sx={{ mt: "-16px", mb: "8px", width: "fit-content" }}
      >
        {isRecording ? <>En cours</> : <>Dicter</>}
      </Button>
    </Flex>
  );
};
