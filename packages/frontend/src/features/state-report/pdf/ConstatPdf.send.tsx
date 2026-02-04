import { useMutation, useQuery } from "@tanstack/react-query";
import { getStateReportHtmlString, StateReportPDFDocument, StateReportPDFDocumentProps } from "@cr-vif/pdf/constat";
import { pdf } from "@react-pdf/renderer";
import { Accordion, Center, Checkbox, Input } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { PdfCanvas } from "../../../routes/pdf.$reportId";
import { useService, useUser } from "../../../contexts/AuthContext";
import { addSIfPlural } from "../../../utils";
import { Box, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../db/db";
import { StateReportAlert } from "../../../db/AppSchema";
import { useFieldArray, useForm, UseFormReturn, useWatch } from "react-hook-form";
import { AlertErrors } from "../alerts/StateReportAlert.utils";
import { useAlerts, useHtmlString } from "./ConstatPdf.hook";
import { AlertWithAttachments, useIsSendConstatFormDisabled, useSendConstatFormContext } from "./ConstatPdfContext";
import { deserializeMandatoryEmails, serializeMandatoryEmails } from "@cr-vif/pdf/utils";
import { groupBy } from "pastable";

export const SendConstatPdf = () => {
  const htmlString = useHtmlString();
  const user = useUser()!;

  const isDisabled = useIsSendConstatFormDisabled();

  return (
    <Stack>
      <Center>
        <Center width="800px" flexDirection="column">
          {!isDisabled ? <AlertsAccordion /> : null}
          <View
            htmlString={htmlString}
            images={{ marianne: "/marianne.png", marianneFooter: "/marianne_footer.png" }}
            service={user.service as any}
          />
        </Center>
      </Center>
    </Stack>
  );
};

const AlertsAccordion = () => {
  const alerts = useAlerts();
  const form = useSendConstatFormContext();
  const alertSuffix = addSIfPlural(alerts.length);

  const alertErrors = useWatch({ control: form.control, name: "alertErrors" });
  const hasErrors = alertErrors.some((error) => error.email.length > 0);

  if (!alerts?.length) return null;

  return (
    <Accordion
      sx={{ width: "100%" }}
      label={
        <Box
          className="fr-icon ri-alarm-warning-fill"
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            width: "100%",
            gap: "8px",
            "::before, ::after": {
              width: "16px",
              mb: "2px",
            },
          }}
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {alerts!.length} alerte{alertSuffix} signalée{alertSuffix}
            {hasErrors ? (
              <i
                className="fr-icon fr-icon--right fr-icon-error-warning-fill"
                style={{ color: fr.colors.decisions.text.actionHigh.redMarianne.default, marginRight: "16px" }}
              />
            ) : null}
          </Flex>
        </Box>
      }
    >
      <Stack px="16px">
        <Typography>
          Les alertes seront envoyées aux services concernés, mais vous pouvez désélectionner celles à ne pas envoyer.
        </Typography>
        <AlertCheckboxes alerts={alerts} />
        {/* {fieldArray.fields.map((field, index) => (
          <AlertRow key={field.id} alert={field} form={form} name={`alerts.${index}`} />
        ))} */}
      </Stack>
    </Accordion>
  );
};

const AlertCheckboxes = ({ alerts: baseAlerts }: { alerts: AlertWithAttachments[] }) => {
  const form = useSendConstatFormContext();

  const alertErrors = useWatch({ control: form.control, name: "alertErrors" });
  const flatErrors = alertErrors.flatMap((error) => error.email);

  const alertsWithIndex = baseAlerts.map((alert, index) => ({ ...alert, index }));
  const groupedAlerts = groupBy(alertsWithIndex, (alert) => alert.alert);
  const alertsNames = Object.keys(groupedAlerts);

  const alerts = alertsNames.map((name) => {
    const grouped = groupedAlerts[name];

    return { ...grouped[0], indices: grouped.map((a) => a.index) };
  });

  const toggleShouldSend = (indices: number[], shouldSend: boolean) => {
    for (const alertIndex of indices) {
      form.setValue(`alerts.${alertIndex}.shouldSend`, shouldSend);
    }

    form.getValues("checkErrors")();
  };

  return (
    <Checkbox
      sx={{ mt: "24px" }}
      options={alerts.map((alert) => {
        const mandatoryEmails = deserializeMandatoryEmails(alert.mandatory_emails || "");
        const additionalEmails = alert.additional_emails?.split(",").map((email) => email.trim()) || [];

        const emailErrors = flatErrors.filter((error) => mandatoryEmails.some((me) => me.service === error.service));
        const flatEmails = [...mandatoryEmails.map((e) => e.email), ...additionalEmails].filter(Boolean);

        return {
          label: alert.alert,
          hintText: !emailErrors.length ? (
            flatEmails.join(", ")
          ) : (
            <AlertEmailInput alert={alert} errors={emailErrors} />
          ),
          nativeInputProps: {
            onChange: (e) => toggleShouldSend(alert.indices, e.target.checked),
            checked: alert.shouldSend,
          },
        };
      })}
    />
  );
};

const AlertEmailInput = ({
  alert,
  errors,
}: {
  alert: AlertWithAttachments & { indices: number[] };
  errors: AlertErrors["email"];
}) => {
  const form = useSendConstatFormContext();
  const mandatoryEmails = deserializeMandatoryEmails(alert.mandatory_emails || "");

  const onChange = (service: string, email: string) => {
    const newMandatoryEmails = mandatoryEmails.map((me) => (me.service === service ? { service, email } : me));

    const serialized = serializeMandatoryEmails(newMandatoryEmails);

    for (const index of alert.indices) {
      form.setValue(`alerts.${index}.mandatory_emails`, serialized);
    }
  };

  return (
    <Stack mt="8px">
      {errors.map((error, index) => (
        <Input
          key={index}
          state="error"
          stateRelatedMessage={error.error}
          label={error.service ? `Courriel ${error.service}*` : "Courriel"}
          nativeInputProps={{
            onChange: (e) => {
              onChange(error.service, e.target.value);
            },
            value: mandatoryEmails.find((me) => me.service === error.service)?.email || "",
          }}
        />
      ))}
    </Stack>
  );
};

const View = (props: StateReportPDFDocumentProps) => {
  const query = useQuery({
    queryKey: ["state-report-pdf", props.htmlString],
    queryFn: async () => {
      const blob = await pdf(<StateReportPDFDocument {...props} />).toBlob();
      return blob;
    },
    refetchOnWindowFocus: false,
    enabled: !!props.htmlString,
  });

  if (query.isLoading || !query.data)
    return (
      <Center height="100%">
        <Spinner />
      </Center>
    );

  return <PdfCanvas blob={query.data as Blob} />;
};
