import { useWatch } from "react-hook-form";
import { useSendConstatFormContext } from "./ConstatPdfContext";
import { Stack } from "@mui/material";
import { Accordion } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { addSIfPlural } from "@patrinotes/pdf/utils";

export const AlertsReminder = () => {
  const form = useSendConstatFormContext();
  const alerts = useWatch({ control: form.control, name: "alerts" });

  if (alerts.length === 0) return null;

  const sIfPlural = addSIfPlural(alerts.length);

  return (
    <Stack>
      <Accordion
        label={
          <Flex pr="8px" alignItems="center">
            <i className="fr-icon ri-alarm-warning-fill" style={{ marginRight: "8px" }} />
            {alerts.length} alerte{sIfPlural} signalée{sIfPlural}
          </Flex>
        }
      >
        <Stack gap="8px">
          {alerts.map((alert, index) => (
            
          ))}
        </Stack>
      </Accordion>
    </Stack>
  );
};
