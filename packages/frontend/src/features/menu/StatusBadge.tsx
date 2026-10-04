import Badge from "@codegouvfr/react-dsfr/Badge";
import { useIsOnline } from "../../hooks/useIsOnline";

export const StatusBadge = ({ noProvider }: { noProvider?: boolean }) => {
  const isOnline = useIsOnline();

  if (noProvider) {
    return (
      <Badge small as="span" noIcon severity="info">
        Beta
      </Badge>
    );
  }

  return (
    <Badge small as="span" noIcon severity={isOnline ? "success" : "error"}>
      {isOnline ? "En ligne" : "Hors ligne"}
    </Badge>
  );
};
