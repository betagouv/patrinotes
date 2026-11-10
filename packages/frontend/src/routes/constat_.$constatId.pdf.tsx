import { SimpleBanner } from "#components/Banner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps, Dialog, Popover, Portal, Stack, styled, Typography } from "@mui/material";
import { MobileModalActions } from "#components/MobileModalActions.tsx";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  StateReport,
  StateReportAlert,
  StateReportAttachment,
  VisitedSection,
  VisitedSectionAttachment,
} from "../db/AppSchema";
import { attachmentLocalStorage, attachmentQueue, db, getAttachmentUrl, useDbQuery } from "../db/db";
import { useMutation, useQueries, useQuery, UseMutationResult, useMutationState } from "@tanstack/react-query";
import {
  SendConstatForm,
  useIsSendConstatFormDisabled,
  useSendConstatFormContext,
} from "../features/state-report/pdf/ConstatPdfContext";
import { ViewConstatPdf } from "../features/state-report/pdf/ConstatPdf.view";
import { Alert, Button, Center } from "#components/MUIDsfr.tsx";
import { TextEditorContext, TextEditorContextProvider } from "../features/text-editor/TextEditorContext";
import { EditConstatPdf } from "../features/state-report/pdf/ConstatPdf.edit";
import { TextEditorToolbar } from "../features/text-editor/TextEditorToolbar";
import {
  getGroupedStateReportHtmlString,
  getGroupedStateReportMailName,
  getStateReportUpLabel,
} from "@patrinotes/pdf/constat";
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
import {
  getIsStateReportDisabled,
  getStateReportMissingFields,
  stateReportFieldLabels,
  useIsStateReportDisabled,
} from "../features/state-report/utils";
import { getRapportPartIds, useRapportAttachmentStreams, useRapportMembers } from "../features/up/rapportGroupe";
import { useUserSettings } from "../hooks/useUserSettings";
import { useLiveService, useUser } from "../contexts/AuthContext";
import { getIsAlertVisited } from "@patrinotes/pdf/utils";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useSyncStream } from "@powersync/react";
import { IconLink } from "#components/ui/IconLink.tsx";
import { LinkButton } from "#components/ui/LinkButton.tsx";
import { formatSize, ReportAction } from "../features/state-report/StateReportActions";
import { Divider } from "#components/ui/Divider.tsx";

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
  const { constatId } = Route.useParams();

  const stream = useSyncStream({ name: "state_report_attachments_stream", parameters: { state_report_id: constatId } });

  // Once the attachment records for this constat have synced down, force an immediate
  // download pass instead of waiting for the queue's periodic 30s retry poll.
  useEffect(() => {
    if (stream?.subscription.hasSynced) {
      attachmentQueue.syncStorage().catch(console.error);
    }
  }, [stream?.subscription.hasSynced, constatId]);

  if (!stream?.subscription.hasSynced)
    return (
      <Center mt="100px" mb="160px">
        <Spinner />
      </Center>
    );
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
      selectedAlertIds: [],
      htmlString: "",
      alertErrors: [],
      checkErrors: () => {},
      isStateReportDisabled: false,
      pdfBlob: null,
      stateReportIds: [constatId],
      rapportParts: [],
    },
  });

  const userSettings = useUserSettings();
  const { service } = useUser()!;

  const sendConstatMutation = useMutation(constatPdfMutations.send({ constatId, service: service as any }));

  const checkAllAlertsError = (alerts: SendConstatForm["alerts"]) => {
    const selectedIds = form.getValues("selectedAlertIds");
    const alertToSend = alerts.filter((alert) => selectedIds.includes(alert.id));
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
  const stateReport = stateReportQuery.data;

  // rapport groupé (MH complexe): every pending constat of the rapport goes in the same PDF, one chapter each
  const rapportMembers = useRapportMembers(stateReport?.rapport_id);
  const partIds = useMemo(
    () => (stateReport ? getRapportPartIds(stateReport, rapportMembers) : [constatId]),
    [stateReport, rapportMembers, constatId],
  );
  const otherPartIds = partIds.filter((id) => id !== constatId);
  const areOtherPartsSynced = useRapportAttachmentStreams(otherPartIds);

  const partQueries = useQueries({
    queries: partIds.flatMap((id) => {
      const enabled = id === constatId || areOtherPartsSynced;
      return [
        { ...constatPdfQueries.stateReport({ constatId: id }), enabled },
        { ...constatPdfQueries.sections({ constatId: id }), enabled },
        { ...constatPdfQueries.alerts({ constatId: id }), enabled },
      ];
    }),
  });
  const arePartsLoaded = !!stateReport && areOtherPartsSynced && partQueries.every((q) => q.isSuccess);
  const parts = useMemo(() => {
    if (!arePartsLoaded) return null;
    return partIds.map((_id, index) => ({
      stateReport: partQueries[index * 3]!.data as NonNullable<typeof stateReport>,
      visitedSections: partQueries[index * 3 + 1]!.data as any[],
      alerts: partQueries[index * 3 + 2]!.data as any[],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arePartsLoaded, partIds.join(",")]);

  const alerts = useMemo(() => parts?.flatMap((part) => part.alerts), [parts]);

  // sync recipients with state report owner emails
  // and needValidation with userSettings
  useEffect(() => {
    if (!stateReport || !parts) return;
    form.setValue("stateReport", {
      ...stateReport,
      planSituationFailure:
        parts.find((part) => part.stateReport.planSituationFailure === "offline")?.stateReport.planSituationFailure ??
        parts.find((part) => part.stateReport.planSituationFailure)?.stateReport.planSituationFailure ??
        null,
    });
    form.setValue(
      "stateReportIds",
      parts.map((part) => part.stateReport.id),
    );
    form.setValue(
      "rapportParts",
      parts.map(({ stateReport: part }) => ({
        id: part.id,
        titre_edifice: part.titre_edifice,
        up_intitule: part.up_intitule,
        up_chemin: part.up_chemin,
        created_by: part.created_by,
        missingFields: getStateReportMissingFields(part),
      })),
    );
    if (userSettings.isLoading) return;
    if (form.getValues("recipients").length > 0) return;

    const defaultRecipients = userSettings?.userSettings.default_emails?.split(",").map((email) => email.trim());

    const emails = new Set<string>();
    for (const { stateReport: part } of parts) {
      emails.add(part.proprietaire_email ?? "");
      emails.add(part.proprietaire_representant_email ?? "");
    }
    defaultRecipients?.forEach((email) => emails.add(email));

    const emailsArray = Array.from(emails).filter(Boolean);

    form.setValue("recipients", emailsArray);

    const needValidation = userSettings?.userSettings.validation_enabled && userSettings?.userSettings.validation_email;
    form.setValue("needValidation", !!needValidation);
  }, [stateReportQuery.data, parts, userSettings, form]);

  // sync alerts with form since they can be edited in the alert accordion
  useEffect(() => {
    if (!alerts) return;

    const visitedAlerts = alerts.filter((alert) => !!alert.should_send).filter(getIsAlertVisited);

    form.setValue("alerts", visitedAlerts);
    form.setValue(
      "selectedAlertIds",
      visitedAlerts.map((a) => a.id),
    );

    checkAllAlertsError(visitedAlerts);
  }, [alerts, form]);

  // generate html string (only once since displaying it is a heavy operation)
  const isSetRef = useRef(false);

  useEffect(() => {
    if (isSetRef.current) return;
    if (!parts) return;
    const htmlString = getGroupedStateReportHtmlString({ parts: parts as any });

    form.setValue("htmlString", htmlString);

    isSetRef.current = true;

    return () => {
      isSetRef.current = false;
    };
  }, [parts]);

  // propagate isDisabled to children
  useEffect(() => {
    if (!stateReport) return;
    const isStateReportDisabled = getIsStateReportDisabled({ ...stateReport });
    form.setValue("isStateReportDisabled", isStateReportDisabled);
  }, [stateReport]);

  const partLoadFailed = stateReportQuery.isError || partQueries.some((query) => query.isError);
  const isLoading = stateReportQuery.isLoading || (!!stateReport && !parts && !partLoadFailed);

  if (partLoadFailed) {
    return (
      <Center height="100%" mb="160px" px="16px">
        <Alert
          severity="error"
          small={false}
          title="Impossible de charger les pièces du constat"
          description="Vérifiez votre connexion puis rechargez la page pour réessayer."
        />
      </Center>
    );
  }

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

      {mode !== "sent" ? (
        <Box>
          <RapportPartsNotice />
          <ViewConstatPdf step={mode} />
        </Box>
      ) : (
        <SentConstatPdf />
      )}
    </>
  );
};

const contentMap: Record<PageMode, { bannerProps: BannerProps }> = {
  view: {
    bannerProps: {
      content: () => <ViewBannerContent />,
      buttons: noop,
    },
  },
  send: {
    bannerProps: {
      content: () => <SendBannerContent />,
      buttons: noop,
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

const ViewButtons = () => {
  const navigate = useNavigate();
  const { constatId } = Route.useParams();

  const isDisabled = useIsSendConstatFormDisabled();
  const form = useSendConstatFormContext();

  const rapportParts = useWatch({ control: form.control, name: "rapportParts" });
  const pdfName = getGroupedStateReportMailName(rapportParts);
  const hasIncompletePart = rapportParts.some((part) => part.missingFields.length > 0);

  const pdfBlob = useWatch({ control: form.control, name: "pdfBlob" });
  const pdfSize = useWatch({ control: form.control, name: "pdfSize" });

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");

    a.href = url;
    a.download = pdfName;

    a.click();
    URL.revokeObjectURL(url);

    api
      .post("/api/pdf/state-report/log-download", { body: { stateReportId: constatId } } as any)
      .catch((e) => console.error(e));
  };

  return (
    <Flex gap="8px" pr={{ xs: "0", lg: "16px" }} flexDirection={{ xs: "column-reverse", lg: "row" }} width="100%">
      <DownloadMenu pdfBlob={pdfBlob} pdfSize={pdfSize} onDownload={handleDownload} />
      {!isDisabled ? (
        <Button
          type="button"
          disabled={isDisabled || hasIncompletePart}
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
      ) : null}
    </Flex>
  );
};

const DownloadMenu = ({
  pdfBlob,
  pdfSize,
  onDownload,
}: {
  pdfBlob: Blob | null | undefined;
  pdfSize: number | null | undefined;
  onDownload: () => void;
}) => {
  const { constatId } = Route.useParams();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const menuId = useId();

  // the uploaded link only reflects the blob it was created from, so cache it per blob
  const shareLinkRef = useRef<{ blob: Blob; url: Promise<string> } | null>(null);

  const getShareLink = (blob: Blob) => {
    if (shareLinkRef.current?.blob === blob) return shareLinkRef.current.url;

    const url = (async () => {
      const { uploadUrl, pdfPath } = await api.post("/api/pdf/state-report/upload-url", {
        body: { stateReportId: constatId },
      });
      await fetch(uploadUrl, { method: "PUT", body: blob, headers: { "Content-Type": "application/pdf" } });
      const { url } = await api.post("/api/pdf/state-report/share-link", {
        body: { stateReportId: constatId, pdfPath },
      });
      return url;
    })();

    shareLinkRef.current = { blob, url };
    url.catch(() => {
      if (shareLinkRef.current?.url === url) shareLinkRef.current = null;
    });
    return url;
  };

  const copyLinkMutation = useMutation({
    mutationFn: async () => {
      if (!pdfBlob) return;
      const url = getShareLink(pdfBlob);

      // Safari only allows clipboard writes synchronously within the user gesture,
      // so hand it a pending ClipboardItem instead of awaiting the upload first
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "text/plain": url.then((u) => new Blob([u], { type: "text/plain" })) }),
        ]);
      } else {
        await navigator.clipboard.writeText(await url);
      }
    },
    onSuccess: () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    },
    onError: (e) => console.error(e),
  });

  const onClose = () => setAnchorEl(null);
  const isOpen = Boolean(anchorEl);

  const copyLabel = copyLinkMutation.isPending
    ? "Génération du lien..."
    : copyLinkMutation.isError
      ? "Erreur, réessayer de copier le lien"
      : isCopied
        ? "Lien copié !"
        : "Copier le lien de téléchargement";

  const menuContent = (
    <Flex bgcolor="#ECECFE" gap="0" flexDirection="column" role="menu">
      <ReportAction
        iconId={isCopied ? "ri-check-line" : "ri-link"}
        label={copyLabel}
        onClick={() => {
          if (copyLinkMutation.isPending) return;
          copyLinkMutation.mutate();
        }}
      />
      <Divider height="1px" color="#DDD" />
      <ReportAction
        iconId="ri-download-line"
        label={getMenuDownloadLabel(pdfSize ?? null)}
        onClick={() => {
          onDownload();
          onClose();
        }}
      />
    </Flex>
  );

  return (
    <>
      <Button
        type="button"
        priority="secondary"
        iconId={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}
        iconPosition="right"
        disabled={!pdfBlob}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ whiteSpace: "nowrap", justifyContent: "center", width: { xs: "100%", lg: "auto" } }}
      >
        Télécharger
      </Button>
      <Popover
        id={menuId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: "4px" } } }}
        sx={{ display: { xs: "none", lg: "block" } }}
      >
        {menuContent}
      </Popover>
      {isOpen ? (
        // portal out of the page <form> so the menu buttons don't submit it
        <Portal>
          <MobileModalActions onClose={onClose}>{menuContent}</MobileModalActions>
        </Portal>
      ) : null}
    </>
  );
};

