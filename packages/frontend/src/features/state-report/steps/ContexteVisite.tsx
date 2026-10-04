import { Box, BoxProps, Stack, Typography } from "@mui/material";
import { useIsStateReportDisabled, useStateReportFormContext } from "../utils";
import { Alert, Input } from "#components/MUIDsfr.tsx";
import { InputGroup } from "#components/InputGroup.tsx";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { ContentBlock } from "./MonumentHistorique";
import { Divider } from "#components/ui/Divider.tsx";
import { ReactNode, useEffect, useRef, useState } from "react";
import { format, parse } from "date-fns";
import { Flex } from "#components/ui/Flex.tsx";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { MandatoryFieldReminder } from "./ConstatGeneral";
import { IconLink } from "#components/ui/IconLink.tsx";
import { ButtonsSwitch } from "../WithReferencePop";
import { fr } from "@codegouvfr/react-dsfr";

export const ContexteVisite = () => {
  const form = useStateReportFormContext();
  const isDisabled = useIsStateReportDisabled();

  return (
    <Stack
      px="16px"
      pl={{ xs: "16px", lg: "64px" }}
      pt={{ xs: "16px", lg: "14px" }}
      mb="40px"
      sx={{
        "input, textarea": {
          maxWidth: "588px",
        },
      }}
    >
      <Typography
        display={{
          xs: "none",
          lg: "block",
        }}
        fontSize="16px !important"
        variant="h3"
        fontWeight="500"
        pt="0 !important"
        component="h3"
        mb="40px"
        color={fr.colors.decisions.text.actionHigh.blueFrance.default}
      >
        Contexte de la visite
      </Typography>
      <EditDisabled />
      <MandatoryFieldReminder />

      <NatureVisiteRadioButtons isDisabled={isDisabled} />
      <Input
        textArea
        hintText="Déclenchement de la visite, durée, conditions..."
        disabled={isDisabled}
        nativeTextAreaProps={{
          rows: 4,
          ...form.register("visite_details"),
        }}
        label="Détails de la visite"
      />
      <BilanQuinquennalRadioButtons isDisabled={isDisabled} />

      <Divider mb="16px" />
      <DateInput
        isDisabled={isDisabled}
        form={form}
        name="date_visite"
        label={<Box className="mandatory-field">Date de la visite</Box>}
      />
      <Input
        id="redacted-by"
        disabled={isDisabled}
        label={<Box className="mandatory-field">Rédacteur du constat</Box>}
        nativeInputProps={{
          ...form.register("redacted_by"),
        }}
      />
      <PeopleList isDisabled={isDisabled} form={form} name="personnes_presentes" />
      <Divider mb="16px" />
      <Flex flexDirection={{ xs: "column", lg: "row" }} gap={{ xs: "0", lg: "16px" }}>
        <Input
          sx={{ width: "100%" }}
          disabled={isDisabled}
          id="proprietaire"
          label={<Box className="mandatory-field">Propriétaire</Box>}
          nativeInputProps={{
            ...form.register("proprietaire"),
          }}
        />
        <Input
          sx={{ width: "100%" }}
          disabled={isDisabled}
          id="proprietaire-email"
          label={<Box>Courriel du propriétaire</Box>}
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
      <ButtonsSwitch />
    </Stack>
  );
};

export const PeopleList = ({
  isDisabled,
  form,
  name,
  showInitialInput = false,
}: {
  isDisabled: boolean;
  form: UseFormReturn<any>;
  name: string;
  showInitialInput?: boolean;
}) => {
  const personnesPresentesRaw: string = useWatch({ control: form.control, name });

  // the format of the field is "person1\nperson2\nperson3"
  // the shouldShowEmptyInput is only used when the field is empty since the input must be hidden before the user clicks on "add"
  const [showNewInput, setShowNewInput] = useState(showInitialInput);
  const shouldShowEmptyInput = !personnesPresentesRaw && showNewInput;
  const personnesPresentes = shouldShowEmptyInput
    ? [""]
    : personnesPresentesRaw
      ? personnesPresentesRaw.split("\n")
      : [];

  const onChange = (index: number, value: string) => {
    const newPeople = [...personnesPresentes];
    newPeople[index] = value;
    form.setValue(name, newPeople.join("\n"));
  };

  return (
    <Stack mb="16px">
      {personnesPresentes.map((person, index) => (
        <Input
          key={index}
          disabled={isDisabled}
          label={index === 0 ? "Personnes présentes" : null}
          nativeInputProps={{
            value: person,
            onChange: (e) => {
              onChange(index, e.target.value);
            },
          }}
        />
      ))}

      <Box>
        <IconLink
          icon="ri-add-line"
          disabled={isDisabled}
          onClick={(e) => {
            e.preventDefault();
            if (!personnesPresentes?.length) {
              setShowNewInput(true);
              return;
            }
            form.setValue(name, [...personnesPresentes, ""].join("\n"));
          }}
          type="button"
        >
          Ajouter une personne présente
        </IconLink>
      </Box>
    </Stack>
  );
};

const DateInput = ({
  form,
  name,
  label,
  isDisabled,
  id,
}: {
  form: UseFormReturn<any>;
  name: string;
  label: ReactNode;
  isDisabled?: boolean;
  id?: string;
}) => {
  const rawValue = useWatch({ control: form.control, name });
  const dateString = rawValue ? format(new Date(rawValue), "yyyy-MM-dd") : null;
  const currentValueRef = useRef(dateString);

  return (
    <Input
      label={label}
      id={id}
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

          date.setHours(12, 0, 0, 0); // to avoid timezone issues
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
    <Stack gap={0} mb="1.5rem">
      <RadioButtons
        disabled={isDisabled}
        orientation={isDesktop ? "horizontal" : "vertical"}
        legend={<Box className="mandatory-field">Nature de la visite</Box>}
        id="nature-visite"
        options={options}
        style={{ marginBottom: 0 }}
      />
      {value === "partielle (préciser)" ? (
        <Input
          sx={{ mt: "16px" }}
          label="Partie visitée"
          disabled={isDisabled}
          nativeInputProps={{ ...form.register("visite_partielle_details") }}
        />
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

export const EditDisabled = (props: BoxProps) => {
  const form = useStateReportFormContext();
  const isSent = useWatch({ control: form.control, name: "attachment_id" });
  return isSent ? (
    <Box mb="32px" {...props}>
      <Alert
        severity="info"
        description="Vous ne pouvez pas modifier les informations d'un constat envoyé."
        small
      ></Alert>
    </Box>
  ) : null;
};
