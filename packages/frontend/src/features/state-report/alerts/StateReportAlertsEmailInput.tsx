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
import { useForm } from "react-hook-form";
import { useRefreshForm } from "../../../hooks/useFormWithFocus";
import { useSyncForm } from "#components/SyncForm.tsx";

export const StateReportAlertsEmailInput = ({
  mandatory_emails,
  additional_emails,
  errors,
  isEditingEmail,
  setIsEditingEmail,
  saveEmails,
}: {
  mandatory_emails?: string | null;
  additional_emails?: string | null;
  isEditingEmail: boolean;
  setIsEditingEmail: (isEditing: boolean) => void;
  errors: AlertErrors | null;
  saveEmails: (mandatory_emails: string, additional_emails: string) => Promise<void>;
}) => {
  const form = useForm({ defaultValues: { mandatory_emails, additional_emails } });

  useSyncForm({
    form,
    baseObject: { mandatory_emails, additional_emails },
    syncObject: async (_, diff) => {
      console.log("syncing emails with diff", diff);
      await saveEmails(diff.mandatory_emails || "", diff.additional_emails || "");
    },
  });

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
          <MandatoryEmailsForm
            initialValues={mandatoryEmails}
            saveMandatoryEmails={(str) => form.setValue("mandatory_emails", str)}
            errors={errors}
          />
          <AdditionalEmailsForm
            initialValues={additionalEmails}
            saveAdditionalEmails={(str) => form.setValue("additional_emails", str)}
          />
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
  errors,
  saveMandatoryEmails,
}: {
  initialValues: { email: string; service: string }[];
  errors: AlertErrors | null;
  saveMandatoryEmails: (mandatory_emails: string) => void;
}) => {
  const [values, setValues] = useState(initialValues);

  useDebounce(
    () => {
      const mandatory_emails = serializeMandatoryEmails(values);
      saveMandatoryEmails(mandatory_emails);
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
  saveAdditionalEmails,
}: {
  initialValues: string[];
  saveAdditionalEmails: (additional_emails: string) => void;
}) => {
  const [values, setValues] = useState(initialValues);
  useDebounce(
    () => {
      const additional_emails = values
        .filter(Boolean)
        .map((val) => val.trim())
        .join(",");
      saveAdditionalEmails(additional_emails);
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
