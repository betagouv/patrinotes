import { fr } from "@codegouvfr/react-dsfr";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { AlertErrors } from "./StateReportAlert.utils";
import { addSIfPlural } from "../../../utils";
import { Flex } from "#components/ui/Flex.tsx";
import { useIsStateReportDisabled } from "../utils";
import { LinkButton } from "#components/ui/LinkButton.tsx";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { useDebounce } from "react-use";
import { AlertSectionName, AlertSectionsForm } from "./StateReportAlertsMenu";
import { deserializeMandatoryEmails, serializeMandatoryEmails } from "@cr-vif/pdf/utils";
import { useWatch } from "react-hook-form";

export const StateReportAlertsEmailInput = ({
  mandatory_emails,
  additional_emails,
  form,
  names,
  errors,
  isEditingEmail,
  setIsEditingEmail,
}: {
  mandatory_emails?: string | null;
  additional_emails?: string | null;
  form: AlertSectionsForm;
  names: AlertSectionName[];
  isEditingEmail: boolean;
  setIsEditingEmail: (isEditing: boolean) => void;
  errors: AlertErrors | null;
}) => {
  const mandatoryEmails = deserializeMandatoryEmails(mandatory_emails || "");
  const additionalEmails =
    additional_emails
      ?.split(",")
      .map((email) => email.trim())
      .filter(Boolean) || [];

  const serviceSuffix = addSIfPlural(mandatoryEmails.length);

  const isFormDisabled = useIsStateReportDisabled();

  const should_send = useWatch({ control: form.control, name: `${names[0]}.should_send` });

  if (!should_send) {
    return null;
  }

  return (
    <Stack>
      <Typography mt="8px" fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
        Service{serviceSuffix} destinataire{serviceSuffix} :{" "}
        {mandatoryEmails.map((e) => e.service).join(", ") || "Non spécifié"}
      </Typography>

      {isEditingEmail ? (
        <Stack mt="16px" gap="8px">
          <MandatoryEmailsForm initialValues={mandatoryEmails} form={form} names={names} errors={errors} />
          <AdditionalEmailsForm initialValues={additionalEmails} form={form} names={names} />
        </Stack>
      ) : (
        <Flex alignItems={{ xs: "start", lg: "center" }} flexDirection={{ xs: "column", sm: "row" }}>
          <Typography fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
            {[...mandatoryEmails.map((e) => e.email), ...additionalEmails].filter(Boolean).join(", ") ||
              "Aucun courriel configuré"}
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
  names,
  errors,
}: {
  initialValues: { email: string; service: string }[];
  form: AlertSectionsForm;
  names: AlertSectionName[];
  errors: AlertErrors | null;
}) => {
  const [values, setValues] = useState(initialValues);

  useDebounce(
    () => {
      const mandatory_emails = serializeMandatoryEmails(values);
      for (const name of names) {
        form.setValue(`${name}.mandatory_emails`, mandatory_emails);
      }
    },
    500,
    [values],
  );

  return (
    <Stack>
      {values.map((val, index) => {
        const inputErrors = errors?.email.filter((e) => e.service === val.service);
        const error = inputErrors && inputErrors.length > 0 ? inputErrors[0] : null;

        return (
          <Input
            state={error ? "error" : undefined}
            stateRelatedMessage={error ? error.error : undefined}
            key={index}
            label={val.service ? `Courriel ${val.service}*` : "Courriel"}
            nativeInputProps={{
              autoComplete: `mandatory-email-${val.service}-${index}`,
              type: "text",
              value: val.email,
              onChange: (e) => {
                const newValues = [...values];
                newValues[index].email = e.target.value;
                setValues(newValues);
              },
            }}
          />
        );
      })}
    </Stack>
  );
};

const AdditionalEmailsForm = ({
  initialValues,
  form,
  names,
}: {
  initialValues: string[];
  form: AlertSectionsForm;
  names: AlertSectionName[];
}) => {
  const [values, setValues] = useState(initialValues);
  useDebounce(
    () => {
      const additional_emails = values.join(",");
      for (const name of names) {
        form.setValue(`${name}.additional_emails`, additional_emails);
      }
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
            autoComplete: `additional-email-${index}`,
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
