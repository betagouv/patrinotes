import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { Center, Select } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { PopObjet, StateReportAlert } from "../../../db/AppSchema";
import { db, useDbQuery } from "../../../db/db";
import { uppercaseFirstLetterIf } from "../../../utils";
import { MenuTitle, ModalBackButton } from "../../menu/MenuTitle";
import { useIsStateReportDisabled, useStateReportFormContext } from "../utils";
import { SectionCommentaires, SectionPhotos, ShowInReportToggle } from "./SectionCommentaires";
import { AlertErrors, checkAlertErrors } from "./StateReportAlert.utils";
import { StateReportAlertsEmailInput } from "./StateReportAlertsEmailInput";
import { AlertSectionName, AlertSectionsForm } from "./StateReportAlertsMenu";
import { useMHObjetsQuery } from "./StateReportAlerts.hook";
import { useFormWithFocus, useRefreshForm } from "../../../hooks/useFormWithFocus";
import { useSyncForm } from "#components/SyncForm.tsx";

const routeApi = getRouteApi("/constat/$constatId");

export const StateReportAlertObjetSectionForm = ({
  title,
  onClose,
  onBack,
}: {
  title: string;
  onClose: () => void;
  onBack: (data?: StateReportAlert[]) => void;
}) => {
  const isFormDisabled = useIsStateReportDisabled();
  const { constatId } = routeApi.useParams();
  const mhObjetsQuery = useMHObjetsQuery(constatId);

  const alertsQuery = useDbQuery(
    db
      .selectFrom("state_report_alert")
      .where("state_report_id", "=", constatId)
      .where("alert", "=", title)
      .orderBy("id", "asc")
      .select("id"),
  );

  const emailsQuery = useDbQuery(
    db
      .selectFrom("state_report_alert")
      .where("state_report_id", "=", constatId)
      .where("alert", "=", title)
      .select(["mandatory_emails", "additional_emails"]),
  );

  const saveEmailsMutation = useMutation({
    mutationFn: async ({
      mandatory_emails,
      additional_emails,
    }: {
      mandatory_emails: string;
      additional_emails: string;
    }) => {
      await db
        .updateTable("state_report_alert")
        .set({ mandatory_emails, additional_emails })
        .where("state_report_id", "=", constatId)
        .where("alert", "=", title)
        .execute();
    },
  });

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [errors, setErrors] = useState<AlertErrors | null>(null);

  return (
    <Stack component="form" onSubmit={(e) => console.log(e)}>
      <MenuTitle onClose={onClose} hideDivider>
        <ModalBackButton onClick={onBack} />
      </MenuTitle>

      <Typography fontSize="16px" fontWeight="bold">
        Alerte : {title}
      </Typography>

      <StateReportAlertsEmailInput
        mandatory_emails={emailsQuery.data?.[0]?.mandatory_emails}
        additional_emails={emailsQuery.data?.[0]?.additional_emails}
        saveEmails={(mandatory_emails, additional_emails) =>
          saveEmailsMutation.mutateAsync({ mandatory_emails, additional_emails })
        }
        isEditingEmail={isEditingEmail}
        setIsEditingEmail={setIsEditingEmail}
        errors={errors}
      />

      <Stack mt="24px">
        {mhObjetsQuery.isLoading ? (
          <Center mt="80px">
            <Spinner />
          </Center>
        ) : null}

        <Flex gap="8px" mb="16px">
          <FullWidthButton
            type="button"
            // onClick={() => saveAlertsMutation.mutate()}
            // disabled={saveAlertsMutation.isPending || isFormDisabled}
            style={{ marginTop: "16px" }}
          >
            Enregistrer
          </FullWidthButton>
        </Flex>
      </Stack>
    </Stack>
  );
};

const AlertObjetForm = ({
  form,
  name,
  objets,
}: {
  form: AlertSectionsForm;
  name: AlertSectionName;
  objets: Pick<PopObjet, "titre_editorial" | "reference">[];
}) => {
  const constatId = routeApi.useParams().constatId;

  const alertId = useWatch({ control: form.control, name: `${name}.id` });
  const isFormDisabled = useIsStateReportDisabled();

  return (
    <Stack>
      <ObjetSelect form={form} name={name} objets={objets} />
      <ProblemeRadioButtons form={form} name={name} />

      <SectionCommentaires form={form} name={name} />
      <SectionPhotos alertId={alertId} constatId={constatId} isDisabled={isFormDisabled} />

      <Box mt="16px">
        <ShowInReportToggle form={form} name={name} />
      </Box>
    </Stack>
  );
};

const ObjetSelect = ({
  form,
  name,
  objets,
}: {
  form: AlertSectionsForm;
  name: AlertSectionName;
  objets: Pick<PopObjet, "titre_editorial" | "reference">[];
}) => {
  const isFormDisabled = useIsStateReportDisabled();

  return (
    <Select
      label="Objet ou mobilier concerné"
      disabled={isFormDisabled}
      nativeSelectProps={{
        ...form.register(`${name}.objet_ou_mobilier`),
        onChange: (e) => {
          form.setValue(`${name}.objet_ou_mobilier`, e.target.value);
          const selectedObj = objets.find((obj) => obj.reference === e.target.value);
          form.setValue(
            `${name}.objet_ou_mobilier_name`,
            selectedObj ? uppercaseFirstLetterIf(selectedObj.titre_editorial!, true) : "",
          );
        },
      }}
    >
      <option value="" disabled>
        Sélectionner une option
      </option>
      {objets.map((obj) => (
        <option key={obj.reference} value={obj.reference!}>
          {uppercaseFirstLetterIf(obj.titre_editorial!, true)} ({obj.reference})
        </option>
      ))}
    </Select>
  );
};

const ProblemeRadioButtons = ({ form, name }: { form: AlertSectionsForm; name: AlertSectionName }) => {
  const isFormDisabled = useIsStateReportDisabled();

  const value = useWatch({ control: form.control, name: `${name}.probleme` });

  const handleChange = (newValue: string) => {
    form.setValue(`${name}.probleme`, newValue);
  };

  const options = ["Objet absent", "Dégradation importante"].map((label) => ({
    label,
    nativeInputProps: {
      checked: value === label,
      onChange: () => handleChange(label),
    },
  }));

  return (
    <RadioButtons
      disabled={isFormDisabled}
      style={{ marginBottom: 0 }}
      legend="Problème à signaler"
      options={options}
    />
  );
};
