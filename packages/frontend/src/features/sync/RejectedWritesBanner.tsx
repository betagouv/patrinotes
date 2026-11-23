import { Alert, Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Dialog, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { ModalCloseButton } from "../menu/MenuTitle";
import { clearRejectedWrites, RejectedWrite, useRejectedWrites } from "./rejectedWrites";

const TABLE_LABELS: Record<string, string> = {
  report: "Compte rendu",
  report_attachment: "Photo de compte rendu",
  state_report: "Constat d'état",
  state_report_attachment: "Photo de constat d'état",
  state_report_alert: "Alerte de constat d'état",
  state_report_alert_attachment: "Photo d'alerte",
  state_report_sent_email: "Envoi de constat d'état",
  visited_section: "Partie visitée de constat d'état",
  visited_section_attachment: "Photo de partie visitée",
  monument_alert: "Alerte monument",
  monument_alert_attachment: "Photo d'alerte monument",
  monument_correction: "Correction de fiche monument",
  sent_email: "Envoi de compte rendu",
  service: "Service",
  service_instructeurs: "Service instructeur",
  clause_v2: "Clause",
  user: "Compte",
  user_settings: "Paramètres",
  delegation: "Délégation",
  pdf_snapshot: "PDF",
  suggested_email: "Adresse suggérée",
};

const OP_LABELS: Record<string, string> = {
  PUT: "création",
  PATCH: "modification",
  DELETE: "suppression",
};

export const getTableLabel = (table: string) => TABLE_LABELS[table] ?? table;

/** Persistent banner shown while the server refused or set aside local writes. */
export const RejectedWritesBanner = () => {
  const rejected = useRejectedWrites();
  const [showDetail, setShowDetail] = useState(false);

  if (!rejected.length) return null;

  const title =
    rejected.length > 1
      ? `${rejected.length} modifications n'ont pas pu être enregistrées.`
      : "Une modification n'a pas pu être enregistrée.";

  return (
    <Box px={{ xs: "16px", lg: "24px" }} pt="16px" data-test-id="rejected-writes-banner">
      {/* @ts-ignore */}
      <Alert
        severity="error"
        small
        description={
          <Flex alignItems="center" flexWrap="wrap" gap="8px">
            <span>{title}</span>
            <Button priority="tertiary no outline" size="small" type="button" onClick={() => setShowDetail(true)}>
              Voir le détail
            </Button>
          </Flex>
        }
      />
      {showDetail ? <RejectedWritesDialog rejected={rejected} onClose={() => setShowDetail(false)} /> : null}
    </Box>
  );
};

const RejectedWritesDialog = ({ rejected, onClose }: { rejected: RejectedWrite[]; onClose: () => void }) => {
  return (
    <Dialog
      open
      onClose={onClose}
      disablePortal
      sx={{
        ".MuiPaper-root": { maxWidth: { xs: "100%", sm: "800px" }, width: "800px" },
        zIndex: 1400,
      }}
    >
      <Box p="16px" width="100%">
        <ModalCloseButton onClose={onClose} />
        <DialogTitle>Modifications non enregistrées</DialogTitle>
        <Box p="8px 24px 24px 24px">
          Le serveur n'a pas enregistré les modifications suivantes. Elles ont été annulées sur cet appareil.
          <Table size="small" sx={{ mt: "16px" }}>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Motif</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rejected.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {getTableLabel(entry.table)}
                    {OP_LABELS[entry.op] ? ` (${OP_LABELS[entry.op]})` : ""}
                  </TableCell>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Flex justifyContent="flex-end" gap="16px" px="24px" pb="16px">
          <Button
            type="button"
            onClick={() => {
              clearRejectedWrites();
              onClose();
            }}
          >
            J'ai compris
          </Button>
        </Flex>
      </Box>
    </Dialog>
  );
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};