const getMenuDownloadLabel = (pdfSize: number | null) =>
  pdfSize ? `Télécharger (PDF - ${formatSize(pdfSize)})` : "Télécharger (PDF)";

type BannerProps = { content: () => ReactNode; buttons: () => ReactNode; alignTop?: boolean };
const Banner = ({ content }: BannerProps) => {
  if (content === noop) {
    return null;
  }

  const Content = content;

  return (
    <SimpleBanner minHeight="80px" position="sticky" top="0" zIndex="appBar" py={{ xs: "8px", lg: "0" }}>
      <Flex
        alignItems="center"
        width="100%"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={{ xs: "8px", lg: "0" }}
        flex="1"
      >
        <Flex justifyContent="center" flex="1" alignItems={"center"} width="100%">
          {/* <Box mt={alignTop ? { xs: "0", lg: "28px" } : "0"} pl={alignTop ? { xs: "0", lg: "0" } : "0"}>
            <GoBackButton />
          </Box> */}
          <Content />
        </Flex>
      </Flex>
    </SimpleBanner>
  );
};

const GoBackButton = ({ sx }: { sx?: BoxProps["sx"] } = {}) => {
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
        ...sx,
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

  const hasNoRecipients = recipients.length === 0;
  const rapportParts = useWatch({ control: form.control, name: "rapportParts" });
  const hasIncompletePart = rapportParts.some((part) => part.missingFields.length > 0);

  return (
    <Flex
      flexDirection={{ xs: "column", lg: "row" }}
      width="100%"
      height="100%"
      justifyContent="center"
      gap="16px"
      py={{ xs: "0", lg: "24px" }}
      px={{ xs: "16px", lg: "0" }}
    >
      <Flex display={{ lg: "flex", xs: "none" }} flex="1" justifyContent="flex-end" alignItems="flex-start">
        <GoBackButton sx={{ mt: "0", mx: "16px" }} />
      </Flex>
      <Flex
        width="100%"
        maxWidth="944px"
        flexDirection={{ xs: "column", lg: "column" }}
        sx={{
          input: {
            bgcolor: "white",
          },
        }}
      >
        <EmailInput
          sx={{ width: "100%", "& .fr-input": { backgroundColor: "white !important" } }}
          label={
            <Flex mt={{ xs: "8px", lg: "0" }} mb={{ xs: 0, lg: "8px" }}>
              <Box mr="8px" display={{ xs: "block", lg: "none" }}>
                <GoBackButton />
              </Box>
              <Box fontWeight="bold">Courriels</Box>
            </Flex>
          }
          value={recipients}
          nativeInputProps={{ style: { backgroundColor: "white" } }}
          onValueChange={setRecipients}
        />
        <ValidationToggle />
      </Flex>
      <Box flex="1" display="flex" justifyContent="flex-start" alignItems="flex-start">
        <Button
          type="submit"
          iconId="ri-send-plane-fill"
          disabled={isPending || isDisabled || hasNoRecipients || hasIncompletePart}
          sx={{
            mt: { xs: "0", lg: "32px" },

            display: { xs: "flex" },
            alignItems: { xs: "center" },
            justifyContent: { xs: "center" },
            width: { xs: "100%", lg: "auto" },
          }}
        >
          {isPending ? "Envoi en cours..." : "Envoyer"}
        </Button>
      </Box>
    </Flex>
  );
};

