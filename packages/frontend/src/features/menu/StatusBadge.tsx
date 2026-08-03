import Badge from "@codegouvfr/react-dsfr/Badge";
import { useEffect, useState } from "react";

const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return isOnline;
};

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
