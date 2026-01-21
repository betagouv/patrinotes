import { useQuery } from "@tanstack/react-query";
import { useConstatPdfContext } from "./ConstatPdfContext";
import { getStateReportHtmlString, StateReportPDFDocument, StateReportPDFDocumentProps } from "@cr-vif/pdf/constat";
import { pdf } from "@react-pdf/renderer";
import { Accordion, Center, Checkbox } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { PdfCanvas } from "../../../routes/pdf.$reportId";
import { useService, useUser } from "../../../contexts/AuthContext";
import { getRouteApi } from "@tanstack/react-router";
import { useStateReportAlerts, useStateReportAlertsWithEmail } from "../StateReportSideMenu";
import { addSIfPlural } from "../../../utils";
import { Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";

const routeApi = getRouteApi("/constat_/$constatId/pdf");

export const SendConstatPdf = () => {
  const { localHtmlString } = useConstatPdfContext()!;
  const user = useUser()!;
  const { constatId } = routeApi.useParams();

  const alertsQuery = useStateReportAlertsWithEmail(constatId);
  const alerts = alertsQuery.data;

  return (
    <Stack>
      {alerts?.length ? (
        <Accordion
          sx={{
            alignSelf: "center",
            width: { xs: "100%", lg: "800px" },
          }}
          label={
            <div
              className="fr-icon ri-alarm-warning-fill"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {alerts.length} alerte{addSIfPlural(alerts.length)} signalée{addSIfPlural(alerts.length)}
            </div>
          }
        >
          <Stack px="16px">
            <Typography>
              Les alertes seront envoyées aux services concernés, mais vous pouvez déselectionner celles à ne pas
              envoyer
            </Typography>

            <Stack mt="16px">
              <Checkbox
                options={alerts.map((alert) => ({
                  label: alert.alert,
                  hintText: (
                    <Typography
                      color={!alert.email ? fr.colors.decisions.text.actionHigh.redMarianne.default : undefined}
                    >
                      {alert.email || "Veuillez renseigner un courriel"}
                    </Typography>
                  ),
                  nativeInputProps: {},
                }))}
              ></Checkbox>
            </Stack>
          </Stack>
        </Accordion>
      ) : null}
      <Center>
        <Center width="800px" flexDirection="column">
          <View
            htmlString={localHtmlString!}
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
    queryKey: ["report-pdf", props.htmlString],
    queryFn: async () => {
      const blob = await pdf(<StateReportPDFDocument {...props} />).toBlob();
      return blob;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,

    enabled: !!props.htmlString,
  });

  if (query.isLoading)
    return (
      <Center height="100%">
        <Spinner />
      </Center>
    );

  return <PdfCanvas blob={query.data as Blob} />;
};
