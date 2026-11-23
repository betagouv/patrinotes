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
import { PDFViewerPaginated } from "#components/PDFViewerPaginated";
import { fr } from "@codegouvfr/react-dsfr";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { useState } from "react";
import { downloadFile } from "../utils";
import { format } from "date-fns";

export const Route = createFileRoute("/constat-validation/$token")({
  component: ConstatValidationPage,
});

type DecisionForm = { comment: string };

function ConstatValidationPage() {
  const { token } = Route.useParams();
  const pdfUrl = `${ENV.VITE_BACKEND_URL}/api/constat-validation/${token}/pdf`;

  const [selectedOption, setSelectedOption] = useState<"accept" | "decline" | null>(null);
  const query = useQuery({
    queryKey: ["constat-validation", token],
    queryFn: () =>
      ofetch<{
        // only while the decision is pending
        stateReport?: { id: string; titre_edifice: string | null; commune: string | null; date_visite: string | null };
        pdfUrl?: string;
        status: string;
        decidedAt?: string | null;
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

  if (query.isPending) {
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
            {status === 410 ? "Ce lien de validation a expiré." : "Ce lien est introuvable ou a déjà été traité."}
          </Typography>
        </Stack>
      </Center>
    );
  }

  const submittedComment = form.getValues("comment");

  if (acceptMutation.isSuccess) {
    return (
      <Center mt="40px">
        <Stack maxWidth="600px" textAlign="center" gap="16px">
          <Typography variant="h4">Constat accepté</Typography>
          <Typography>Ce constat a été accepté et envoyé aux destinataires.</Typography>
          {submittedComment && <Typography>Commentaire : {submittedComment}</Typography>}
        </Stack>
      </Center>
    );
  }

  if (declineMutation.isSuccess) {
    return (
      <Center mt="40px">
        <Stack maxWidth="600px" textAlign="center" gap="16px">
          <Typography variant="h4">Constat refusé</Typography>
          {submittedComment && <Typography>Commentaire : {submittedComment}</Typography>}
        </Stack>
      </Center>
    );
  }

  const { status, decidedAt } = query.data!;

  // Already decided: the link no longer shows the constat nor its PDF (SEC-08), only the decision and its date.
  if (status === "accepted" || status === "declined") {
    const decision = status === "accepted" ? "accepté" : "refusé";
    const date = decidedAt ? ` le ${format(new Date(decidedAt), "dd/MM/yyyy")}` : "";
    return (
      <Center mt="40px">
        <Stack maxWidth="600px" textAlign="center" gap="16px">
          <Typography variant="h4">{status === "accepted" ? "Constat accepté" : "Constat refusé"}</Typography>
          <Typography>{`Ce constat a déjà été ${decision}${date}.`}</Typography>
        </Stack>
      </Center>
    );
  }

  const isPending = acceptMutation.isPending || declineMutation.isPending;

  const isCommentRequired = selectedOption === "decline";

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Center bgcolor="#E3E3FD" width="100%">
        <Flex
          width={{ xs: "100%", lg: "1200px" }}
          px="16px"
          pt="32px"
          pb="8px"
          justifyContent="space-between"
          gap="24px"
        >
          <Flex flexDirection="column" flex="1">
            <Typography component="h2" fontSize="20px" fontWeight="bold" alignSelf="flex-start">
              Validation du constat d'état
            </Typography>

            <Typography alignSelf="flex-start" mt="24px">
              Souhaitez-vous valider l'envoi du document ci-dessous au propriétaire du monument historique ?{" "}
            </Typography>

            <RadioButtons
              style={{ marginTop: "24px" }}
              options={[
                {
                  label: "Oui, envoyer le constat",
                  nativeInputProps: {
                    checked: selectedOption === "accept",
                    onChange: () => setSelectedOption("accept"),
                  },
                },
                {
                  label: "Non, ne pas envoyer le constat",
                  nativeInputProps: {
                    checked: selectedOption === "decline",
                    onChange: () => setSelectedOption("decline"),
                  },
                },
              ]}
            />

            {isCommentRequired ? (
              <Box>
                <Input textArea label="Commentaires" nativeTextAreaProps={{ ...form.register("comment"), rows: 5 }} />
              </Box>
            ) : null}
          </Flex>
          <Flex
            mt="48px"
            flexDirection="column"
            alignItems="center"
            gap="16px"
            sx={{ "& button": { display: "flex", width: "100%", justifyContent: "center" } }}
          >
            <Button
              size="large"
              disabled={isPending || !selectedOption}
              onClick={form.handleSubmit((data) => {
                if (selectedOption === "accept") {
                  acceptMutation.mutate(data);
                } else if (selectedOption === "decline") {
                  declineMutation.mutate(data);
                }
              })}
            >
              Terminer
            </Button>

            {(acceptMutation.isError || declineMutation.isError) && (
              <Typography color="error">Une erreur est survenue. Veuillez réessayer.</Typography>
            )}
            <Button size="large" priority="secondary" iconId="ri-download-line" onClick={() => downloadFile(pdfUrl)}>
              Télécharger le document
            </Button>
          </Flex>
        </Flex>
      </Center>
      <Flex
        flexDirection="column"
        alignItems="center"
        width={{ xs: "100%", lg: "700px" }}
        p={{ xs: "16px", lg: "32px" }}
        gap="16px"
      >
        <Box width="100%">
          <PDFViewerPaginated url={pdfUrl} />
        </Box>
      </Flex>
    </Box>
  );
}
