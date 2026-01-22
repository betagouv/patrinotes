import { SimpleBanner } from "#components/Banner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps, Dialog, Stack, styled, Typography } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { StateReport, StateReportAttachment, VisitedSection, VisitedSectionAttachment } from "../db/AppSchema";
import { attachmentStorage, db, getAttachmentUrl, useDbQuery } from "../db/db";
import { useQuery } from "@tanstack/react-query";
import { AlertWithEmail, ConstatPdfContext, useConstatPdfContext } from "../features/state-report/pdf/ConstatPdfContext";
import { ViewConstatPdf } from "../features/state-report/pdf/ConstatPdf.view";
import { Button } from "#components/MUIDsfr.tsx";
import { TextEditorContext, TextEditorContextProvider } from "../features/text-editor/TextEditorContext";
import { EditConstatPdf } from "../features/state-report/pdf/ConstatPdf.edit";
import { TextEditorToolbar } from "../features/text-editor/TextEditorToolbar";
import { getStateReportHtmlString } from "@cr-vif/pdf/constat";
import { SendConstatPdf } from "../features/state-report/pdf/ConstatPdf.send";
import { EmailInput } from "#components/EmailInput.tsx";
import { SentConstatPdf } from "../features/state-report/pdf/ConstatPdf.sent";
import { PendingConstatPdf } from "../features/state-report/pdf/ConstatPdf.pending";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { api } from "../api";
import { ModalCloseButton } from "../features/menu/MenuTitle";
import { fr } from "@codegouvfr/react-dsfr";

export const Route = createFileRoute("/constat_/$constatId/pdf")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    const mode = search?.mode as PageMode;
    const isModeValid = ["view", "edit", "send", "sent", "pending_validation"].includes(mode);
    const supervisorEmail = search?.supervisorEmail as string | undefined;

    return {
      mode: isModeValid ? mode : "view",
      supervisorEmail,
    } as { mode: PageMode; supervisorEmail?: string };
  },
});
const noop = () => null;

function RouteComponent() {
  return <ConstatPdf />;
}

