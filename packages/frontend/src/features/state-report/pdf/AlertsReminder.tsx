import { useWatch } from "react-hook-form";
import { useSendConstatFormContext } from "./ConstatPdfContext";
import { Box, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { Accordion } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { addSIfPlural, deserializeMandatoryEmails, OBJETS_MOBILIERS_SECTION } from "@patrinotes/pdf/utils";
import { fr } from "@codegouvfr/react-dsfr";
import { AlertWithAttachments } from "@patrinotes/pdf/utils";

const getAlertEmails = (alerts: AlertWithAttachments[]): string => {
  const allEmails = alerts.flatMap((alert) => {
    const mandatory = deserializeMandatoryEmails(alert.mandatory_emails || "")
      .map((e) => e.email)
      .filter(Boolean);
    const additional = (alert.additional_emails || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    return [...mandatory, ...additional];
  });
  const unique = [...new Set(allEmails)];
  return unique.join(", ") || "Aucun courriel configuré";
};

export const AlertsReminder = () => {
  const form = useSendConstatFormContext();
  const alerts = useWatch({ control: form.control, name: "alerts" });

  const visibleAlerts = alerts.filter((a) => a.should_send);

  if (visibleAlerts.length === 0) return null;

  const sIfPlural = addSIfPlural(visibleAlerts.length);

  const mobilierAlerts = visibleAlerts.filter((a) => a.alert === OBJETS_MOBILIERS_SECTION);
  const otherAlerts = visibleAlerts.filter((a) => a.alert !== OBJETS_MOBILIERS_SECTION);

  return (
    <Stack width="100%">
      <Accordion
        label={
          <Flex pr="8px" alignItems="center">
            <i className="fr-icon ri-alarm-warning-fill" style={{ marginRight: "8px" }} />
            {visibleAlerts.length} alerte{sIfPlural} MH signalée{sIfPlural}
          </Flex>
        }
      >
        <Stack gap="4px">
          {otherAlerts.map((alert) => (
            <Stack key={alert.id}>
              <Typography pl="34px" fontSize="16px" fontWeight="500">
                {alert.alert}
              </Typography>
              <Typography fontSize="13px" color={fr.colors.decisions.text.mention.grey.default} pl="34px" mt="-4px">
                {getAlertEmails([alert])}
              </Typography>
            </Stack>
          ))}
          {mobilierAlerts.length > 0 && (
            <Stack>
              <Typography pl="34px" fontSize="14px" fontWeight="500">
                Alerte : Objets ou mobiliers
              </Typography>
              <Typography fontSize="13px" color={fr.colors.decisions.text.mention.grey.default} pl="34px" mt="-4px">
                {getAlertEmails(mobilierAlerts)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Accordion>
    </Stack>
  );
};
