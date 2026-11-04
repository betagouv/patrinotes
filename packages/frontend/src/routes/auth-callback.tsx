import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Typography } from "@mui/material";
import { Alert, Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { getErrorMessage, unauthenticatedApi } from "../api";
import { consumeProConnectState, useApplySignInResult } from "../features/auth/signIn";

type CallbackSearch = {
  // ProConnect
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
  // magic link
  magic?: string;
};

/** Return URL of ProConnect (redirect_uri) and target of the sign-in links sent by email. */
const AuthCallbackPage = () => {
  const search = Route.useSearch();
  const applySignInResult = useApplySignInResult();
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // the code / link is single use: never send it twice (StrictMode double effect)
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      if (search.magic) {
        return unauthenticatedApi.post("/api/auth/magic-link/verify", { body: { token: search.magic } });
      }

      if (search.error) {
        throw new Error(search.error_description || "La connexion avec ProConnect a été interrompue");
      }

      if (search.code && search.state) {
        if (!consumeProConnectState(search.state)) {
          throw new Error("La demande de connexion n'a pas été initiée depuis ce navigateur, veuillez réessayer");
        }
        return unauthenticatedApi.post("/api/auth/proconnect/callback", {
          body: { code: search.code, state: search.state },
        });
      }

      throw new Error("Lien de connexion invalide");
    };

    run()
      .then(applySignInResult)
      .catch((e) => setError(e?.data?.error ? getErrorMessage(e) : e?.message ?? getErrorMessage(e)));
  }, []);

  return (
    <Center mt="40px">
      <Flex flexDirection="column" width="600px" maxWidth="100%" p="16px" gap="24px">
        {error ? (
          <>
            <Alert severity="error" title={<Typography fontWeight="regular">{error}</Typography>} />
            <Link to="/connexion" className="fr-link">
              Retour à la page de connexion
            </Link>
          </>
        ) : (
          <Center flexDirection="column" gap="16px">
            <Spinner />
            <Typography>Connexion en cours…</Typography>
          </Center>
        )}
      </Flex>
    </Center>
  );
};

export const Route = createFileRoute("/auth-callback")({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => {
    const pick = (key: string) => (typeof search[key] === "string" ? (search[key] as string) : undefined);
    return {
      code: pick("code"),
      state: pick("state"),
      error: pick("error"),
      error_description: pick("error_description"),
      magic: pick("magic"),
    };
  },
  component: AuthCallbackPage,
});
