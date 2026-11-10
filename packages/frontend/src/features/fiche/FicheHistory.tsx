import { Accordion } from "#components/MUIDsfr.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { getStateReportMailName } from "@patrinotes/pdf/constat";
import { getObjetAnnotationSummary } from "@patrinotes/pdf/utils";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Fragment, ReactNode } from "react";
import { api } from "../../api";
import { getAttachmentUrl } from "../../db/db";
import { downloadFile } from "../../utils";
import { getRecipients } from "./alerts/MonumentAlertFields";
import type { MonumentAlertWithAttachments } from "./alerts/monumentAlerts";
import type { MonumentConstatRow } from "./useMonumentConstats";

const colors = fr.colors.decisions;

export type HistoryItem =
  | { type: "constat"; date: string | null; constat: MonumentConstatRow }
  | { type: "alert"; date: string | null; alert: MonumentAlertWithAttachments }
  /** alert of a constat about an objet mobilier */
  | {
      type: "constat-alert";
      date: string | null;
      probleme: string | null;
      commentaires: string | null;
      constatLabel: string;
    };

/** Builds the timeline, newest first. */
export const buildHistory = ({
  constats = [],
  alerts = [],
  extra = [],
}: {
  constats?: MonumentConstatRow[];
  alerts?: MonumentAlertWithAttachments[];
  extra?: HistoryItem[];
}): HistoryItem[] =>
  [
    ...constats.map((constat) => ({ type: "constat" as const, date: constat.created_at, constat })),
    ...alerts.map((alert) => ({ type: "alert" as const, date: alert.submitted_at ?? alert.created_at, alert })),
    ...extra,
  ].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

/** « Historique »: constats, alerts and annotations created on Patrinotes. */
export const FicheHistory = ({ items }: { items: HistoryItem[] }) => {
  return (
    <Box>
      <Accordion
        label={
          <Flex alignItems="center" gap="16px">
            <span className={fr.cx("fr-icon-article-fill", "fr-icon--sm")} aria-hidden="true" />
            {`Historique${items.length ? ` (${items.length})` : ""}`}
          </Flex>
        }
        sx={{
          bgcolor: "#ECECFE",
          borderRadius: "4px",
          "::before": { boxShadow: "none" },
          ".fr-collapse": { bgcolor: "white", paddingX: "0 !important" },
        }}
      >
        <Typography mb="24px">
          Retrouvez les constats d’états antérieurs, annotations et alertes créés sur Patrinotes.
        </Typography>
        {items.length ? (
          <Stack>
            {items.map((item, index) => (
              <Fragment key={getKey(item, index)}>
                {index > 0 ? <Divider my="24px" /> : null}
                <HistoryEntry item={item} />
              </Fragment>
            ))}
          </Stack>
        ) : (
          <Typography color={colors.text.mention.grey.default}>Aucun constat ni alerte pour le moment.</Typography>
        )}
      </Accordion>
    </Box>
  );
};

const getKey = (item: HistoryItem, index: number) =>
  item.type === "constat" ? item.constat.id : item.type === "alert" ? item.alert.id : `constat-alert-${index}`;

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "";

const HistoryEntry = ({ item }: { item: HistoryItem }) => {
  if (item.type === "constat") {
    return (
      <EntryLayout date={item.date} tag="Constat d’état">
        <ConstatLink constat={item.constat} />
      </EntryLayout>
    );
  }

  if (item.type === "constat-alert") {
    return (
      <EntryLayout date={item.date} tag="Alerte" detail={item.constatLabel}>
        {item.probleme ? <Typography fontWeight="bold">{item.probleme}</Typography> : null}
        {item.commentaires ? <Typography>Commentaires : {item.commentaires}</Typography> : null}
      </EntryLayout>
    );
  }

  const alert = item.alert;
  const recipients = alert.should_send
    ? getRecipients({
        should_send: true,
        mandatory_emails: alert.mandatory_emails ?? "",
        additional_emails: alert.additional_emails ?? "",
      })
    : [];
  const sendingState = !alert.should_send
    ? null
    : alert.sent_at
      ? `Envoyée à : ${recipients.join(", ")}`
      : `Envoi en attente (${recipients.join(", ")})`;

  if (alert.kind === "annotation") {
    const summary = getObjetAnnotationSummary(alert);
    return (
      <EntryLayout date={item.date} tag="Annotations de visite" detail={sendingState}>
        {summary.length ? (
          <Box component="ul" m="0 !important" pl="24px !important">
            {summary.map((line) => (
              <Typography component="li" key={line} fontWeight="bold">
                {line}
              </Typography>
            ))}
          </Box>
        ) : null}
        {alert.commentaires ? <Typography mt="12px">Commentaires : {alert.commentaires}</Typography> : null}
        <Thumbnails attachments={alert.attachments} />
      </EntryLayout>
    );
  }

  return (
    <EntryLayout date={item.date} tag="Alerte" detail={sendingState}>
      <Typography fontWeight="bold">{alert.probleme || alert.alert}</Typography>
      {alert.commentaires ? <Typography>Commentaires : {alert.commentaires}</Typography> : null}
      <Thumbnails attachments={alert.attachments} />
    </EntryLayout>
  );
};

