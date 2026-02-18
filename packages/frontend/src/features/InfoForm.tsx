import { EmailInput } from "#components/EmailInput.tsx";
import { InputGroupWithTitle } from "#components/InputGroup";
import { Button, Center, Input, Select } from "#components/MUIDsfr.tsx";
import { SmartAddressInput } from "#components/SmartAddressInput.tsx";
import { useTabsContext } from "#components/Tabs.tsx";
import { SpaceTypeChips } from "#components/chips/SpaceTypeChips";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box } from "@mui/material";
import { format, parse } from "date-fns";
import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useUser } from "../contexts/AuthContext";
import { Report } from "../db/AppSchema";
import { db, useDbQuery } from "../db/db";
import { useIsFormDisabled } from "./DisabledContext";
import { ServiceInstructeurSelect } from "./ServiceInstructeurSelect";
import { useSpeechToTextV2 } from "./audio-record/SpeechRecorder.hook";

export const InfoForm = () => {
  const form = useFormContext<Report>();
  const user = useUser()!;

  const isFormDisabled = useIsFormDisabled();

  const meetDate = useWatch({ control: form.control, name: "meetDate" });
  const meetDateRef = useRef({
    day: meetDate ? format(new Date(meetDate), "yyyy-MM-dd") : "",
    time: meetDate ? format(new Date(meetDate), "HH:mm") : "",
  });

  const redactedById = useWatch({ control: form.control, name: "redactedById" });

  const tryToSetMeetDate = () => {
    const day = meetDateRef.current.day;
    const time = meetDateRef.current.time;

    const date = parse(`${day}T${time}`, "yyyy-MM-dd'T'HH:mm", new Date());
    if (!day || !time || Number.isNaN(date.getTime())) {
      form.setValue("meetDate", undefined as any);
      return;
    }

    const offsetMs = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offsetMs);
    form.setValue("meetDate", localDate.toISOString() as any);
  };

  const setTime = (e: any) => {
    meetDateRef.current.time = e.target.value;
    tryToSetMeetDate();
  };

  const setDay = (e: any) => {
    meetDateRef.current.day = e.target.value;
    tryToSetMeetDate();
  };

  const redactedByQuery = useDbQuery(
    db
      .selectFrom("delegation")
      .where("delegatedTo", "=", user.id)
      .innerJoin("user", "user.id", "delegation.createdBy")
      .selectAll("delegation")
      .select("user.name as createdByName"),
  );

  const redactedByOptions: { value: string; label: string }[] = [
    {
      value: user.id,
      label: user.name,
    },
    ...(redactedByQuery.data?.map((delegation) => ({
      value: delegation.createdBy!,
      label: delegation.createdByName!,
    })) ?? []),
  ];

  const { setTab } = useTabsContext();

  const baseRedactedByProps = form.register("redactedById");
  const redactedByProps = {
    ...baseRedactedByProps,
    onChange: (e: any) => {
      const option = redactedByOptions.find((option) => option.value === e.target.value);

      baseRedactedByProps.onChange(e);
      form.setValue("redactedBy", option?.label ?? null);
    },
  };

  const applicantEmail = useWatch({ control: form.control, name: "applicantEmail" });

  return (
    <Flex flexDirection="column" width="100%" maxWidth="800px" padding="16px">
      <InputGroupWithTitle title="Le rendez-vous">
        <Flex gap={{ xs: "0", lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }}>
          <Select
            sx={{ flex: { xs: "none", lg: 1 }, mb: { xs: "24px", lg: "16px" } }}
            label="Rédigé par"
            disabled={isFormDisabled}
            nativeSelectProps={redactedByProps}
          >
            {redactedByOptions?.map((option) => (
              <option key={option.value} value={option.value} selected={redactedById === option.value}>
                {option.label}
              </option>
            )) ?? null}
          </Select>
          <Input
            sx={{ flex: { xs: "none", lg: 1 }, mb: { xs: "16px", lg: "16px" } }}
            disabled={isFormDisabled}
            label="Nom du demandeur"
            nativeInputProps={form.register("applicantName")}
          />
        </Flex>

        <Box mt="8px">
          <EmailInput
            value={[applicantEmail ?? ""]}
            label={"Courriel demandeur"}
            single
            onValueChange={(e) => form.setValue("applicantEmail", e[0])}
          />
        </Box>

        <Flex gap="16px" flexDirection="row" mt="32px">
          <Input
            sx={{ flex: { xs: "none", lg: 1 }, mb: { xs: "16px", lg: undefined } }}
            disabled={isFormDisabled}
            label="Date"
            nativeInputProps={{ type: "date", onChange: setDay, value: meetDateRef.current.day }}
          />
          <Input
            sx={{ flex: { xs: "none", lg: 1 }, mb: { xs: "16px", lg: undefined } }}
            disabled={isFormDisabled}
            label="Horaire"
            nativeInputProps={{ type: "time", onChange: setTime, value: meetDateRef.current.time }}
          />
        </Flex>
      </InputGroupWithTitle>

      <Divider mt="20px" mb="52px" />

      <InputGroupWithTitle title="Le projet">
        <DescriptionInput />

        <SmartAddressInput />
        <Flex gap={{ xs: "0", lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }}>
          <Input
            sx={{ flex: { xs: "none", lg: 1 }, mb: { xs: "24px", lg: undefined } }}
            disabled={isFormDisabled}
            label="Code postal"
            nativeInputProps={form.register("zipCode")}
          />
          <Input
            sx={{ flex: { xs: "none", lg: 1 }, mb: { xs: "24px", lg: undefined } }}
            disabled={isFormDisabled}
            label="Commune"
            nativeInputProps={form.register("city")}
          />
        </Flex>
        <Flex gap={{ xs: "0", lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }}>
          <Input
            sx={{ flex: { xs: "none", lg: 1 }, mb: "24px" }}
            disabled={isFormDisabled}
            label="Référence cadastrale"
            nativeInputProps={{ ...form.register("projectCadastralRef"), placeholder: "Seulement la principale" }}
          />
          <Box
            sx={{
              flex: {
                xs: "none",
                lg: 1,
              },
            }}
          >
            <ServiceInstructeurSelect disabled={isFormDisabled} />
          </Box>
        </Flex>
        <SpaceTypeChips className={{ flex: { xs: "none", lg: 1 } }.toString()} disabled={isFormDisabled} />
      </InputGroupWithTitle>

      <Center justifyContent={{ xs: "center", lg: "flex-start" }} mt={{ xs: "30px", lg: "50px" }} mb="120px">
        <Button
          type="button"
          iconId="ri-arrow-right-line"
          nativeButtonProps={{
            type: "button",
            onClick: () => {
              setTab("notes");
            },
          }}
        >
          Rédiger le bilan
        </Button>
      </Center>
    </Flex>
  );
};

