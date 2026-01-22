import { SimpleBanner } from "#components/Banner.tsx";
import { Button, Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Spinner } from "#components/Spinner";
import { Box, Stack, Typography, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api";
import { fr } from "@codegouvfr/react-dsfr";
import sentImage from "../assets/sent.svg";

export const Route = createFileRoute("/validation/$link")({
  component: ValidationPage,
});

function ValidationPage() {
  const { link } = Route.useParams();
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const validationQuery = useQuery({
    queryKey: ["validation", link],
    queryFn: async () => {
      const response = await fetch(`/api/validation/${link}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Une erreur est survenue");
      }
      return response.json();
    },
    retry: false,
  });

  const submitDecisionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/validation/${link}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved: decision === "approved",
          comment: decision === "rejected" ? comment : undefined,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Une erreur est survenue");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      setSubmitResult(data);
    },
  });

  const downloadPdfMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/validation/${link}/pdf`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Une erreur est survenue");
      }
      const base64 = await response.text();
      // Convert base64 to blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `constat_${validationQuery.data?.stateReport?.titre_edifice || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  if (validationQuery.isLoading) {
    return (
      <Center height="100vh">
        <Spinner size={100} />
      </Center>
    );
  }

  if (validationQuery.isError) {
    return (
      <Center height="100vh" flexDirection="column" gap="16px" p="24px">
        <Box
          className="fr-icon-error-warning-fill"
          sx={{ fontSize: "64px", color: fr.colors.decisions.text.actionHigh.redMarianne.default }}
        />
        <Typography variant="h4" textAlign="center">
          {(validationQuery.error as Error).message}
        </Typography>
      </Center>
    );
  }

  if (isSubmitted) {
    return (
      <Center height="100vh" flexDirection="column" p="24px">
        <Box component="img" src={sentImage} alt="Terminé" width={{ xs: "80px", lg: "120px" }} />
        <Typography variant="h4" mt="24px" textAlign="center" color="text-title-blue-france">
          {decision === "approved" ? "Constat validé" : "Constat refusé"}
        </Typography>
        <Typography mt="16px" textAlign="center" maxWidth="500px">
          {submitResult?.message || (decision === "approved"
            ? "Le constat a été validé et envoyé aux destinataires."
            : "Le constat a été refusé. L'utilisateur a été notifié.")}
        </Typography>
      </Center>
    );
  }

  const data = validationQuery.data;
  const dateVisite = data?.stateReport?.date_visite
    ? new Date(data.stateReport.date_visite).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Non spécifiée";

  return (
    <Stack height="100vh">
      <SimpleBanner minHeight="auto" py="16px">
        <Flex
          alignItems="center"
          maxWidth="1200px"
          width="100%"
          flexDirection={{ xs: "column", lg: "row" }}
          gap={{ xs: "8px", lg: "24px" }}
          px="16px"
        >
          <Typography fontWeight="bold" flex="1">
            Demande de validation de constat d'état
          </Typography>
        </Flex>
      </SimpleBanner>

      <Box flex="1" overflow="auto" p={{ xs: "16px", lg: "32px" }} bgcolor="#f5f5f5">
        <Center>
          <Stack maxWidth="800px" width="100%" gap="24px">
            {/* Info card */}
            <Box bgcolor="white" p="24px" borderRadius="8px" boxShadow="0 2px 8px rgba(0,0,0,0.1)">
              <Typography variant="h5" mb="16px" fontWeight="bold">
                Informations du constat
              </Typography>
              <Stack gap="8px">
                <Flex gap="8px">
                  <Typography fontWeight="bold" minWidth="140px">Demandé par :</Typography>
                  <Typography>{data?.user?.name}</Typography>
                </Flex>
                <Flex gap="8px">
                  <Typography fontWeight="bold" minWidth="140px">Édifice :</Typography>
                  <Typography>{data?.stateReport?.titre_edifice || "Non spécifié"}</Typography>
                </Flex>
                <Flex gap="8px">
                  <Typography fontWeight="bold" minWidth="140px">Commune :</Typography>
                  <Typography>{data?.stateReport?.commune || "Non spécifiée"}</Typography>
                </Flex>
                <Flex gap="8px">
                  <Typography fontWeight="bold" minWidth="140px">Date de visite :</Typography>
                  <Typography>{dateVisite}</Typography>
                </Flex>
              </Stack>

              <Box mt="24px">
                <Button
                  type="button"
                  priority="secondary"
                  iconId="ri-download-line"
                  onClick={() => downloadPdfMutation.mutate()}
                  disabled={downloadPdfMutation.isPending}
                >
                  {downloadPdfMutation.isPending ? "Téléchargement..." : "Télécharger le document"}
                </Button>
              </Box>
            </Box>

            {/* Decision card */}
            <Box bgcolor="white" p="24px" borderRadius="8px" boxShadow="0 2px 8px rgba(0,0,0,0.1)">
              <Typography variant="h5" mb="16px" fontWeight="bold">
                Votre décision
              </Typography>
              <Typography mb="16px">
                Validez-vous ce constat d'état pour envoi aux destinataires ?
              </Typography>

              <RadioGroup
                value={decision || ""}
                onChange={(e) => setDecision(e.target.value as "approved" | "rejected")}
              >
                <FormControlLabel
                  value="approved"
                  control={<Radio />}
                  label="Oui, je valide ce constat"
                />
                <FormControlLabel
                  value="rejected"
                  control={<Radio />}
                  label="Non, je refuse ce constat"
                />
              </RadioGroup>

              {decision === "rejected" && (
                <Box mt="16px">
                  <TextField
                    label="Commentaires (optionnel)"
                    multiline
                    rows={4}
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Expliquez les raisons du refus ou les modifications à apporter..."
                    variant="outlined"
                  />
                </Box>
              )}

              <Flex mt="24px" gap="16px" justifyContent="flex-end">
                <Button
                  type="button"
                  onClick={() => submitDecisionMutation.mutate()}
                  disabled={!decision || submitDecisionMutation.isPending}
                >
                  {submitDecisionMutation.isPending ? "Envoi en cours..." : "Terminer"}
                </Button>
              </Flex>

              {submitDecisionMutation.isError && (
                <Typography color="error" mt="16px">
                  Erreur: {(submitDecisionMutation.error as Error).message}
                </Typography>
              )}
            </Box>
          </Stack>
        </Center>
      </Box>
    </Stack>
  );
}
