import { Dialog, Box, DialogTitle, Typography, Stack } from "@mui/material";
import { AttachmentState } from "@powersync/web";
import { Badge, Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { ModalCloseButton } from "../menu/MenuTitle";
import { db, attachmentQueue } from "../../db/db";
import type { UnsyncedAttachment } from "./hooks/useUnsyncedAttachments";

const statusData: Record<number, { label: string; bgColor: string; color: string; icon: string }> = {
  [AttachmentState.QUEUED_UPLOAD]: {
    label: "En attente d'envoi",
    bgColor: "#FEE7FC",
    color: "#855080",
    icon: "fr-icon-refresh-line",
  },
  [AttachmentState.QUEUED_DOWNLOAD]: {
    label: "En cours de téléchargement",
    bgColor: "#FEE7FC",
    color: "#855080",
    icon: "fr-icon-refresh-line",
  },
  [AttachmentState.ARCHIVED]: {
    label: "Erreur",
    bgColor: "#FEC9C9",
    color: "#853C3C",
    icon: "fr-icon-warning-line",
  },
  [AttachmentState.QUEUED_DELETE]: {
    label: "En cours de suppression",
    bgColor: "#FEE7FC",
    color: "#855080",
    icon: "fr-icon-refresh-line",
  },
};

function AttachmentStatusBadge({ state }: { state: number | null }) {
  const data = state != null ? statusData[state] : null;
  if (!data) return null;
  return (
    <Badge
      severity="info"
      noIcon
      small
      style={{ backgroundColor: data.bgColor, color: data.color, display: "inline-flex", alignItems: "center" }}
    >
      <Typography
        className={data.icon}
        sx={{ "::before": { width: "12px !important", height: "12px !important", verticalAlign: "middle !important" } }}
      />
      <Typography ml="4px">{data.label}</Typography>
    </Badge>
  );
}

async function ignoreAttachment(attachment: UnsyncedAttachment) {
  await db.updateTable(attachment.table).set({ is_ignored: 1 }).where("id", "=", attachment.id).execute();
}

export const ImageSyncModal = ({
  unsyncedAttachments,
  onClose,
  onIgnoreAll,
}: {
  unsyncedAttachments: UnsyncedAttachment[];
  onClose: () => void;
  onIgnoreAll: () => void;
}) => {
  const handleRetry = () => {
    attachmentQueue.syncStorage();
  };

  const handleIgnoreAll = async () => {
    await Promise.all(unsyncedAttachments.map(ignoreAttachment));
    onIgnoreAll();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      disablePortal
      sx={{
        ".MuiPaper-root": { maxWidth: { xs: "100%", sm: "600px" }, width: "600px" },
        zIndex: 1400,
      }}
    >
      <Box p="16px" width="100%">
        <ModalCloseButton onClose={onClose} />
        <DialogTitle>Des images ne sont pas synchronisées</DialogTitle>
        <Box px="24px" pb="16px">
          <Typography mb="16px" color="text.secondary">
            Les images suivantes n'ont pas encore été envoyées au serveur. Vous pouvez réessayer l'envoi ou les ignorer
            (elles n'apparaîtront pas dans le PDF).
          </Typography>
          <Stack gap="12px">
            {unsyncedAttachments.map((attachment) => (
              <Flex
                key={attachment.id}
                alignItems="center"
                gap="8px"
                p="8px 12px"
                border="1px solid #e0e0e0"
                borderRadius="4px"
              >
                <AttachmentStatusBadge state={attachment.state} />
                <Typography flex="1" fontSize="14px" noWrap>
                  {attachment.table || attachment.attachmentId.split("/").pop() || "Image"}
                </Typography>
                <Button
                  type="button"
                  priority="secondary"
                  iconId="fr-icon-refresh-line"
                  onClick={handleRetry}
                  size="small"
                >
                  Réessayer
                </Button>
                <Button
                  type="button"
                  priority="tertiary no outline"
                  onClick={() => ignoreAttachment(attachment)}
                  size="small"
                >
                  Ignorer
                </Button>
              </Flex>
            ))}
          </Stack>
        </Box>
        <Flex justifyContent="flex-end" gap="16px" px="24px" pb="16px">
          <Button priority="secondary" onClick={onClose} type="button">
            Fermer
          </Button>
          <Button onClick={handleIgnoreAll} type="button">
            Ignorer toutes les images non synchronisées
          </Button>
        </Flex>
      </Box>
    </Dialog>
  );
};
