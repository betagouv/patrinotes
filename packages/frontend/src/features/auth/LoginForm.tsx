import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton";
import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { InputGroup } from "#components/InputGroup.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { unauthenticatedApi, getErrorMessage } from "../../api";
import { Alert, Input } from "#components/MUIDsfr.tsx";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { startProConnectSignIn, useApplySignInResult } from "./signIn";

export const LoginForm = () => {
  const [email, setEmail] = useState<string | null>(null);

  const configQuery = useQuery({
    queryKey: ["auth-config"],
    queryFn: () => unauthenticatedApi.get("/api/auth/config"),
    staleTime: Infinity,
  });

  const proConnectMutation = useMutation({ mutationFn: startProConnectSignIn });

  return (
    <Flex flexDirection={{ xs: "column", lg: "row" }} gap="16px">
      <Box flex={1}>
        {configQuery.data?.proconnect ? (
          <>
            {proConnectMutation.error ? (
              <Alert
                sx={{ mb: "1.5rem" }}
                severity="error"
                title={<Typography fontWeight="regular">{getErrorMessage(proConnectMutation.error)}</Typography>}
              />
            ) : null}
            <Typography fontSize="14px" mb="16px">
              Connectez-vous avec votre compte professionnel :
            </Typography>
            <ProConnectButton onClick={() => proConnectMutation.mutate()} />

            <Divider sx={{ my: "32px", fontSize: "14px", color: fr.colors.decisions.text.mention.grey.default }}>
              ou
            </Divider>
          </>
        ) : null}

        {email ? <CodeStep email={email} onChangeEmail={() => setEmail(null)} /> : <EmailStep onSent={setEmail} />}
      </Box>

      <Divider
        orientation="vertical"
        sx={{ height: "316px", alignSelf: "center", mx: "40px", display: { xs: "none", lg: "block" } }}
      />

      <Stack
        mt={{ xs: "46px", lg: "0px" }}
        bgcolor={fr.colors.decisions.background.default.grey.hover}
        p={{ xs: "32px 16px", lg: "40px" }}
        gap="24px"
        width={{ xs: "calc(100% + 32px)", lg: "429px" }}
        mx={{ xs: "-16px", lg: "0px" }}
      >
        <Typography component="h5" fontWeight="bold" fontSize="22px">
          Première connexion ?
        </Typography>

        <Typography fontSize="14px">
          Connectez-vous de la même façon : votre compte est créé lors de votre première connexion, une fois votre
          fonction et votre service renseignés.
        </Typography>

        <Typography fontSize="14px">
          Besoin d'aide ? Contactez l'équipe à{" "}
          <Typography
            component="span"
            className="fr-link"
            onClick={() => {
              navigator.clipboard.writeText("contact@patrinotes.beta.gouv.fr");
            }}
            fontSize="14px"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline" },
            }}
            color="text-active-blue-france"
          >
            contact@patrinotes.beta.gouv.fr
          </Typography>
        </Typography>
      </Stack>
    </Flex>
  );
};

const EmailStep = ({ onSent }: { onSent: (email: string) => void }) => {
  const form = useForm<{ email: string }>();

  const mutation = useMutation({
    mutationFn: (body: { email: string }) => unauthenticatedApi.post("/api/auth/magic-link", { body }),
    onSuccess: (_, body) => onSent(body.email.trim()),
  });

  const { errors: formErrors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      {mutation.error ? (
        <Alert
          sx={{ mb: "1.5rem" }}
          severity="error"
          title={<Typography fontWeight="regular">{getErrorMessage(mutation.error)}</Typography>}
        />
      ) : null}

      <Typography fontSize="14px" mb="16px">
        Recevez par courriel un lien et un code de connexion :
      </Typography>

      <InputGroup state={mutation.error ? "error" : undefined}>
        <Input
          label="Courriel professionnel"
          hintText="prenom.nom@culture.gouv.fr"
          nativeInputProps={{
            type: "email",
            autoComplete: "username",
            ...form.register("email", {
              required: "Le courriel est requis",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Le courriel n'est pas valide",
              },
            }),
          }}
          state={formErrors.email ? "error" : undefined}
          stateRelatedMessage={formErrors.email?.message as string}
        />
      </InputGroup>

      <FullWidthButton
        style={{ marginTop: "1.5rem" }}
        size="large"
        type="submit"
        nativeButtonProps={{ type: "submit" }}
        disabled={mutation.isPending}
      >
        Recevoir un lien de connexion
      </FullWidthButton>
    </form>
  );
};

const CodeStep = ({ email, onChangeEmail }: { email: string; onChangeEmail: () => void }) => {
  const form = useForm<{ code: string }>();
  const applySignInResult = useApplySignInResult();

  const verifyMutation = useMutation({
    mutationFn: (code: string) => unauthenticatedApi.post("/api/auth/magic-link/verify", { body: { email, code } }),
    onSuccess: applySignInResult,
  });

  const resendMutation = useMutation({
    mutationFn: () => unauthenticatedApi.post("/api/auth/magic-link", { body: { email } }),
  });

  const error = verifyMutation.error ?? resendMutation.error;
  const { errors: formErrors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit((values) => verifyMutation.mutate(values.code))}>
      {error ? (
        <Alert
          sx={{ mb: "1.5rem" }}
          severity="error"
          title={<Typography fontWeight="regular">{getErrorMessage(error)}</Typography>}
        />
      ) : resendMutation.isSuccess ? (
        <Alert
          sx={{ mb: "1.5rem" }}
          severity="success"
          title={<Typography fontWeight="regular">Un nouveau courriel vous a été envoyé.</Typography>}
        />
      ) : null}

      <Typography fontSize="14px" mb="16px">
        Un courriel a été envoyé à <strong>{email}</strong>. Cliquez sur le lien qu'il contient, ou saisissez ici le
        code à 6 chiffres. Il est valable 15 minutes.
      </Typography>

      <InputGroup state={verifyMutation.error ? "error" : undefined}>
        <Input
          label="Code de connexion"
          nativeInputProps={{
            inputMode: "numeric",
            autoComplete: "one-time-code",
            autoFocus: true,
            maxLength: 7,
            ...form.register("code", {
              required: "Le code est requis",
              pattern: { value: /^\s*\d{3}\s?\d{3}\s*$/, message: "Le code contient 6 chiffres" },
            }),
          }}
          state={formErrors.code ? "error" : undefined}
          stateRelatedMessage={formErrors.code?.message as string}
        />
      </InputGroup>

      <FullWidthButton
        style={{ marginTop: "1.5rem" }}
        size="large"
        type="submit"
        nativeButtonProps={{ type: "submit" }}
        disabled={verifyMutation.isPending}
      >
        Se connecter
      </FullWidthButton>

      <Flex gap="24px" mt="16px" flexWrap="wrap">
        <button
          type="button"
          className="fr-link"
          disabled={resendMutation.isPending}
          onClick={() => resendMutation.mutate()}
        >
          Renvoyer un code
        </button>
        <button type="button" className="fr-link" onClick={onChangeEmail}>
          Changer de courriel
        </button>
      </Flex>
    </form>
  );
};
