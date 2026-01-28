import { useMutation, useQuery } from "@tanstack/react-query";
import { useConstatPdfContext } from "./ConstatPdfContext";
import { getStateReportHtmlString, StateReportPDFDocument, StateReportPDFDocumentProps } from "@cr-vif/pdf/constat";
import { pdf } from "@react-pdf/renderer";
import { Accordion, Center, Checkbox, Input } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { PdfCanvas } from "../../../routes/pdf.$reportId";
import { useService, useUser } from "../../../contexts/AuthContext";
import { getRouteApi } from "@tanstack/react-router";
import { useStateReportAlerts, useStateReportAlertsWithEmail } from "../StateReportSideMenu";
import { addSIfPlural } from "../../../utils";
import { Box, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../db/db";
import { StateReportAlert } from "../../../db/AppSchema";

const routeApi = getRouteApi("/constat_/$constatId/pdf");

export const SendConstatPdf = () => {
  const { localHtmlString, scrollToAlertRef, setSelectedAlerts } = useConstatPdfContext()!;
  const user = useUser()!;
  const { constatId } = routeApi.useParams();

  const alertsQuery = useStateReportAlertsWithEmail(constatId);
  const alerts = alertsQuery.data ?? [];

  const [checkedAlertIds, setCheckedAlertIds] = useState<Set<string>>(new Set());
  const isInitialized = useRef(false);

  // init all alerts as checked when data loads
  const alertIds = alerts.map((a) => a.id).join(",");
  useEffect(() => {
    if (alerts.length > 0 && !isInitialized.current) {
      isInitialized.current = true;
      setCheckedAlertIds(new Set(alerts.map((a) => a.id)));
    }
  }, [alertIds]); // eslint-disable-line react-hooks/exhaustive-deps

  // sync selected alerts to context
  useEffect(() => {
    if (!isInitialized.current) return;
    const selected = alerts
      .filter((a) => checkedAlertIds.has(a.id))
      .map((a) => ({ id: a.id, alert: a.alert, email: String(a.email || "") }));
    setSelectedAlerts(selected);
  }, [checkedAlertIds, alertIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAlert = (alertId: string) => {
    setCheckedAlertIds((prev) => {
      const next = new Set(prev);
      if (next.has(alertId)) {
        next.delete(alertId);
      } else {
        next.add(alertId);
      }
      return next;
    });
  };

  // scroll + focus
  const alertRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const accordionRef = useRef<HTMLDivElement | null>(null);

  // expose scroll function to parent via context
  useEffect(() => {
    if (scrollToAlertRef) {
      scrollToAlertRef.current = (alertId: string) => {
        const accordionButton = accordionRef.current?.querySelector("button[aria-expanded='false']");
        if (accordionButton) {
          (accordionButton as HTMLButtonElement).click();
        }

        setTimeout(() => {
          const ref = alertRefs.current[alertId];
          ref?.scrollIntoView({ behavior: "smooth", block: "center" });
          ref?.focus();
        }, 100);
      };
    }
  }, [scrollToAlertRef]);

  return (
    <Stack>
      {alerts?.length ? (
        <Center>
          <Box ref={accordionRef} sx={{ width: { xs: "100%", lg: "800px" } }}>
            <Accordion
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

                <Stack mt="16px" gap="16px">
                  {alerts.map((alert) => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      inputRef={(el) => (alertRefs.current[alert.id] = el)}
                      checked={checkedAlertIds.has(alert.id)}
                      onToggle={() => toggleAlert(alert.id)}
                    />
                  ))}
                </Stack>
              </Stack>
            </Accordion>
          </Box>
        </Center>
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

type AlertWithEmail = StateReportAlert & { email: string };

const AlertRow = ({
  alert,
  inputRef,
  checked,
  onToggle,
}: {
  alert: AlertWithEmail;
  inputRef: (el: HTMLInputElement | null) => void;
  checked: boolean;
  onToggle: () => void;
}) => {
  const service = useService();
  const [email, setEmail] = useState(alert.email || "");

  const emailKey = "courriel_" + (alert.alert ?? "").toLowerCase();
  const hasServiceEmail = !!service?.[emailKey as keyof typeof service];

  const saveEmailMutation = useMutation({
    mutationFn: async (newEmail: string) => {
      await db.updateTable("state_report_alert").set({ email: newEmail }).where("id", "=", alert.id).execute();
    },
  });

  const handleBlur = () => {
    if (email !== alert.email) {
      saveEmailMutation.mutate(email);
    }
  };

  return (
    <Checkbox
      options={[
        {
          label: alert.alert,
          hintText: hasServiceEmail ? (
            <Typography>{alert.email}</Typography>
          ) : (
            <Box sx={{ mt: "4px" }}>
              <Input
                label=""
                nativeInputProps={{
                  ref: inputRef as React.LegacyRef<HTMLInputElement>,
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  onBlur: handleBlur,
                  placeholder: "Courriel",
                }}
                hintText={
                  !email ? (
                    <Typography color={fr.colors.decisions.text.actionHigh.redMarianne.default}>
                      Veuillez renseigner un courriel
                    </Typography>
                  ) : undefined
                }
              />
            </Box>
          ),
          nativeInputProps: {
            checked,
            onChange: onToggle,
          },
        },
      ]}
    />
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
