import { Spinner } from "#components/Spinner.tsx";
import { alertSectionStaticData } from "@cr-vif/pdf/constat";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { v7 } from "uuid";
import { useLiveService } from "../../../contexts/AuthContext";
import { StateReportAlert } from "../../../db/AppSchema";
import { db } from "../../../db/db";
import { MenuTitle } from "../../menu/MenuTitle";
import { StateReportAlertModalContentProps } from "../StateReportSideMenu";
import { SectionItem } from "../steps/ConstatDetaille";
import { getEmailsForSection, OBJETS_MOBILIERS_SECTION, serializeMandatoryEmails } from "./StateReportAlert.utils";
import { StateReportAlertObjetSectionForm } from "./StateReportAlertObjetSectionForm";
import { useStateReportAlerts } from "./StateReportAlerts.hook";
import { StateReportAlertSectionForm } from "./StateReportAlertSectionForm";

const routeApi = getRouteApi("/constat/$constatId");

export const StateReportAlertsMenu = ({ onClose }: StateReportAlertModalContentProps) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

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
          <AlertSectionsList
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

const AlertSectionsList = ({
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
  const constatId = routeApi.useParams().constatId;
  const userService = useLiveService()!;
  const sectionsForm = useForm<{ alertSections: StateReportAlert[] }>({
    defaultValues: { alertSections },
  });
  const fieldArray = useFieldArray({ name: "alertSections", control: sectionsForm.control });

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
          show_in_report: 0,
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

  if (selectedSection) {
    const commonProps = {
      onClose: () => onClose(),
      onBack: (data?: StateReportAlert[]) => {
        // prevents forcing unallowed edits when going back
        if (!data) sectionsForm.reset({ alertSections });
        setSelectedSection(null);
      },
      form: sectionsForm,
      title: selectedSection,
    };

    if (selectedSection === OBJETS_MOBILIERS_SECTION) {
      const alerts = [] as { alert: StateReportAlert; name: AlertSectionName }[];
      fieldArray.fields.forEach((field, index) => {
        if (field.alert === OBJETS_MOBILIERS_SECTION) {
          alerts.push({ alert: field, name: `alertSections.${index}` });
        }
      });

      return (
        <StateReportAlertObjetSectionForm
          alerts={alerts}
          {...commonProps}
          appendAlert={() => addAlertMutation.mutateAsync(OBJETS_MOBILIERS_SECTION)}
        />
      );
    }

    const alertIndex = fieldArray.fields.findIndex((f) => f.alert === selectedSection);
    const alert = sectionsForm.getValues(`alertSections.${alertIndex}`);

    return <StateReportAlertSectionForm alert={alert} name={`alertSections.${alertIndex}`} {...commonProps} />;
  }

  return (
    <>
      {alertSectionStaticData.map(({ title, services }) => {
        // can have multiple elements if "Objets et mobiliers"
        const matchingFields = fieldArray.fields.filter((f) => f.alert === title);
        const isVisited = matchingFields.some(getIsVisited);

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
    </>
  );
};

const getIsVisited = (alertSection: StateReportAlert) => {
  return !!alertSection.commentaires || !!alertSection.objet_ou_mobilier;
};
