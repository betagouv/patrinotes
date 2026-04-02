import { SimpleBanner } from "#components/Banner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps, Dialog, Stack, styled, Typography } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect, useId, useRef, useState } from "react";
import {
  StateReport,
  StateReportAlert,
  StateReportAttachment,
  VisitedSection,
  VisitedSectionAttachment,
} from "../db/AppSchema";
import { attachmentLocalStorage, db, getAttachmentUrl, useDbQuery } from "../db/db";
import { useMutation, useQuery, UseMutationResult, useMutationState } from "@tanstack/react-query";
import {
  SendConstatForm,
  useIsSendConstatFormDisabled,
  useSendConstatFormContext,
} from "../features/state-report/pdf/ConstatPdfContext";
import { ViewConstatPdf } from "../features/state-report/pdf/ConstatPdf.view";
import { Button, Center } from "#components/MUIDsfr.tsx";
import { TextEditorContext, TextEditorContextProvider } from "../features/text-editor/TextEditorContext";
import { EditConstatPdf } from "../features/state-report/pdf/ConstatPdf.edit";
import { TextEditorToolbar } from "../features/text-editor/TextEditorToolbar";
import { getStateReportHtmlString } from "@patrinotes/pdf/constat";
import { SendConstatPdf } from "../features/state-report/pdf/ConstatPdf.send";
import { EmailInput } from "#components/EmailInput.tsx";
import { SentConstatPdf } from "../features/state-report/pdf/ConstatPdf.sent";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { api } from "../api";
import { ModalCloseButton } from "../features/menu/MenuTitle";
import { fr } from "@codegouvfr/react-dsfr";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { constatPdfMutations, constatPdfQueries } from "../features/state-report/pdf/ConstatPdf.queries";
import { Spinner } from "#components/Spinner.tsx";
import { useRecipients } from "../features/state-report/pdf/ConstatPdf.hook";
import { last } from "pastable";
import { checkAlertErrors } from "../features/state-report/alerts/StateReportAlert.utils";
import { getIsStateReportDisabled, useIsStateReportDisabled } from "../features/state-report/utils";
import { useUserSettings } from "../hooks/useUserSettings";
import { useLiveService, useUser } from "../contexts/AuthContext";

export const Route = createFileRoute("/constat_/$constatId/pdf")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    const mode = search?.mode as PageMode;
    const isModeValid = ["view", "edit", "send", "sent"].includes(mode);

    return {
      mode: isModeValid ? mode : "view",
    } as { mode: PageMode };
  },
});

const noop = () => null;

function RouteComponent() {
  return <ConstatPdf />;
}