const EntryLayout = ({
  date,
  tag,
  detail,
  children,
}: {
  date: string | null;
  tag: string;
  detail?: string | null;
  children: ReactNode;
}) => (
  <Stack gap="12px">
    <Flex alignItems="center" gap="8px" color={colors.text.mention.grey.default}>
      <span className={fr.cx("fr-icon-time-fill", "fr-icon--sm")} aria-hidden="true" />
      <Typography fontSize="14px">
        {formatDate(date)}
      </Typography>
    </Flex>
    <Flex alignItems="center" gap="12px" flexWrap="wrap">
      <p className="fr-tag fr-tag--sm" style={{ margin: 0 }}>
        {tag}
      </p>
      {detail ? (
        <Typography fontSize="14px" color={colors.text.mention.grey.default}>
          {detail}
        </Typography>
      ) : null}
    </Flex>
    <Box>{children}</Box>
  </Stack>
);

/** A constat: opened in the app when synced to this device, otherwise its PDF is downloaded. */
const ConstatLink = ({ constat }: { constat: MonumentConstatRow }) => {
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const base64 = (await api.get("/api/pdf/state-report", { query: { stateReportId: constat.id } })) as string;
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      downloadFile(URL.createObjectURL(blob), getStateReportMailName({ titre_edifice: constat.titre_edifice ?? undefined }));
    },
  });

  const label = `${constat.created_at ? new Date(constat.created_at).toLocaleDateString("fr-FR") : ""} - visite ${
    constat.nature_visite === "complète" ? "complète" : "partielle"
  }${constat.up_intitule ? ` - ${constat.up_intitule}` : ""}`;

  return (
    <Stack>
      {constat.isLocal ? (
        <a
          className="fr-link fr-icon-arrow-right-up-line fr-link--icon-right"
          href={`/constat/${constat.id}/pdf`}
          target="_blank"
          rel="noopener"
          title={`${label} - ouvre le constat dans un nouvel onglet`}
        >
          {label}
        </a>
      ) : (
        <a
          className="fr-link fr-icon-download-line fr-link--icon-right"
          href="#"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            if (!downloadMutation.isPending) downloadMutation.mutate();
          }}
        >
          {label}
          {downloadMutation.isPending ? " (téléchargement…)" : " (PDF)"}
        </a>
      )}
      <Typography color={colors.text.actionHigh.blueFrance.default}>
        par {constat.redacted_by}
        {constat.service_name && !constat.isLocal ? ` — ${constat.service_name}` : ""}
      </Typography>
      {downloadMutation.isError ? (
        <Typography fontSize="12px" color={colors.text.default.error.default}>
          Le téléchargement a échoué, veuillez réessayer.
        </Typography>
      ) : null}
    </Stack>
  );
};

const Thumbnails = ({ attachments }: { attachments: MonumentAlertWithAttachments["attachments"] }) => {
  if (!attachments.length) return null;
  return (
    <Flex gap="8px" flexWrap="wrap" mt="12px">
      {attachments.map((attachment) => (
        <Thumbnail key={attachment.id} attachmentId={attachment.attachment_id!} label={attachment.label} />
      ))}
    </Flex>
  );
};

const Thumbnail = ({ attachmentId, label }: { attachmentId: string; label: string | null }) => {
  const urlQuery = useQuery({
    queryKey: ["attachment-url", attachmentId],
    queryFn: () => getAttachmentUrl(attachmentId),
    retry: 3,
    retryDelay: 5000,
    staleTime: Infinity,
  });
  if (!urlQuery.data) return <Box width="260px" height="130px" bgcolor={colors.background.alt.grey.default} />;
  return (
    <Box
      component="img"
      src={urlQuery.data}
      alt={label || "Photo jointe à l’alerte"}
      width="260px"
      height="130px"
      sx={{ objectFit: "cover" }}
    />
  );
};
