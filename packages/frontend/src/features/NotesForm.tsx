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
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Stack } from "@mui/material";
import { Button, Center, Input } from "#components/MUIDsfr.tsx";
import { useStyles } from "tss-react";
import { useSpeechToTextV2 } from "./audio-record/SpeechRecorder.hook";

export const NotesForm = () => {
  const form = useFormContext<Report>();

  const isFormDisabled = useIsFormDisabled();

  return (
    <Flex flexDirection="column" width="100%" maxWidth="800px" padding="16px" mt={{ lg: "24px", xs: "16px" }}>
      <InputGroupWithTitle title="Décision & suite à donner">
        <DecisionChips disabled={isFormDisabled} />
        <PrecisionsTextArea />
      </InputGroupWithTitle>

      <UploadReportImage reportId={form.getValues().id} />

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
        <Button iconId="ri-article-fill" type="submit" disabled={isFormDisabled}>
          Créer le CR
        </Button>
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
