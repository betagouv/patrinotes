import { Button } from "#components/MUIDsfr.tsx";
import { ConfirmationModal } from "#components/ui/ConfirmationModal.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Dialog, DialogTitle } from "@mui/material";
import { useSyncExternalStore } from "react";
import { menuActor } from "../menu/menuMachine";
import { getPendingLocalChanges, PendingLocalChanges, resetLocalData } from "../menu/resetLocalData";
import { apiStore } from "../../ApiStore";
import { unauthenticatedApi } from "../../api";

/**
 * Logging out empties the device, like "Réinitialiser les données locales" in the help menu: the next person
 * using it must not find the agent's documents, photos or session.
 *
 * Changes and photos not sent yet would be lost: the agent is warned first, and offline (where they cannot
 * be sent before leaving) the logout is refused.
 */
type LogoutState =
  | { step: "idle" }
  | { step: "checking" }
  | { step: "confirm"; pending: PendingLocalChanges }
  | { step: "offline" }
  | { step: "logging-out" };

let state: LogoutState = { step: "idle" };
const listeners = new Set<() => void>();
const setState = (next: LogoutState) => {
  state = next;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const requestLogout = async () => {
  if (state.step !== "idle") return;
  menuActor.send({ type: "CLOSE" });
  setState({ step: "checking" });

  const pending = await getPendingLocalChanges();
  const hasPending = pending.changes > 0 || pending.attachments > 0;

  if (!hasPending) return logout();
  if (!navigator.onLine) return setState({ step: "offline" });
  setState({ step: "confirm", pending });
};

const logout = async () => {
  setState({ step: "logging-out" });
  await revokeSession();
  // Offline caches hold the app code only: keeping them lets the sign-in page load without network.
  await resetLocalData({ redirectTo: "/connexion", keepAppCache: true });
};

/**
 * Asks the server to revoke the offline token at Keycloak, so a copy left on the device is useless. Never blocks the
 * logout: skipped offline, errors ignored, and the device is emptied after 3 seconds at most.
 */
const revokeSession = async () => {
  const refreshToken = apiStore.refreshToken;
  if (!refreshToken || !navigator.onLine) return;
  await Promise.race([
    unauthenticatedApi.post("/api/logout", { body: { refreshToken } }).catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
};

export const LogoutDialogs = () => {
  const current = useSyncExternalStore(subscribe, () => state);

  if (current.step === "confirm") {
    return (
      <ConfirmationModal
        title="Se déconnecter ?"
        cancelLabel="Attendre"
        buttonLabel="Se déconnecter quand même"
        onClose={() => setState({ step: "idle" })}
        onConfirm={() => logout()}
        content={<>{pendingMessage(current.pending)}</>}
      />
    );
  }

  if (current.step === "offline") {
    return (
      <Dialog
        open
        onClose={() => setState({ step: "idle" })}
        disablePortal
        sx={{ ".MuiPaper-root": { maxWidth: { xs: "100%", sm: "600px" }, width: "600px" }, zIndex: 1400 }}
      >
        <Box p="16px" width="100%">
          <DialogTitle>Déconnexion impossible</DialogTitle>
          <Box p="8px 24px 24px 24px">
            Vous êtes hors ligne et des modifications ne sont pas encore envoyées. Reconnectez-vous à Internet avant de
            vous déconnecter.
          </Box>
          <Flex justifyContent="flex-end" gap="16px" px="24px" pb="16px">
            <Button type="button" onClick={() => setState({ step: "idle" })}>
              Fermer
            </Button>
          </Flex>
        </Box>
      </Dialog>
    );
  }

  return null;
};

const pendingMessage = ({ changes, attachments }: PendingLocalChanges) => {
  const total = changes + attachments;
  const parts = [
    changes > 0 ? `${changes} modification${changes > 1 ? "s" : ""}` : null,
    attachments > 0 ? `${attachments} photo${attachments > 1 ? "s" : ""}` : null,
  ].filter(Boolean);
  return total > 1
    ? `${parts.join(" et ")} ne sont pas encore envoyées. Si vous vous déconnectez maintenant, elles seront définitivement perdues.`
    : `${parts.join(" et ")} n'est pas encore envoyée. Si vous vous déconnectez maintenant, elle sera définitivement perdue.`;
};
