import { Spinner } from "#components/Spinner.tsx";
import { alertSectionStaticData } from "@patrinotes/pdf/constat";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  AlertWithAttachments,
  getIsAlertVisited,
  OBJETS_MOBILIERS_SECTION,
  serializeMandatoryEmails,
} from "@patrinotes/pdf/utils";
import { useDebounce } from "react-use";
import { getDiff } from "#components/SyncForm.tsx";
import { useAlertErrors, useSelectedAlertSection } from "../side-menu/StateReportSideMenu.store";
import { chunk, omit, pick } from "pastable";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { Flex } from "#components/ui/Flex.tsx";
import { Center } from "#components/MUIDsfr.tsx";
import { constatPdfQueries } from "../pdf/ConstatPdf.queries";

const routeApi = getRouteApi("/constat/$constatId");

export const StateReportAlertsMenu = ({ onClose }: StateReportAlertModalContentProps) => {
  const [selectedSection, setSelectedSection] = useSelectedAlertSection();

  const { constatId } = routeApi.useParams();
  const existingSectionsQuery = useQuery(constatPdfQueries.alerts({ constatId }));
  console.log("existingSectionsQuery", existingSectionsQuery.data);
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

export type AlertSectionsForm = UseFormReturn<{ alertSections: AlertWithAttachments[] }>;
export type AlertSectionName = `alertSections.${number}`;
export type AlertSectionFieldArray = UseFieldArrayReturn<
  {
    alertSections: AlertWithAttachments[];
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
  alertSections: AlertWithAttachments[];
  onClose: () => void;
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
}) => {
  const constatId = routeApi.useParams().constatId;
  const updateAlertMutation = useMutation({
    mutationFn: async () => {
      const toUpdate = getChangesToPush(alertSections, sectionsForm.getValues("alertSections"));

      return await db.transaction().execute(async (tx) => {
        for (const { id, changes } of toUpdate) {
          await tx
            .updateTable("state_report_alert")
            .where("id", "=", id)
            .set(omit(changes, ["attachments"]) as any)
            .execute();
        }
      });
    },
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.invalidateQueries({
        queryKey: constatPdfQueries.alerts({ constatId }).queryKey,
      });
    },
  });

  const sectionsForm = useForm<{ alertSections: AlertWithAttachments[]; syncMutation?: typeof updateAlertMutation }>({
    defaultValues: { alertSections, syncMutation: updateAlertMutation },
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
  alertSections: AlertWithAttachments[];
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

      console.log("Created new alert", newAlert);

      fieldArray.append({ ...newAlert[0], attachments: [] });
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
      onSave: () => {
        sectionsForm
          .getValues("syncMutation" as any)
          ?.mutateAsync()
          .then(() => {
            setSelectedSection(null);
          });
      },
      form: sectionsForm,
      title: selectedSection,
    };

    if (selectedSection === OBJETS_MOBILIERS_SECTION) {
      const alerts = [] as { alert: AlertWithAttachments; name: AlertSectionName }[];
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
    if (!alert)
      return (
        <Center>
          <Spinner />
        </Center>
      );
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
  console.log({ alertSectionStaticData, alertSections });
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

const getChangesToPush = (baseAlerts: AlertWithAttachments[], currentAlerts: AlertWithAttachments[]) => {
  const toUpdate: { id: string; changes: Partial<AlertWithAttachments> }[] = [];

  for (const alert of baseAlerts) {
    const id = alert.id;

    const base = baseAlerts.find((a) => a.id === id);
    const current = currentAlerts.find((a) => a.id === id);

    if (!base || !current) continue;

    const diff: Partial<AlertWithAttachments> = getDiff(current, base);
    if (Object.keys(diff).length === 0) continue;

    toUpdate.push({ id, changes: diff });
  }

  return toUpdate;
};

// this component is used to sync the form state with the local db
// it listens to changes in the form and updates the db after a debounce delay
// this enables the auto-saving feature without forcing the user to click a "save" button
const AlertSectionSync = ({ form }: { form: AlertSectionsForm; baseAlerts: AlertWithAttachments[] }) => {
  const currentValues = useWatch({ control: form.control, name: "alertSections" });

  const updateAlertMutation = useWatch({ control: form.control, name: "syncMutation" as any });

  const [, cancel] = useDebounce(
    () => {
      updateAlertMutation.mutateAsync();
    },
    500,
    [currentValues],
  );

  return null;
};
