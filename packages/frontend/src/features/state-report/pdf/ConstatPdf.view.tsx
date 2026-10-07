import { StateReportPDFDocument } from "@patrinotes/pdf/constat";
import { BlobProvider } from "@react-pdf/renderer";
import { JSX, useEffect, useMemo } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";
import { Alert, Center } from "#components/MUIDsfr.tsx";
import { useWatch } from "react-hook-form";
import { PDFViewerPaginated } from "#components/PDFViewerPaginated";
import { Spinner } from "#components/Spinner.tsx";
import { useSendConstatFormContext } from "./ConstatPdfContext";
import { AlertsReminder } from "./AlertsReminder";
import { Box } from "@mui/material";

export const ViewConstatPdf = ({ step }: { step: "view" | "send" | "sent" }) => {
  const htmlString = useHtmlString();
  const user = useUser()!;
  const document = useMemo(
    () => (
      <StateReportPDFDocument
        htmlString={htmlString}
        images={{ marianne: "/marianne.png", marianneFooter: "/marianne_footer.png" }}
        service={user.service as any}
      />
    ),
    [htmlString, user.service?.id],
  );

  return (
    <Center flexDirection="column">
      <Center width={{ xs: "100%", lg: "944px" }} flexDirection="column" marginBottom="96px">
        {step === "send" ? <AlertsReminder /> : null}
        <PlanSituationOfflineAlert />
        <Box mt={{ xs: "16px", lg: "24px" }} px="8px">
          <BlobProvider document={document}>
            {({ blob, loading, error }) => {
              if (loading) {
                return (
                  <Center mt="64px">
                    <Spinner />
                  </Center>
                );
              }
              if (error) {
                return <div>Error: {error.message}</div>;
              }
              return (
                <BlobSync blob={blob!}>
                  <PDFViewerPaginated blob={blob!} ariaLabel="Prévisualisation du constat" />
                </BlobSync>
              );
            }}
          </BlobProvider>
        </Box>
      </Center>
    </Center>
  );
};

const PlanSituationOfflineAlert = () => {
  const form = useSendConstatFormContext();
  const planSituationOffline = useWatch({ control: form.control, name: "stateReport.planSituationOffline" });

  if (!planSituationOffline) return null;

  return (
    <Box mt={{ xs: "16px", lg: "24px" }} px="8px" width="100%">
      <Alert
        severity="warning"
        small
        description="Le plan de situation n'a pas pu être généré car l'appareil est hors ligne. Reconnectez-vous à internet puis rouvrez ce constat pour l'inclure au PDF."
      />
    </Box>
  );
};

// TODO: do better
const BlobSync = ({ blob, children }: { blob: Blob; children: JSX.Element }) => {
  const form = useSendConstatFormContext();
  useEffect(() => {
    if (!blob) {
      form.setValue("pdfSize", 0);
      form.setValue("pdfBlob", null);
      return;
    }
    const size = blob.size;
    form.setValue("pdfSize", size);
    form.setValue("pdfBlob", blob);
  }, [blob]);
  return <>{children}</>;
};
