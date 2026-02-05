import { Spinner } from "#components/Spinner.tsx";
import { alertSectionStaticData } from "@cr-vif/pdf/constat";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { v7 } from "uuid";
import { useLiveService, useService } from "../../../contexts/AuthContext";
import { StateReportAlert } from "../../../db/AppSchema";
import { db, useDbQuery } from "../../../db/db";
import { MenuTitle } from "../../menu/MenuTitle";
import { StateReportAlertModalContentProps } from "../StateReportSideMenu";
import { SectionItem } from "../steps/ConstatDetaille";
import { getEmailsForSection } from "./StateReportAlert.utils";
import { StateReportAlertObjetSectionForm } from "./StateReportAlertObjetSectionForm";
import { useStateReportAlerts } from "./StateReportAlerts.hook";
import { StateReportAlertSectionForm } from "./StateReportAlertSectionForm";
import { getIsAlertVisited, OBJETS_MOBILIERS_SECTION, serializeMandatoryEmails } from "@cr-vif/pdf/utils";
import { useStateReportFormContext } from "../utils";

const routeApi = getRouteApi("/constat/$constatId");

export const StateReportAlertsMenu = ({ onClose }: StateReportAlertModalContentProps) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const { constatId } = routeApi.useParams();
  const existingSectionsQuery = useDbQuery(
    db
      .selectFrom("state_report_alert")
      .where("state_report_id", "=", constatId)
      .where((eb) =>
        eb.or([
          eb("commentaires", "is not", null),
          eb("objet_ou_mobilier", "is not", null),
          eb("probleme", "is not", null),
        ]),
      )
      .select(["alert"]),
  );

  const existingSections = existingSectionsQuery.data?.map((alert) => alert.alert!) ?? [];

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
            existingSections={existingSections}
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
  existingSections,
  onClose,
  selectedSection,
  setSelectedSection,
}: {
  existingSections: string[];
  onClose: () => void;
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
}) => {
  const constatId = routeApi.useParams().constatId;

  const userService = useService();

  const addAlertMutation = useMutation({
    mutationFn: async (title: string) => {
      const emails = getEmailsForSection(title, userService as any);
      const newAlert = await db
        .insertInto("state_report_alert")
        .values({
          id: v7(),
          alert: title,
          state_report_id: constatId,
          commentaires: null,
          mandatory_emails: serializeMandatoryEmails(emails),
          show_in_report: 1,
          service_id: userService.id,
        })
        .returningAll()
        .execute();

      return newAlert[0];
    },
  });

  const onSectionClick = async (title: string) => {
    const sections = await db
      .selectFrom("state_report_alert")
      .where("state_report_id", "=", constatId)
      .where("alert", "=", title)
      .selectAll()
      .execute();

    if (!sections.length) {
      await addAlertMutation.mutateAsync(title);
    }

    setSelectedSection(title);
  };

  if (selectedSection) {
    const commonProps = {
      onClose: () => onClose(),
      onBack: () => {
        setSelectedSection(null);
      },
      title: selectedSection,
    };

    if (selectedSection === OBJETS_MOBILIERS_SECTION) {
      const alerts = [] as { alert: StateReportAlert; name: AlertSectionName }[];

      return <StateReportAlertObjetSectionForm {...commonProps} />;
    }

    return <StateReportAlertSectionForm {...commonProps} />;
  }

  return (
    <>
      {alertSectionStaticData.map(({ title, services }) => {
        // can have multiple elements if "Objets et mobiliers"
        const isVisited = existingSections.some((section) => section === title);

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
