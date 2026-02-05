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
import { AlertErrors, checkAlertErrors } from "./StateReportAlert.utils";
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
}: {
  title: string;
  onClose: () => void;
  onBack: (data?: StateReportAlert[]) => void;
}) => {
  const constatId = routeApi.useParams().constatId;
  const isFormDisabled = useIsStateReportDisabled();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [errors, setErrors] = useState<AlertErrors | null>(null);

  return (
    <Stack>
      <MenuTitle onClose={onClose} hideDivider>
        <ModalBackButton onClick={onBack} />
      </MenuTitle>

      <Typography fontSize="16px" fontWeight="bold">
        Alerte : {title}
      </Typography>

      {/* <StateReportAlertsEmailInput
        form={form}
        name={name}
        mandatory_emails={mandatory_emails}
        additional_emails={additional_emails}
        isEditingEmail={isEditingEmail}
        setIsEditingEmail={setIsEditingEmail}
        errors={errors}
      /> */}

      {/* <SectionCommentaires form={form} name={name} />
      <SectionPhotos alertId={alert?.id} constatId={constatId} isDisabled={isFormDisabled} /> */}

      <Divider my="16px" />

      {/* <ShowInReportToggle form={form} name={name} /> */}

      {/* <FullWidthButton
        type="button"
        onClick={() => saveAlertMutation.mutate()}
        disabled={saveAlertMutation.isPending || isFormDisabled}
        style={{ marginTop: "16px" }}
      >
        Enregistrer
      </FullWidthButton> */}
    </Stack>
  );
};
