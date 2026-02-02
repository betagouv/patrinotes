import { fr } from "@codegouvfr/react-dsfr";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { deserializeMandatoryEmails, serializeMandatoryEmails } from "./StateReportAlert.utils";
import { addSIfPlural } from "../../../utils";
import { Flex } from "#components/ui/Flex.tsx";
import { useIsStateReportDisabled } from "../utils";
import { LinkButton } from "#components/ui/LinkButton.tsx";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { useDebounce } from "react-use";
import { AlertSectionName, AlertSectionsForm } from "./StateReportAlertsMenu";

export const StateReportAlertsEmailInput = ({
  mandatory_emails,
  additional_emails,
  form,
  name,
}: {
  mandatory_emails?: string | null;
  additional_emails?: string | null;
  form: AlertSectionsForm;
  name: AlertSectionName;
}) => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const mandatoryEmails = deserializeMandatoryEmails(mandatory_emails || "");
  const additionalEmails = additional_emails?.split(",").map((email) => email.trim()) || [];

  const serviceSuffix = addSIfPlural(mandatoryEmails.length);

  const isFormDisabled = useIsStateReportDisabled();

  return (
    <Stack>
      <Typography mt="8px" fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
        Service{serviceSuffix} destinataire{serviceSuffix} :{" "}
        {mandatoryEmails.map((e) => e.service).join(", ") || "Non spécifié"}
      </Typography>

      {isEditingEmail ? (
        <Stack mt="16px" gap="8px">
          <MandatoryEmailsForm initialValues={mandatoryEmails} form={form} name={name} />
          <AdditionalEmailsForm initialValues={additionalEmails} form={form} name={name} />
        </Stack>
      ) : (
        <Flex alignItems={{ xs: "start", lg: "center" }} flexDirection={{ xs: "column", sm: "row" }}>
          <Typography fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
            {[...mandatoryEmails.map((e) => e.email), ...additionalEmails].join(", ") || "Aucun courriel configuré"}
          </Typography>
          {!isFormDisabled && (
            <LinkButton type="button" onClick={() => setIsEditingEmail(true)}>
              Modifier
            </LinkButton>
          )}
        </Flex>
      )}
    </Stack>
  );
};

const MandatoryEmailsForm = ({
  initialValues,
  form,
  name,
}: {
  initialValues: { email: string; service: string }[];
  form: AlertSectionsForm;
  name: AlertSectionName;
}) => {
  const [values, setValues] = useState(initialValues);

  useDebounce(
    () => {
      const mandatory_emails = serializeMandatoryEmails(values);
      form.setValue(`${name}.mandatory_emails`, mandatory_emails);
    },
    500,
    [values],
  );

  return (
    <Stack>
      {values.map((val, index) => (
        <Input
          key={index}
          label={val.service ? `Courriel ${val.service}*` : "Courriel"}
          nativeInputProps={{
            type: "text",
            value: val.email,
            onChange: (e) => {
              const newValues = [...values];
              newValues[index].email = e.target.value;
              setValues(newValues);
            },
          }}
        />
      ))}
    </Stack>
  );
};

const AdditionalEmailsForm = ({
  initialValues,
  form,
  name,
}: {
  initialValues: string[];
  form: AlertSectionsForm;
  name: AlertSectionName;
}) => {
  const [values, setValues] = useState(initialValues);
  useDebounce(
    () => {
      const additional_emails = values.join(",");
      form.setValue(`${name}.additional_emails`, additional_emails);
    },
    500,
    [values],
  );

  return (
    <Stack>
      {values.map((val, index) => (
        <Input
          key={index}
          label={index === 0 ? "Courriels additionnels" : " "}
          sx={{ mb: "0 !important" }}
          nativeInputProps={{
            type: "text",
            value: val,
            onChange: (e) => {
              const newValues = [...values];
              newValues[index] = e.target.value;
              setValues(newValues);
            },
          }}
        />
      ))}
      <LinkButton sx={{ mt: "16px" }} onClick={() => setValues([...values, ""])}>
        + Ajouter un destinataire
      </LinkButton>
    </Stack>
  );
};
