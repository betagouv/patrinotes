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
import { useWatch } from "react-hook-form";
import { PopObjet, StateReportAlert } from "../../../db/AppSchema";
import { db } from "../../../db/db";
import { uppercaseFirstLetterIf } from "../../../utils";
import { MenuTitle, ModalBackButton } from "../../menu/MenuTitle";
import { useIsStateReportDisabled, useStateReportFormContext } from "../utils";
import { SectionCommentaires, SectionPhotos, ShowInReportToggle } from "./SectionCommentaires";
import { AlertErrors, checkAlertErrors } from "./StateReportAlert.utils";
import { StateReportAlertsEmailInput } from "./StateReportAlertsEmailInput";
import { AlertSectionName, AlertSectionsForm } from "./StateReportAlertsMenu";

const routeApi = getRouteApi("/constat/$constatId");

export const StateReportAlertObjetSectionForm = ({
  title,
  onClose,
  onBack,
  alerts,
  form,
  appendAlert,
}: {
  title: string;
  onClose: () => void;
  onBack: (data?: StateReportAlert[]) => void;
  alerts: { alert: StateReportAlert; name: AlertSectionName }[];
  form: AlertSectionsForm;
  appendAlert: () => Promise<void>;
}) => {
  const isFormDisabled = useIsStateReportDisabled();
  const stateReportForm = useStateReportFormContext();

  const referencePop = useWatch({ control: stateReportForm.control, name: "reference_pop" });

  const objetsQuery = useQuery({
    queryKey: ["stateReportAlerts", "objets", referencePop],
    enabled: !!referencePop,
    queryFn: async () => {
      const objets = await db
        .selectFrom("pop_objets")
        .select(["titre_editorial", "reference"])
        .where("reference_a_une_notice_merimee_mh", "like", "%" + referencePop?.trim() + "%")
        .execute();
      return objets;
    },
    refetchOnWindowFocus: false,
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [errors, setErrors] = useState<AlertErrors | null>(null);

  const saveAlertsMutation = useMutation({
    mutationFn: async () => {
      const firstAlert = form.getValues(alerts[0].name);
      const errors = checkAlertErrors(firstAlert);

      if (errors.email.length && isEditingEmail) {
        setErrors(errors);
        return;
      }

      // every objet alerts share the same emails
      const { mandatory_emails, additional_emails } = firstAlert;

      for (const { name } of alerts) {
        const { id, ...data } = form.getValues(name);
        await db
          .updateTable("state_report_alert")
          .where("id", "=", id)
          .set({ ...data, mandatory_emails, additional_emails })
          .execute();
      }

      onBack(alerts.map((alert) => alert.alert));
    },
  });

  const { mandatory_emails, additional_emails } = alerts[0].alert;

  return (
    <Stack>
      <MenuTitle onClose={onClose} hideDivider>
        <ModalBackButton onClick={onBack} />
      </MenuTitle>

      <Typography fontSize="16px" fontWeight="bold">
        Alerte : {title}
      </Typography>

      <StateReportAlertsEmailInput
        form={form}
        name={alerts[0].name}
        mandatory_emails={mandatory_emails}
        additional_emails={additional_emails}
        isEditingEmail={isEditingEmail}
        setIsEditingEmail={setIsEditingEmail}
        errors={errors}
      />

      <Stack mt="24px">
        {objetsQuery.isLoading ? (
          <Center mt="80px">
            <Spinner />
          </Center>
        ) : (
          alerts.map(({ alert, name }, index) => (
            <Fragment key={alert.id}>
              <AlertObjetForm form={form} name={name} objets={objetsQuery.data ?? []} />
              {index < alerts.length - 1 && <Divider my="24px" />}
            </Fragment>
          ))
        )}

        <Flex gap="8px" mb="16px">
          <FullWidthButton
            type="button"
            iconId="ri-add-line"
            onClick={() => appendAlert()}
            disabled={isFormDisabled}
            style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
            priority="secondary"
          >
            Ajouter objet ou mobilier
          </FullWidthButton>

          <FullWidthButton
            type="button"
            onClick={() => saveAlertsMutation.mutate()}
            disabled={saveAlertsMutation.isPending || isFormDisabled}
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