const DescriptionInput = () => {
  const isFormDisabled = useIsFormDisabled();
  const form = useFormContext<Report>();

  const value = useWatch({ control: form.control, name: "projectDescription" });
  const setValue = (val: string) => form.setValue("projectDescription", val);

  const { isRecording, transcript, toggle } = useSpeechToTextV2({
    onEnd: (text) => {
      setValue(form.getValues("projectDescription") + " " + text);
    },
  });

  const isIdleProps = form.register("projectDescription");
  const isListeningProps = {
    ...isIdleProps,
    value: value + " " + transcript,
    onChange: () => {},
  };

  const textAreaProps = isRecording ? isListeningProps : isIdleProps;

  return (
    <Input
      sx={{ mt: "24px", "& > textarea": { mt: "0 !important" } }}
      disabled={(isFormDisabled || isRecording) ?? false}
      label={
        <Flex justifyContent="space-between" width="100%">
          <span>Description</span>

          <Button
            disabled={isFormDisabled}
            type="button"
            priority={isRecording ? "primary" : "tertiary"}
            iconId="ri-mic-fill"
            onClick={() => toggle()}
          >
            {isRecording ? <>En cours</> : <>Dicter</>}
          </Button>
        </Flex>
      }
      textArea
      nativeTextAreaProps={{ ...textAreaProps, rows: 5 }}
    />
  );
};
