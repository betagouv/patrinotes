import { fr } from "@codegouvfr/react-dsfr";
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AlertErrors } from "./StateReportAlert.utils";
import { Flex } from "#components/ui/Flex.tsx";
import { useIsStateReportDisabled } from "../utils";
import { LinkButton } from "#components/ui/LinkButton.tsx";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { useDebounce } from "react-use";
import { AlertSectionName, AlertSectionsForm } from "./StateReportAlertsMenu";
import { addSIfPlural, deserializeMandatoryEmails, serializeMandatoryEmails } from "@patrinotes/pdf/utils";
import { useWatch } from "react-hook-form";
import { capRecipients, countRecipients, MAX_RECIPIENTS, TOO_MANY_RECIPIENTS_MESSAGE } from "../../recipientLimit";

/** Addresses of the additional fields, split like the server does ("a@x.fr,b@x.fr" typed in one field gives two). */
const splitAdditional = (values: readonly string[]) => values.flatMap((value) => value.split(","));

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

      {/* the editing flag lives in a global store and may outlive finalisation */}
      {isEditingEmail && !isFormDisabled ? (
        <Stack mt="16px" gap="8px">
          <MandatoryEmailsForm initialValues={mandatoryEmails} form={form} names={names} errors={errors} />
          <AdditionalEmailsForm initialValues={additionalEmails} form={form} names={names} />
        </Stack>
      ) : (
        <Flex
          alignItems={{ xs: "start", lg: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={{ xs: 0, sm: "8px" }}
        >
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
  const [limitHitIndex, setLimitHitIndex] = useState<number | null>(null);
  const additionalEmails = useWatch({ control: form.control, name: `${names[0]}.additional_emails` }) ?? "";
  const count = countRecipients([...values.map((v) => v.email), ...additionalEmails.split(",")]);
  useEffect(() => {
    if (count < MAX_RECIPIENTS) setLimitHitIndex(null);
  }, [count]);

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
        const error =
          limitHitIndex === index
            ? { error: TOO_MANY_RECIPIENTS_MESSAGE }
            : inputErrors && inputErrors.length > 0
              ? inputErrors[0]
              : null;

        return (
          <Input
            state={error ? "error" : undefined}
            stateRelatedMessage={error ? error.error : undefined}
            key={index}
            label={val.service ? <div className="mandatory-field">Courriel {val.service}</div> : "Courriel"}
            nativeInputProps={{
              autoComplete: `mandatory-email-${val.service}-${index}`,
              type: "text",
              value: val.email,
              onChange: (e) => {
                const newValues = values.map((v, i) => (i === index ? { ...v, email: e.target.value } : v));
                const nextCount = countRecipients([...newValues.map((v) => v.email), ...additionalEmails.split(",")]);
                // same limit as the server: an address that would be the 21st is not taken
                if (nextCount > MAX_RECIPIENTS && nextCount > count) {
                  setLimitHitIndex(index);
                  return;
                }
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
  // an address was refused because the alert already has MAX_RECIPIENTS: the message stays
  // under the fields until an address is removed
  const [limitHit, setLimitHit] = useState(false);
  const mandatoryEmails = deserializeMandatoryEmails(
    useWatch({ control: form.control, name: `${names[0]}.mandatory_emails` }) ?? "",
  ).map((e) => e.email);
  const count = countRecipients([...mandatoryEmails, ...splitAdditional(values)]);
  const showLimitError = limitHit && count >= MAX_RECIPIENTS;
  useEffect(() => {
    if (count < MAX_RECIPIENTS) setLimitHit(false);
  }, [count]);

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
              // the other fields count first; in this one, the addresses beyond the limit are not taken
              const others = [...mandatoryEmails, ...splitAdditional(values.filter((_, i) => i !== index))];
              const { kept, dropped } = capRecipients(e.target.value.split(","), others);
              if (dropped) setLimitHit(true);
              const newValues = [...values];
              newValues[index] = kept.join(",");
              setValues(newValues);
            },
          }}
        />
      ))}
      {showLimitError ? <p className="fr-error-text">{TOO_MANY_RECIPIENTS_MESSAGE}</p> : null}
      <LinkButton
        sx={{ mt: "16px" }}
        onClick={() => {
          if (count >= MAX_RECIPIENTS) return setLimitHit(true);
          setValues([...values, ""]);
        }}
      >
        + Ajouter un destinataire
      </LinkButton>
    </Stack>
  );
};