const ViewBannerContent = () => {
  return (
    <Flex
      flexDirection={{ xs: "column", lg: "row" }}
      width="100%"
      height="100%"
      justifyContent="center"
      gap="16px"
      py={{ xs: "0", lg: "24px" }}
      px={{ xs: "16px", lg: "0" }}
    >
      <Flex display={{ lg: "flex", xs: "none" }} flex="1" justifyContent="flex-end" alignItems="flex-start">
        <GoBackButton sx={{ mt: "0", mx: "16px" }} />
      </Flex>
      <Flex width="100%" maxWidth="944px" flexDirection={{ xs: "column", lg: "row" }} justifyContent={"space-between"}>
        <Flex mt={{ xs: "8px", lg: "0" }}>
          <Box mr="8px" display={{ xs: "block", lg: "none" }}>
            <GoBackButton />
          </Box>
          <Box fontWeight="bold">
            <PreviewTitle />
          </Box>
        </Flex>
        <Flex mt={{ xs: "16px", lg: "0" }} mb={{ xs: "8px", lg: "0" }}>
          <ViewButtons />
        </Flex>
      </Flex>
      <Box flex="1" display={{ xs: "none", lg: "flex" }} justifyContent="flex-start" alignItems="flex-start"></Box>
    </Flex>
  );
};

