import { Spinner } from "#components/Spinner.tsx";
import { alertSectionStaticData } from "@cr-vif/pdf/constat";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { v7 } from "uuid";
import { useLiveService } from "../../../contexts/AuthContext";
import { StateReportAlert } from "../../../db/AppSchema";
import { db } from "../../../db/db";
import { MenuTitle } from "../../menu/MenuTitle";
import { StateReportAlertModalContentProps } from "../side-menu/StateReportSideMenu";
import { SectionItem } from "../steps/ConstatDetaille";
import { getEmailsForSection } from "./StateReportAlert.utils";
import { StateReportAlertObjetSectionForm } from "./StateReportAlertObjetSectionForm";
import { useStateReportAlerts } from "./StateReportAlerts.hook";
import { StateReportAlertSectionForm } from "./StateReportAlertSectionForm";
import { getIsAlertVisited, OBJETS_MOBILIERS_SECTION, serializeMandatoryEmails } from "@cr-vif/pdf/utils";
import { useDebounce } from "react-use";
import { getDiff } from "#components/SyncForm.tsx";
import { useAlertErrors, useSelectedAlertSection } from "../side-menu/StateReportSideMenu.store";
import { chunk, pick } from "pastable";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { Flex } from "#components/ui/Flex.tsx";

const routeApi = getRouteApi("/constat/$constatId");

export const StateReportAlertsMenu = ({ onClose }: StateReportAlertModalContentProps) => {
  const [selectedSection, setSelectedSection] = useSelectedAlertSection();

  const { constatId } = routeApi.useParams();
  const existingSectionsQuery = useStateReportAlerts(constatId);
  const existingSections = existingSectionsQuery.data ?? [];

  return (
    <Stack px={{ xs: "16px", lg: 0 }}>
      {!selectedSection ? (
        <>
          <MenuTitle hideDivider onClose={onClose}>
            Alertes
          </MenuTitle>
          <Typography mb="24px">
            Vous avez remarqué un problème lié au monument historique ?<br />
            Signalez une alerte auprès du service concerné :
          </Typography>
        </>
      ) : null}
      <Stack
        gap="8px"
        flexWrap="wrap"
        mb={{ xs: "48px", lg: "80px" }}
        flexDirection={!selectedSection ? "row" : "column"}
        width="100%"
        sx={{
          ".fr-tile__content": { paddingBottom: "0 !important" },
        }}
      >
        {existingSectionsQuery.isLoading ? (
          <Box mt="24px">
            <Spinner />
          </Box>
        ) : (
          <AlertSectionsForm
            alertSections={existingSections}
            onClose={onClose}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        )}
      </Stack>
    </Stack>
  );
};

export type AlertSectionsForm = UseFormReturn<{ alertSections: StateReportAlert[] }>;
export type AlertSectionName = `alertSections.${number}`;
export type AlertSectionFieldArray = UseFieldArrayReturn<
  {
    alertSections: StateReportAlert[];
  },
  "alertSections",
  "id"
>;

const AlertSectionsForm = ({
  alertSections,
  onClose,
  selectedSection,
  setSelectedSection,
}: {
  alertSections: StateReportAlert[];
  onClose: () => void;
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
}) => {
  const sectionsForm = useForm<{ alertSections: StateReportAlert[] }>({
    defaultValues: { alertSections },
  });
  const fieldArray = useFieldArray({ name: "alertSections", control: sectionsForm.control });

  return (
    <>
      <AlertSectionSync form={sectionsForm} baseAlerts={alertSections} />
      <AlertSectionsList
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        sectionsForm={sectionsForm}
        alertSections={alertSections}
        onClose={onClose}
        fieldArray={fieldArray}
      />
    </>
  );
};

