import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { ENV } from "../envVars";
import { Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Stack, Typography } from "@mui/material";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { useForm } from "react-hook-form";
import { Spinner } from "#components/Spinner.tsx";

export const Route = createFileRoute("/constat-validation/$token")({
  component: ConstatValidationPage,
});

type DecisionForm = { comment: string };

function ConstatValidationPage() {
  const { token } = Route.useParams();

  const query = useQuery({
    queryKey: ["constat-validation", token],
    queryFn: () =>
      ofetch<{
        stateReport: { id: string; titre_edifice: string | null; commune: string | null; date_visite: string | null };
        pdfUrl: string;
        status: string;
        comment: string | null;
      }>(`${ENV.VITE_BACKEND_URL}/api/constat-validation/${token}`),
    retry: false,
  });

  const form = useForm<DecisionForm>({ defaultValues: { comment: "" } });

  const acceptMutation = useMutation({
    mutationFn: (data: DecisionForm) =>
      ofetch(`${ENV.VITE_BACKEND_URL}/api/constat-validation/${token}/accept`, {
        method: "POST",
        body: { comment: data.comment || undefined },
      }),
    onSuccess: () => query.refetch(),
  });

  const declineMutation = useMutation({
    mutationFn: (data: DecisionForm) =>
      ofetch(`${ENV.VITE_BACKEND_URL}/api/constat-validation/${token}/decline`, {
        method: "POST",
        body: { comment: data.comment },
      }),
    onSuccess: () => query.refetch(),
  });

  if (query.isLoading) {
    return (
      <Center mt="40px">
        <Spinner size={80} />
      </Center>
    );
  }

  if (query.isError) {
    const status = (query.error as any)?.response?.status ?? (query.error as any)?.status;
    return (
      <Center mt="40px">
        <Stack maxWidth="600px" textAlign="center" gap="16px">
          <Typography variant="h4">Lien de validation invalide</Typography>
          <Typography>
            {status === 410
              ? "Ce lien de validation a expiré."
              : "Ce lien est introuvable ou a déjà été traité."}
          </Typography>
        </Stack>
      </Center>
    );
  }

  const { stateReport, pdfUrl, status, comment } = query.data!;
  const title = stateReport.titre_edifice ?? "Constat d'état";

  if (status === "accepted") {
    return (
      <Center mt="40px">
        <Stack maxWidth="600px" textAlign="center" gap="16px">
          <Typography variant="h4">Constat accepté</Typography>
          <Typography>Ce constat a été accepté et envoyé aux destinataires.</Typography>
          {comment && <Typography>Commentaire : {comment}</Typography>}
        </Stack>
      </Center>
    );
  }

  if (status === "declined") {
    return (
      <Center mt="40px">
        <Stack maxWidth="600px" textAlign="center" gap="16px">
          <Typography variant="h4">Constat refusé</Typography>
          {comment && <Typography>Commentaire : {comment}</Typography>}
        </Stack>
      </Center>
    );
  }

  const isPending = acceptMutation.isPending || declineMutation.isPending;

  return (
    <Flex flexDirection="column" alignItems="center" p={{ xs: "16px", lg: "32px" }} gap="24px">
      <Typography variant="h4" alignSelf="flex-start">
        Validation du constat d'état : {title}
      </Typography>
      {stateReport.commune && (
        <Typography alignSelf="flex-start" color="text.secondary">
          {stateReport.commune}
        </Typography>
      )}

      <Box width="100%" height={{ xs: "60vh", lg: "75vh" }} border="1px solid #ccc">
        <iframe src={pdfUrl} width="100%" height="100%" title="Constat d'état" />
      </Box>

      <Stack width="100%" maxWidth="690px" gap="16px">
        <Input
          label="Commentaire (facultatif pour l'acceptation, obligatoire pour le refus)"
          nativeInputProps={{ ...form.register("comment") }}
          sx={{ mb: "8px" }}
        />

        {(acceptMutation.isError || declineMutation.isError) && (
          <Typography color="error">
            Une erreur est survenue. Veuillez réessayer.
          </Typography>
        )}

        <Flex gap="16px" justifyContent="flex-end">
          <Button
            type="button"
            priority="secondary"
            onClick={form.handleSubmit((data) => declineMutation.mutate(data))}
            disabled={isPending}
          >
            Refuser
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit((data) => acceptMutation.mutate(data))}
            disabled={isPending}
          >
            Accepter
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
}