const ValidationToggle = () => {
  const form = useSendConstatFormContext();
  const needValidation = useWatch({ control: form.control, name: "needValidation" });

  const userSettings = useUserSettings();
  const initialNeedValidation =
    userSettings?.userSettings.validation_enabled && userSettings?.userSettings.validation_email;

  if (!initialNeedValidation) {
    return null;
  }
  return (
    <Box
      width="100%"
      maxWidth="220px"
      mt={{ xs: "36px", lg: "36px" }}
      mr={{ xs: "0", lg: "16px" }}
      ml={{ xs: "0", lg: "16px" }}
      sx={{
        "& label": {
          width: "220px",
          overflowWrap: "normal",
        },
        "& label::before": {
          marginRight: "16px",
          background: "var(--data-uri-svg), white;",
        },
      }}
    >
      <ToggleSwitch
        inputTitle="Envoi sous-couvert"
        showCheckedHint={false}
        labelPosition="right"
        label={
          <Stack mt="-12px">
            <Typography>Envoi sous-couvert</Typography>
            <Typography fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
              {userSettings?.userSettings.validation_email}
            </Typography>
          </Stack>
        }
        checked={needValidation}
        onChange={(checked) => form.setValue("needValidation", checked)}
      />
    </Box>
  );
};

const PreviewTitle = () => {
  const form = useSendConstatFormContext();
  const rapportParts = useWatch({ control: form.control, name: "rapportParts" });
  if (rapportParts.length <= 1) return <>Prévisualisation du constat</>;
  return <>Prévisualisation du rapport ({rapportParts.length} constats)</>;
};