const ConstatPdf = () => {
  const { constatId } = Route.useParams();
  const { mode } = Route.useSearch();
  const [recipients, setRecipients] = useState<string[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<AlertWithEmail[]>([]);
  const scrollToAlertRef = useRef<((alertId: string) => void) | undefined>();

  const stateReportQuery = useQuery({
    queryKey: ["state-report-with-user-and-attachments", constatId],
    queryFn: async () => {
      const stateReportQuery = await db
        .selectFrom("state_report")
        .leftJoin("user", "user.id", "state_report.created_by")
        .selectAll(["state_report"])
        .select(["user.name as createdByName"])
        .where("state_report.id", "=", constatId)
        .limit(1)
        .execute();

      if (stateReportQuery.length === 0) {
        return null;
      }

      const stateReport = stateReportQuery[0];

      const attachmentQuery = await db
        .selectFrom("state_report_attachment")
        .selectAll()
        .where("state_report_id", "=", constatId)
        .execute();

      const attachmentsWithFiles = await Promise.all(
        attachmentQuery.map(async (attachment) => {
          const file = await getAttachmentUrl(attachment.id);
          return {
            ...attachment,
            file,
          };
        }),
      );

      const newRecipients = [];
      if (stateReport.proprietaire_email) {
        newRecipients.push(stateReport.proprietaire_email);
      }
      if (
        stateReport.proprietaire_representant_email &&
        stateReport.proprietaire_representant_email !== stateReport.proprietaire_email
      ) {
        newRecipients.push(stateReport.proprietaire_representant_email);
      }

      setRecipients(newRecipients);

      return {
        ...stateReportQuery[0],
        attachments: attachmentsWithFiles,
      };
    },
    refetchOnWindowFocus: false,
  });

  const sectionsQuery = useQuery({
    queryKey: ["visited-sections", constatId],
    queryFn: async () => {
      const visitedSections = await db
        .selectFrom("visited_section")
        .selectAll()
        .where("state_report_id", "=", constatId)

        .execute();

      const visitedSectionAttachments = await db
        .selectFrom("visited_section_attachment")
        .selectAll()
        .where(
          "visited_section_id",
          "in",
          visitedSections.map((vs) => vs.id),
        )
        .where("is_deprecated", "=", 0)
        .execute();

      const attachments = await Promise.all(
        visitedSectionAttachments.map(async (attachment) => {
          const file = await getAttachmentUrl(attachment.id);
          return {
            ...attachment,
            file,
          };
        }),
      );

      return visitedSections.map((section) => ({
        ...section,
        attachments: attachments.filter((att) => att.visited_section_id === section.id),
      }));
    },
    refetchOnWindowFocus: false,
  });

  const sections = sectionsQuery.data;
  const stateReport = stateReportQuery.data;

  const isSetRef = useRef(false);
  const [localHtmlString, setLocalHtmlString] = useState<null | string>(null);

  useEffect(() => {
    if (isSetRef.current) return;
    if (!sections || !stateReport) return;

    const htmlString = getStateReportHtmlString({ stateReport: stateReport, visitedSections: sections });
    setLocalHtmlString(htmlString);
    isSetRef.current = true;
  }, [sections, stateReport]);

  const contextValue = {
    isLoading: stateReportQuery.isLoading || sectionsQuery.isLoading,
    stateReport: stateReport,
    sections: sections,
    localHtmlString,
    setLocalHtmlString,
    recipients,
    setRecipients,
    scrollToAlertRef,
    selectedAlerts,
    setSelectedAlerts,
  };

  return (
    <Stack height="100%">
      <ConstatPdfContext.Provider value={contextValue}>
        <TextEditorContextProvider height="100%">
          <BannerAndContent mode={mode} />
        </TextEditorContextProvider>
      </ConstatPdfContext.Provider>
    </Stack>
  );
};

type PageMode = "view" | "send" | "sent" | "pending_validation";

const BannerAndContent = ({ mode }: { mode: PageMode }) => {
  const { supervisorEmail } = Route.useSearch();
  const entry = contentMap[mode];
  const { bannerProps, Component } = entry;
  return (
    <>
      <Banner {...bannerProps} />
      {mode === "pending_validation" ? <PendingConstatPdf supervisorEmail={supervisorEmail} /> : <Component />}
    </>
  );
};

const contentMap: Record<PageMode, { bannerProps: BannerProps; Component: () => ReactNode }> = {
  view: {
    bannerProps: {
      content: () => "Prévisualisation du constat",
      buttons: () => {
        const navigate = useNavigate();
        const { constatId } = Route.useParams();
        return (
          <Flex gap="8px">
            <Button
              type="button"
              onClick={() =>
                navigate({
                  to: "/constat/$constatId/pdf",
                  params: { constatId },
                  search: { mode: "send" },
                })
              }
            >
              Continuer
            </Button>
          </Flex>
        );
      },
    },
    Component: ViewConstatPdf,
  },
  send: {
    bannerProps: {
      content: () => <SendBannerContent />,
      buttons: () => null,
      alignTop: true,
    },
    Component: SendConstatPdf,
  },
  sent: {
    bannerProps: {
      content: noop,
      buttons: noop,
    },
    Component: SentConstatPdf,
  },
  pending_validation: {
    bannerProps: {
      content: noop,
      buttons: noop,
    },
    Component: () => null, // Component is handled separately in BannerAndContent
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
          <Box mt={alignTop ? { xs: "6px", lg: "22px" } : "0"} pl={alignTop ? { xs: "16px", lg: "0" } : "0"}>
            <GoBackButton />
          </Box>
          <Box ml={{ xs: "8px", lg: "50px" }} flex="1" fontWeight="bold">
            <Content />
          </Box>
        </Flex>
        <Box>
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
    navigate({ to: "/constat/$constatId", params: { constatId }, search: { step: "constat-detaille", mode: "view" } });
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
  const { recipients, setRecipients, localHtmlString, scrollToAlertRef, selectedAlerts } = useConstatPdfContext()!;
  const navigate = useNavigate();
  const { constatId } = Route.useParams();
  const [alertErrors, setAlertErrors] = useState<Array<{ id: string; alert: string }> | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleSend = async () => {
    setSendError(null);

    // Validate all selected alerts have emails
    const alertsWithoutEmail = selectedAlerts.filter((alert) => !alert.email);

    if (alertsWithoutEmail.length) {
      setAlertErrors(alertsWithoutEmail.map((a) => ({ id: a.id, alert: a.alert ?? "" })));
      return;
    }

    // Send email
    setIsSending(true);
    try {
      const response = await api.post("/api/pdf/state-report", {
        body: {
          stateReportId: constatId,
          htmlString: localHtmlString!,
          recipients: recipients.join(","),
          alerts: selectedAlerts.map((a) => ({ id: a.id, alert: a.alert, email: a.email })),
        },
      });

      // Check if response indicates pending validation
      try {
        const parsed = typeof response === "string" ? JSON.parse(response) : response;
        if (parsed.status === "pending_validation") {
          navigate({
            to: "/constat/$constatId/pdf",
            params: { constatId },
            search: { mode: "pending_validation", supervisorEmail: parsed.supervisorEmail },
          });
          return;
        }
      } catch {
        // Not JSON, treat as normal URL response
      }

      navigate({
        to: "/constat/$constatId/pdf",
        params: { constatId },
        search: { mode: "sent" },
      });
    } catch (e) {
      setSendError((e as Error).message || "Une erreur est survenue");
      setIsSending(false);
    }
  };

  const handleAlertClick = (alertId: string) => {
    setAlertErrors(null);
    scrollToAlertRef?.current?.(alertId);
  };

  return (
    <>
      <AlertEmailErrorModal
        errors={alertErrors}
        onClose={() => setAlertErrors(null)}
        onAlertClick={handleAlertClick}
      />
      <Flex
        flexDirection={{ xs: "column", lg: "row" }}
        width="100%"
        alignItems={{ xs: "center", lg: "flex-start" }}
        gap="16px"
        py={{ xs: "8px", lg: "24px" }}
      >
        <Typography pt={{ xs: 0, lg: "8px" }} mr="16px" fontWeight="bold" alignSelf="flex-start">
          Courriels
        </Typography>
        <Box flex="1" width="100%" pr="16px" ml={{ xs: "-48px", lg: "0" }}>
          <EmailInput value={recipients} onValueChange={setRecipients} />
          {sendError && (
            <Typography color="error" mt="8px">
              Erreur: {sendError}
            </Typography>
          )}
        </Box>

        <Box mr="100px" ml="8px">
          <Button
            type="button"
            iconId="ri-send-plane-fill"
            disabled={isSending}
            onClick={handleSend}
          >
            {isSending ? "Envoi en cours..." : "Envoyer"}
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
        <Typography mb="16px">
          Veuillez renseigner un courriel pour les alertes suivantes :
        </Typography>
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
