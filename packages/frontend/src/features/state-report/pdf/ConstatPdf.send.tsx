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

  return (
    <Stack>
      <Center>
        <Center width="800px" flexDirection="column">
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
