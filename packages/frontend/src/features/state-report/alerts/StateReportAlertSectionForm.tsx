import { EmailInput } from "#components/EmailInput.tsx";
import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { Button } from "#components/MUIDsfr.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { v7 } from "uuid";
import { StateReportAlert } from "../../../db/AppSchema";
import { db } from "../../../db/db";
import { addSIfPlural } from "../../../utils";
import { MenuTitle, ModalBackButton } from "../../menu/MenuTitle";
import { useIsStateReportDisabled } from "../utils";
import { SectionCommentaires, SectionPhotos, ShowInReportToggle } from "./SectionCommentaires";
import { deserializeMandatoryEmails } from "./StateReportAlert.utils";
import { AlertSectionName, AlertSectionsForm } from "./StateReportAlertsMenu";
import { LinkButton } from "#components/ui/LinkButton.tsx";
import { StateReportAlertsEmailInput } from "./StateReportAlertsEmailInput";

const routeApi = getRouteApi("/constat/$constatId");

export type StateReportAlertSection = {
  commentaires: string;
  show_in_report: boolean;
  mandatory_emails?: string;
  additional_emails?: string;
};

export type StateReportAlertSectionForm = UseFormReturn<StateReportAlertSection>;

export const StateReportAlertSectionForm = ({
  title,
  onClose,
  onBack,
  alert,
  name,
  form,
}: {
  title: string;
  onClose: () => void;
  onBack: () => void;
  alert: StateReportAlert;
  name: AlertSectionName;
  form: AlertSectionsForm;
}) => {
  const constatId = routeApi.useParams().constatId;
  const isFormDisabled = useIsStateReportDisabled();

  const { mandatory_emails, additional_emails } = alert;

  const saveAlertMutation = useMutation({
    mutationFn: async () => {
      const { id, ...data } = form.getValues(name);
      await db.updateTable("state_report_alert").where("id", "=", alert.id).set(data).execute();
    },
  });

  return (
    <Stack>
      <MenuTitle onClose={onClose} hideDivider>
        <ModalBackButton onClick={onBack} />
      </MenuTitle>

      <Typography fontSize="16px" fontWeight="bold">
        Alerte : {title}
      </Typography>

      <StateReportAlertsEmailInput
        mandatory_emails={mandatory_emails}
        additional_emails={additional_emails}
        form={form}
        name={name}
      />

      <SectionCommentaires form={form} name={name} />
      <SectionPhotos alertId={alert?.id} constatId={constatId} isDisabled={isFormDisabled} />

      <Divider my="16px" />

      <ShowInReportToggle form={form} name={name} />

      <FullWidthButton
        type="button"
        onClick={() => saveAlertMutation.mutate()}
        disabled={isFormDisabled}
        style={{ marginTop: "16px" }}
      >
        Enregistrer
      </FullWidthButton>
    </Stack>
  );
};
