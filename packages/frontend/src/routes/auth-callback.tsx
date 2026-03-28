import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { unauthenticatedApi, type RouterOutputs } from "../api";
import { useAuthContext } from "../contexts/AuthContext";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";

const AuthCallbackPage = () => {
  const { code, state } = Route.useSearch();
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  console.log(code, state);
  useEffect(() => {
    const storedState = sessionStorage.getItem("proconnect_state");
    const nonce = sessionStorage.getItem("proconnect_nonce");

    if (!code || !nonce || state !== storedState) {
      navigate({ to: "/connexion" });
      return;
    }

    sessionStorage.removeItem("proconnect_state");
    sessionStorage.removeItem("proconnect_nonce");

    unauthenticatedApi
      .post("/api/authenticate", { body: { code, nonce } })
      .then((resp: RouterOutputs<"/api/authenticate">) => {
        setAuth({
          accessToken: resp.accessToken,
          refreshToken: resp.refreshToken,
          expiresAt: resp.expiresAt,
          user: resp.user,
        });
        navigate({ to: "/" });
      })
      .catch(() => {
        navigate({ to: "/connexion" });
      });
  }, []);

  return (
    <Center height="100%">
      <Spinner />
    </Center>
  );
};

export const Route = createFileRoute("/auth-callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) ?? "",
    state: (search.state as string) ?? "",
  }),
  component: AuthCallbackPage,
});