/** Rapport groupé: lists the constats sent together, and those still to be completed before sending. */
const RapportPartsNotice = () => {
  const form = useSendConstatFormContext();
  const navigate = useNavigate();
  const rapportParts = useWatch({ control: form.control, name: "rapportParts" });
  const isDisabled = useIsSendConstatFormDisabled();
  if (rapportParts.length <= 1) return null;

  const incompleteParts = rapportParts.filter((part) => part.missingFields.length > 0);

  const goToPart = (id: string) =>
    navigate({ to: "/constat/$constatId", params: { constatId: id }, search: { step: "contexte-visite", mode: "view" } });

  return (
    <Center flexDirection="column">
      <Box width={{ xs: "100%", lg: "944px" }} mt={{ xs: "16px", lg: "24px" }} px="8px">
        <Alert
          severity={incompleteParts.length && !isDisabled ? "warning" : "info"}
          small={false}
          title={isDisabled ? "Rapport groupé" : `Ces ${rapportParts.length} constats seront envoyés ensemble`}
          description={
            <>
              <Box component="ul" mt="8px" mb="0">
                {rapportParts.map((part, index) => (
                  <li key={part.id}>
                    Chapitre {index + 1} :{" "}
                    <Box
                      component="a"
                      href=""
                      onClick={(e: { preventDefault: () => void }) => {
                        e.preventDefault();
                        goToPart(part.id);
                      }}
                    >
                      {getStateReportUpLabel(part)}
                    </Box>
                    {!isDisabled && part.missingFields.length ? (
                      <Typography component="span" color={fr.colors.decisions.text.default.error.default}>
                        {" "}
                        — à compléter : {part.missingFields.map((f) => stateReportFieldLabels[f] ?? f).join(", ")}
                      </Typography>
                    ) : null}
                  </li>
                ))}
              </Box>
            </>
          }
        />
      </Box>
    </Center>
  );
};
