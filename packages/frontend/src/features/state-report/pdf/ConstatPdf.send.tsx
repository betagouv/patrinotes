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
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { deserializeMandatoryEmails } from "../alerts/StateReportAlert.utils";
import { useHtmlString } from "./ConstatPdf.hook";

export const SendConstatPdf = () => {
  const htmlString = useHtmlString();
  const user = useUser()!;

  return (
    <Stack>
      <Center>
        <Center width="800px" flexDirection="column">
          {/* <AlertsAccordion /> */}
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
  const { alerts, alertsFormId } = useConstatPdfContext()!;
  const alertSuffix = addSIfPlural(alerts!.length);

  const form = useForm({ defaultValues: { alerts: alerts! } });
  const fieldArray = useFieldArray({ control: form.control, name: "alerts" });

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
            gap: "8px",
            "::before": {
              width: "16px",
              mb: "4px",
            },
          }}
        >
          {alerts!.length} alerte{alertSuffix} signalée{alertSuffix}
        </Box>
      }
    >
      <Stack px="16px" component="form" id={alertsFormId}>
        <Typography>
          Les alertes seront envoyées aux services concernés, mais vous pouvez désélectionner celles à ne pas envoyer.
        </Typography>
        <AlertCheckboxes alerts={fieldArray.fields} form={form} />
        {/* {fieldArray.fields.map((field, index) => (
          <AlertRow key={field.id} alert={field} form={form} name={`alerts.${index}`} />
        ))} */}
      </Stack>
    </Accordion>
  );
};

type AlertRowProps = {
  form: UseFormReturn<{ alerts: StateReportAlert[] }>;
  name: `alerts.${number}`;
  alerts: StateReportAlert;
};

const AlertCheckboxes = ({
  alerts,
  form,
}: {
  alerts: StateReportAlert[];
  form: UseFormReturn<{ alerts: StateReportAlert[] }>;
}) => {
  return (
    <Checkbox
      sx={{ mt: "24px" }}
      options={alerts.map((alert) => {
        const mandatoryEmails = deserializeMandatoryEmails(alert.mandatory_emails || "");
        const additionalEmails = alert.additional_emails?.split(",").map((email) => email.trim()) || [];

        const flatEmails = [...mandatoryEmails.map((e) => e.email), ...additionalEmails].filter(Boolean);

        return {
          label: alert.alert,
          hintText: flatEmails.length ? flatEmails.join(", ") : null,
          nativeInputProps: {},
        };
      })}
    />
  );
};

const AlertRow = ({ alert, form, name }: AlertRowProps) => {
  return (
    <Stack>
      <Checkbox options={[]}></Checkbox>
    </Stack>
  );
};

const View = (props: StateReportPDFDocumentProps) => {
  const query = useQuery({
    queryKey: ["report-pdf", props.htmlString],
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