const AlertSectionsList = ({
  selectedSection,
  setSelectedSection,
  sectionsForm,
  alertSections,
  onClose,
  fieldArray,
}: {
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
  sectionsForm: AlertSectionsForm;
  alertSections: StateReportAlert[];
  onClose: () => void;
  fieldArray: AlertSectionFieldArray;
}) => {
  const constatId = routeApi.useParams().constatId;
  const userService = useLiveService()!;
  const isDesktop = useIsDesktop();

  const addAlertMutation = useMutation({
    mutationFn: async (title: string) => {
      const emails = getEmailsForSection(title, userService);
      const newAlert = await db
        .insertInto("state_report_alert")
        .values({
          id: v7(),
          alert: title,
          state_report_id: constatId,
          commentaires: "",
          mandatory_emails: serializeMandatoryEmails(emails),
          show_in_report: 1,
          should_send: 1,
          service_id: userService?.id ?? null,
        })
        .returningAll()
        .execute();

      fieldArray.append(newAlert[0]);
    },
  });

  const onSectionClick = async (title: string) => {
    const sectionExists = fieldArray.fields.find((f) => f.alert === title);

    if (!sectionExists) {
      await addAlertMutation.mutateAsync(title);
    }

    setSelectedSection(title);
  };

  const [alertErrors] = useAlertErrors();
  const sectionAlertErrors = alertErrors?.find((e) => e.alert === selectedSection)?.errors ?? null;

  if (selectedSection) {
    const commonProps = {
      onClose: () => onClose(),
      onBack: () => {
        setSelectedSection(null);
      },
      form: sectionsForm,
      title: selectedSection,
    };

    if (selectedSection === OBJETS_MOBILIERS_SECTION) {
      const alerts = [] as { alert: StateReportAlert; name: AlertSectionName }[];
      fieldArray.fields.forEach((field, index) => {
        if (field.alert === OBJETS_MOBILIERS_SECTION) {
          alerts.push({ alert: sectionsForm.getValues(`alertSections.${index}`), name: `alertSections.${index}` });
        }
      });

      return (
        <StateReportAlertObjetSectionForm
          alerts={alerts}
          {...commonProps}
          appendAlert={() => addAlertMutation.mutateAsync(OBJETS_MOBILIERS_SECTION)}
          errors={sectionAlertErrors}
        />
      );
    }

    const alertIndex = fieldArray.fields.findIndex((f) => f.alert === selectedSection);
    const alert = sectionsForm.getValues(`alertSections.${alertIndex}`);

    return (
      <StateReportAlertSectionForm
        alert={alert}
        name={`alertSections.${alertIndex}`}
        errors={sectionAlertErrors}
        {...commonProps}
      />
    );
  }

  const chunked = chunk(alertSectionStaticData, isDesktop ? 2 : 1);

  return (
    <>
      {chunked.map((chunk, index) => (
        <Flex flexDirection="row" justifyContent="space-between" width="100%" key={index} gap="8px">
          {chunk.map(({ title, services }) => {
            const matchingFields = alertSections.filter((f) => f.alert === title);
            const isVisited = matchingFields.some(getIsAlertVisited);
            return (
              <SectionItem
                key={title}
                withIcon
                section={title}
                details={services.join(", ")}
                isVisited={isVisited}
                onClick={() => onSectionClick(title)}
              />
            );
          })}
          {isDesktop && chunk.length === 1 ? <Box width="100%" p="2rem 2rem 2.25rem"></Box> : null}
        </Flex>
      ))}
    </>
  );
};

// this component is used to sync the form state with the local db
// it listens to changes in the form and updates the db after a debounce delay
// this enables the auto-saving feature without forcing the user to click a "save" button
const AlertSectionSync = ({ form, baseAlerts }: { form: AlertSectionsForm; baseAlerts: StateReportAlert[] }) => {
  const currentValues = useWatch({ control: form.control, name: "alertSections" });

  const updateAlertMutation = useMutation({
    mutationFn: async (newAlerts: { id: string; changes: Partial<StateReportAlert> }[]) => {
      await db.transaction().execute(async (tx) => {
        for (const { id, changes } of newAlerts) {
          await tx.updateTable("state_report_alert").where("id", "=", id).set(changes).execute();
        }
      });
    },
  });

  useDebounce(
    () => {
      const toUpdate: { id: string; changes: Partial<StateReportAlert> }[] = [];

      for (const alert of baseAlerts) {
        const id = alert.id;

        const base = baseAlerts.find((a) => a.id === id);
        const current = currentValues.find((a) => a.id === id);

        if (!base || !current) continue;

        const diff: Partial<StateReportAlert> = getDiff(current, base);
        if (Object.keys(diff).length === 0) continue;

        toUpdate.push({ id, changes: diff });
      }

      updateAlertMutation.mutateAsync(toUpdate);
    },
    500,
    [currentValues],
  );

  return null;
};
