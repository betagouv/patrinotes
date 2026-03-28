import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, unauthenticatedApi, type RouterOutputs } from "../api";
import { useAuthContext } from "../contexts/AuthContext";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Autocomplete, Box, Dialog, DialogTitle } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { useStyles } from "tss-react";
import { useSetService } from "../contexts/AuthContext";
import { AuthUser } from "../api";

const AuthCallbackPage = () => {
  const { code, state } = Route.useSearch();
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();
  const [showServicePicker, setShowServicePicker] = useState(false);

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
      .post("/api/authenticate", { body: { code, nonce, redirectUri: `${window.location.origin}/auth-callback` } })
      .then((resp: RouterOutputs<"/api/authenticate">) => {
        setAuth({
          accessToken: resp.accessToken,
          refreshToken: resp.refreshToken,
          expiresAt: resp.expiresAt,
          user: resp.user,
        });
        if (resp.isNewUser) {
          setShowServicePicker(true);
        } else {
          navigate({ to: "/" });
        }
      })
      .catch(() => {
        navigate({ to: "/connexion" });
      });
  }, []);

  if (showServicePicker) {
    return <ServicePickerModal onDone={() => navigate({ to: "/" })} />;
  }

  return (
    <Center height="100%">
      <Spinner />
    </Center>
  );
};

const ServicePickerModal = ({ onDone }: { onDone: () => void }) => {
  const { cx } = useStyles();
  const [value, setValue] = useState<string | null>(null);
  const setService = useSetService();

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: () => unauthenticatedApi.get("/api/services"),
  });
  const services = servicesQuery.data ?? [];

  const selectServiceMutation = useMutation({
    mutationFn: async (service_id: string) => {
      const targetService = services.find((s) => s.id === service_id) as AuthUser["service"];
      if (!targetService) throw new Error("Service introuvable");
      await api.post("/api/change-service", { body: { service_id } });
      setService(targetService);
    },
    onSuccess: onDone,
  });

  return (
    <Center height="100%">
      <Dialog open sx={{ ".MuiPaper-root": { overflowY: "visible" } }}>
        <Box p={4} width={400}>
          <DialogTitle>Sélectionnez votre service</DialogTitle>
          <Autocomplete
            disablePortal
            options={services}
            getOptionLabel={(item) => (item.name as string) || ""}
            value={value ? services.find((s) => s.id === value) ?? null : null}
            onChange={(_e, item) => setValue(item?.id ?? null)}
            renderInput={(params) => (
              <div className="fr-input-group">
                <Box ref={params.InputProps.ref} mt="8px">
                  <input
                    {...params.inputProps}
                    className={cx(params.inputProps.className, "fr-input")}
                    placeholder="Sélectionner votre service"
                    type="text"
                  />
                </Box>
              </div>
            )}
            noOptionsText="Aucun résultat"
          />
          <Flex justifyContent="flex-end" mt="16px">
            <Button
              onClick={() => value && selectServiceMutation.mutate(value)}
              disabled={!value || selectServiceMutation.isPending}
            >
              Valider
            </Button>
          </Flex>
        </Box>
      </Dialog>
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
