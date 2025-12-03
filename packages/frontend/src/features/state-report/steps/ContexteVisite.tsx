import { Box, Stack, Typography } from "@mui/material";
import { useIsStateReportDisabled, useStateReportFormContext } from "../utils";
import { Input } from "#components/MUIDsfr.tsx";
import { InputGroup } from "#components/InputGroup.tsx";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { ContentBlock } from "./MonumentHistorique";
import { Divider } from "#components/ui/Divider.tsx";
import { ReactNode, useEffect, useRef } from "react";
import { format, parse } from "date-fns";
import { Flex } from "#components/ui/Flex.tsx";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { MandatoryFieldReminder } from "./ConstatGeneral";

export const ContexteVisite = () => {
  const form = useStateReportFormContext();
  const isDisabled = useIsStateReportDisabled();
  return (
    <Stack
      px="16px"
      pl={{ xs: "16px", lg: "64px" }}
      pt={{ xs: "16px", lg: "44px" }}
      mb="40px"
      sx={{
        input: {
          maxWidth: "588px",
        },
      }}
    >
      <Typography variant="h6" mb="32px" display={{ xs: "none", lg: "block" }}>
        Contexte de la visite
      </Typography>
      <MandatoryFieldReminder />
      <NatureVisiteRadioButtons isDisabled={isDisabled} />
      <BilanQuinquennalRadioButtons isDisabled={isDisabled} />
      <Divider mb="16px" />

      <DateInput
        isDisabled={isDisabled}
        form={form}
        name="date_visite"
        label={<Box className="mandatory-field">Date de la visite</Box>}
      />
      <Input
        disabled={isDisabled}
        label={<Box className="mandatory-field">Rédacteur du constat</Box>}
        nativeInputProps={{
          ...form.register("redacted_by"),
        }}
      />
      <Divider mb="16px" />
      <Flex flexDirection={{ xs: "column", lg: "row" }} gap={{ xs: "0", lg: "16px" }}>
        <Input
          sx={{ width: "100%" }}
          disabled={isDisabled}
          label={<Box className="mandatory-field">Propriétaire</Box>}
          nativeInputProps={{
            ...form.register("proprietaire"),
          }}
        />
        <Input
          sx={{ width: "100%" }}
          disabled={isDisabled}
          label={<Box className="mandatory-field">Courriel du propriétaire</Box>}
          nativeInputProps={{
            ...form.register("proprietaire_email"),
          }}
        />
      </Flex>
      <Flex flexDirection={{ xs: "column", lg: "row" }} gap={{ xs: "0", lg: "16px" }} mt={{ xs: "16px", lg: "0" }}>
        <Input
          sx={{ width: "100%" }}
          disabled={isDisabled}
          label="Représentant"
          nativeInputProps={{
            ...form.register("proprietaire_representant"),
          }}
        />
        <Input
          sx={{ width: "100%" }}
          disabled={isDisabled}
          label="Courriel du représentant"
          nativeInputProps={{
            ...form.register("proprietaire_representant_email"),
          }}
        />
      </Flex>
    </Stack>
  );
};

const DateInput = ({
  form,
  name,
  label,
  isDisabled,
}: {
  form: UseFormReturn<any>;
  name: string;
  label: ReactNode;
  isDisabled?: boolean;
}) => {
  const rawValue = useWatch({ control: form.control, name });
  const dateString = rawValue ? format(new Date(rawValue), "yyyy-MM-dd") : null;
  const currentValueRef = useRef(dateString);

  return (
    <Input
      label={label}
      disabled={isDisabled}
      nativeInputProps={{
        type: "date",
        value: currentValueRef.current || "",
        onChange: (e) => {
          currentValueRef.current = e.target.value;
          const date = parse(e.target.value, "yyyy-MM-dd", new Date());
          const isDateOk = !!e.target.value && !Number.isNaN(date.getTime());
          if (!isDateOk) {
            form.setValue(name, null);
            return;
          }
          form.setValue(name, date.toISOString());
        },
      }}
    />
  );
};

const NatureVisiteRadioButtons = ({ isDisabled }: { isDisabled: boolean }) => {
  const form = useStateReportFormContext();
  const isDesktop = useIsDesktop();
  const value = useWatch({ control: form.control, name: "nature_visite" });

  const options = ["Complète", "Partielle (préciser)"].map((label) => ({
    label,
    nativeInputProps: {
      checked: value === label.toLowerCase(),
      onChange: () => form.setValue("nature_visite", label.toLowerCase()),
    },
  }));

  return (
    <Stack gap={0} mb="16px">
      <RadioButtons
        disabled={isDisabled}
        orientation={isDesktop ? "horizontal" : "vertical"}
        legend={<Box className="mandatory-field">Nature de la visite</Box>}
        options={options}
        style={{ marginBottom: 0 }}
      />
      {value === "partielle (préciser)" ? (
        <Input disabled={isDisabled} label={null} nativeInputProps={{ ...form.register("visite_partielle_details") }} />
      ) : null}
    </Stack>
  );
};

const BilanQuinquennalRadioButtons = ({ isDisabled }: { isDisabled: boolean }) => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "bilan_quinquennal" });
  const nature = useWatch({ control: form.control, name: "nature_visite" });

  const options = ["Oui", "Non"].map((label) => ({
    label,
    nativeInputProps: {
      checked: value === label,
      onChange: () => form.setValue("bilan_quinquennal", label),
    },
  }));

  if (nature !== "Partielle (préciser)") {
    return null;
  }

  return (
    <RadioButtons
      disabled={isDisabled}
      legend="Ce constat doit-il être pris en compte pour le bilan quinquennal de l'édifice ?"
      options={options}
    />
  );
};
