import Badge from "@codegouvfr/react-dsfr/Badge";
import { useStatus } from "@powersync/react";

export const StatusBadge = ({ noProvider }: { noProvider?: boolean }) => {
  const status = noProvider ? null : useStatus();

  if (noProvider) {
    return (
      <Badge small as="span" noIcon severity="info">
        Beta
      </Badge>
    );
  }

  const getTimeSinceLastSync = () => {
    const now = Date.now();
    const lastSync = status?.lastSyncedAt ? new Date(status.lastSyncedAt).getTime() : null;

    if (!lastSync) return -1;

    return Math.floor((now - lastSync) / 1000);
  };

  const timeSinceLastSync = getTimeSinceLastSync();

  const isConnected = status?.connected || timeSinceLastSync < 180;

  return (
    <Badge small as="span" noIcon severity={status ? (isConnected ? "success" : "error") : "success"}>
      {status ? (isConnected ? "En ligne" : "Hors ligne") : "Beta"}
    </Badge>
  );
};
