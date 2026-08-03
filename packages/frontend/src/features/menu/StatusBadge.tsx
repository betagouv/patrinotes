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

  const isConnected = status?.connected;

  return (
    <Badge small as="span" noIcon severity={status ? (isConnected ? "success" : "error") : "success"}>
      {status ? (isConnected ? "En ligne" : "Hors ligne") : "Beta"}
    </Badge>
  );
};