const ConstatPdf = () => {
  const { constatId } = Route.useParams();
  const { mode } = Route.useSearch();

  const form = useForm<SendConstatForm>({
    defaultValues: {
      sections: [],
      stateReport: null as any,
      recipients: [],
      alerts: [],
      htmlString: "",
      alertErrors: [],
      checkErrors: () => {},
      isStateReportDisabled: false,
      pdfBlob: null,
    },
  });

  const userSettings = useUserSettings();
  const { service } = useUser()!;

  const sendConstatMutation = useMutation(constatPdfMutations.send({ constatId, service: service as any }));

  const checkAllAlertsError = (alerts: SendConstatForm["alerts"]) => {
    const alertToSend = alerts.filter((alert) => alert.should_send);
    const alertErrors = alertToSend.map(checkAlertErrors);
    form.setValue("alertErrors", alertErrors);
    return alertErrors;
  };

  form.setValue("checkErrors", () => checkAllAlertsError(form.getValues().alerts));

  const navigate = useNavigate();

  const onSubmit = async (values: SendConstatForm) => {
    const errors = checkAllAlertsError(values.alerts);
    if (errors.some((e) => e.email.length > 0)) {
      return;
    }
    sendConstatMutation.mutateAsync(values, {
      onError: (e) => console.error(e),
      onSuccess: () => {
        navigate({
          to: "/constat/$constatId/pdf",
          params: { constatId },
          search: { mode: "sent" },
        });
      },
    });
  };

  const stateReportQuery = useQuery(constatPdfQueries.stateReport({ constatId }));
  const sectionsQuery = useQuery(constatPdfQueries.sections({ constatId }));
  const alertsQuery = useQuery(constatPdfQueries.alerts({ constatId }));

  const stateReport = stateReportQuery.data;
  const sections = sectionsQuery.data;
  const alerts = alertsQuery.data;

  // sync recipients with state report owner emails
  useEffect(() => {
    if (!stateReport) return;
    if (userSettings.isLoading) return;
    if (form.getValues("recipients").length > 0) return;

    const defaultRecipients = userSettings?.userSettings.default_emails?.split(",").map((email) => email.trim());

    const emails = new Set<string>();
    emails.add(stateReport.proprietaire_email ?? "");
    emails.add(stateReport.proprietaire_representant_email ?? "");
    defaultRecipients?.forEach((email) => emails.add(email));

    const emailsArray = Array.from(emails).filter(Boolean);

    form.setValue("recipients", emailsArray);
  }, [stateReportQuery.data, userSettings, form]);

  // sync alerts with form since they can be edited in the alert accordion
  useEffect(() => {
    if (!alerts) return;
    const alertsWithShouldSend = alerts.map((alert) => ({ ...alert, shouldSend: alert.should_send !== 0 }));

    form.setValue("alerts", alertsWithShouldSend);

    checkAllAlertsError(alertsWithShouldSend);
  }, [alerts, form]);

  // generate html string (only once since displaying it is a heavy operation)
  const isSetRef = useRef(false);

  useEffect(() => {
    if (isSetRef.current) return;
    if (!sections || !stateReport || !alerts) return;
    const htmlString = getStateReportHtmlString({ stateReport: stateReport, visitedSections: sections as any, alerts });

    form.setValue("htmlString", htmlString);

    isSetRef.current = true;

    return () => {
      isSetRef.current = false;
    };
  }, [sections, stateReport, alerts]);

  // propagate isDisabled to children
  useEffect(() => {
    if (!stateReport) return;
    const isStateReportDisabled = getIsStateReportDisabled({ ...stateReport });
    form.setValue("isStateReportDisabled", isStateReportDisabled);
  }, [stateReport]);

  const isLoading = stateReportQuery.isLoading || sectionsQuery.isLoading || alertsQuery.isLoading;

  if (isLoading) {
    return (
      <Center height="100%" mb="160px">
        <Spinner />
      </Center>
    );
  }

  return (
    <FormProvider {...form}>
      <Stack height="100%" component="form" onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <TextEditorContextProvider height="100%">
          <BannerAndContent mode={mode} />
        </TextEditorContextProvider>
      </Stack>
    </FormProvider>
  );
};

type PageMode = "view" | "send" | "sent";

const BannerAndContent = ({ mode }: { mode: PageMode }) => {
  const { bannerProps } = contentMap[mode];
  return (
    <>
      <Banner {...bannerProps} />
      <Box display={mode === "view" ? "block" : "none"}>
        <ViewConstatPdf />
      </Box>
      <Box display={mode === "send" ? "block" : "none"}>
        <SendConstatPdf />
      </Box>
      {mode === "sent" && <SentConstatPdf />}
    </>
  );
};

