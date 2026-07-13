import { Alert } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { menuActor } from "../menu/menuMachine";

export const NoReportAlert = ({ show }: { show: boolean }) => {
  const [isNoReportAlertClosed, setIsNoReportAlertClosed] = useLocalStorageState("crvif/no-report-alert-closed", false);
  const userCreatedAtQuery = useQuery({
    queryKey: ["user-created-at"],
    queryFn: () => api.get("/api/created-at"),
  });
  const userCreatedAt = userCreatedAtQuery.data?.createdAt;
  const isOldEnoughUser = !!userCreatedAt && new Date(userCreatedAt) <= new Date("2026-05-01T00:00:00.000Z");
  const showNoReportAlert = show && isOldEnoughUser && !isNoReportAlertClosed;

  if (!showNoReportAlert) return null;

  return (
    <Flex mb="40px" flex="1" alignSelf="center" maxWidth={{ xs: "100%", lg: "calc(800px + 126px)" }} width="100%">
      <Alert
        closable
        onClose={() => setIsNoReportAlertClosed(true)}
        small
        severity="info"
        description={
          <span>
            Vous ne voyez pas vos documents ? Essayez de réinitialiser les données locales via le menu{" "}
            <a
              style={{ color: fr.colors.decisions.text.active.blueFrance.default }}
              href="#"
              onClick={() =>
                menuActor.send({
                  type: "GO_TO_HELP",
                })
              }
            >
              aide
            </a>
          </span>
        }
      />
    </Flex>
  );
};