const contentMap: Record<PageMode, { bannerProps: BannerProps }> = {
  view: {
    bannerProps: {
      content: () => "Prévisualisation du constat",
      buttons: () => {
        const navigate = useNavigate();
        const { constatId } = Route.useParams();

        const isDisabled = useIsSendConstatFormDisabled();
        const form = useSendConstatFormContext();
        const pdfBlob = form.watch("pdfBlob");

        const handleDownload = () => {
          if (!pdfBlob) return;
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `constat-${constatId}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        };

        return (
          <Flex gap="8px" pr={{ xs: "0", lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }} width="100%">
            <Button
              type="button"
              iconId="ri-download-line"
              priority="secondary"
              disabled={!pdfBlob}
              onClick={handleDownload}
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Télécharger
            </Button>
            <Button
              type="button"
              disabled={isDisabled}
              onClick={() =>
                navigate({
                  to: "/constat/$constatId/pdf",
                  params: { constatId },
                  search: { mode: "send" },
                })
              }
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Continuer
            </Button>
          </Flex>
        );
      },
    },
  },
  send: {
    bannerProps: {
      content: () => <SendBannerContent />,
      buttons: () => null,
      alignTop: true,
    },
  },
  sent: {
    bannerProps: {
      content: noop,
      buttons: noop,
    },
  },
};

type BannerProps = { content: () => ReactNode; buttons: () => ReactNode; alignTop?: boolean };
const Banner = ({ content, buttons, alignTop }: BannerProps) => {
  if (content === noop && buttons === noop) {
    return null;
  }

  const Content = content;
  const Buttons = buttons;

  return (
    <SimpleBanner minHeight="80px" position="sticky" top="0" zIndex="appBar" py={{ xs: "8px", lg: "0" }}>
      <Flex
        alignItems="center"
        maxWidth="1200px"
        width="100%"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={{ xs: "8px", lg: "0" }}
      >
        <Flex justifyContent="flex-start" alignItems={alignTop ? "flex-start" : "center"} width="100%" pl="8px">
          <Box mt={alignTop ? { xs: "0", lg: "28px" } : "0"} pl={alignTop ? { xs: "0", lg: "0" } : "0"}>
            <GoBackButton />
          </Box>
          <Box ml={{ xs: "8px", lg: "50px" }} flex="1" fontWeight="bold">
            <Content />
          </Box>
        </Flex>
        <Box width={{ lg: "unset", xs: "100%" }} px={{ xs: "16px" }}>
          <Buttons />
        </Box>
      </Flex>
    </SimpleBanner>
  );
};

const GoBackButton = () => {
  const { constatId } = Route.useParams();
  const navigate = useNavigate();
  const goBack = () => {
    navigate({ to: "/constat/$constatId", params: { constatId }, search: { step: "constat-general", mode: "view" } });
  };

  return (
    <Box
      className={"ri-arrow-left-line"}
      component="a"
      href={""}
      onClick={(e) => {
        e.preventDefault();
        goBack();
      }}
      sx={{
        "::before": {
          width: "16px !important",
          mr: "4px",
        },
      }}
      fontSize="16px"
      whiteSpace="nowrap"
    >
      <Typography display={{ xs: "none", lg: "inline" }} component="span">
        Retour
      </Typography>
    </Box>
  );
};

const SendBannerContent = () => {
  const form = useSendConstatFormContext();
  const recipients = useRecipients();

  const { constatId } = Route.useParams();

  const isDisabled = useIsSendConstatFormDisabled();

  const sendMutationStatus = useMutationState({
    filters: {
      mutationKey: constatPdfMutations.send({ constatId, service: null as any }).mutationKey,
    },
    select: ({ state }) => state.status,
  });

  const currentMutationStatus = last(sendMutationStatus);
  const isPending = currentMutationStatus === "pending";

  const setRecipients = (emails: string[]) => {
    form.setValue("recipients", emails);
  };

  return (
    <>
      {/* // TODO */}
      {/* <AlertEmailErrorModal errors={alertErrors} onClose={() => setAlertErrors(null)} onAlertClick={() => {}} /> */}
      <Flex
        flexDirection={{ xs: "column", lg: "row" }}
        width="100%"
        pl="8px"
        alignItems={{ xs: "center", lg: "flex-start" }}
        gap="16px"
        py={{ xs: "0", lg: "24px" }}
      >
        <Typography ml="-8px" pt={{ xs: 0, lg: "8px" }} mr="16px" fontWeight="bold" alignSelf="flex-start">
          Courriels
        </Typography>
        {!isDisabled ? (
          <Box flex="1" width="100%" pr="16px" ml={{ xs: "-48px", lg: "0" }}>
            <EmailInput value={recipients} onValueChange={setRecipients} />
          </Box>
        ) : null}

        <Box mr={{ xs: "0", lg: "100px" }} ml={{ xs: "-48px", lg: "8px" }} width={{ xs: "100%", lg: "unset" }}>
          <Button
            type="submit"
            iconId="ri-send-plane-fill"
            disabled={isPending || isDisabled}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {isPending ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </Box>
      </Flex>
    </>
  );
};

const AlertEmailErrorModal = ({
  errors,
  onClose,
  onAlertClick,
}: {
  errors: Array<{ id: string; alert: string }> | null;
  onClose: () => void;
  onAlertClick: (alertId: string) => void;
}) => {
  return (
    <Dialog open={!!errors?.length} onClose={onClose}>
      <Box p="24px" maxWidth="500px">
        <Flex justifyContent="space-between" alignItems="flex-start" mb="16px">
          <Flex alignItems="center" gap="8px">
            <Box
              className="fr-icon-error-warning-fill"
              sx={{ color: fr.colors.decisions.text.actionHigh.redMarianne.default }}
            />
            <Typography variant="h6" fontWeight="bold">
              Alertes sans courriel
            </Typography>
          </Flex>
          <ModalCloseButton onClose={onClose} />
        </Flex>
        <Typography mb="16px">Veuillez renseigner un courriel pour les alertes suivantes :</Typography>
        <Stack component="ul" gap="8px" pl="16px">
          {errors?.map(({ id, alert }) => (
            <li key={id}>
              <Typography
                onClick={() => onAlertClick(id)}
                sx={{
                  cursor: "pointer",
                  color: fr.colors.decisions.text.actionHigh.redMarianne.default,
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "none",
                  },
                }}
              >
                {alert}
              </Typography>
            </li>
          ))}
        </Stack>
      </Box>
    </Dialog>
  );
};
