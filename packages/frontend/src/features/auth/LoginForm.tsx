import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { InputGroup } from "#components/InputGroup.tsx";
import { PasswordInput } from "#components/PasswordInput.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { unauthenticatedApi, getErrorMessage, RouterInputs, AuthUser } from "../../api";
import { useAuthContext } from "../../contexts/AuthContext";
import { Alert, Input } from "#components/MUIDsfr.tsx";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";

export const LoginForm = () => {
  const { auth, setAuth } = useAuthContext();
  const form = useForm<LoginFormProps>();

  const mutation = useMutation({
    mutationFn: (body: LoginFormProps) => unauthenticatedApi.post("/api/login-user", { body }),
  });

  const navigate = useNavigate();

  const login = async (values: LoginFormProps) => {
    const response = await mutation.mutateAsync(values);
    localStorage.setItem("crvif/version", "1");
    localStorage.removeItem("crvif/update-popup");
    setAuth(response as any);

    navigate({ to: "/", search: { document: "constats" } });
  };

  const { error: mutationError } = mutation;
  const { errors: formErrors } = form.formState;

  return (
    <Flex flexDirection={{ xs: "column", lg: "row" }} gap="16px">
      <form onSubmit={form.handleSubmit(login)} style={{ flex: 1 }}>
        {mutationError ? (
          <Alert
            sx={{ mb: "1.5rem" }}
            severity="error"
            title={<Typography fontWeight="regular">{getErrorMessage(mutationError)}</Typography>}
          />
        ) : null}

        <InputGroup state={mutationError ? "error" : undefined}>
          <Input
            label="Courriel"
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
          <PasswordInput
            state={formErrors?.password ? "error" : undefined}
            nativeInputProps={{
              autoComplete: "current-password",
              ...form.register("password", {
                required: "Le mot de passe est requis",
                minLength: {
                  value: 8,
                  message: "Le mot de passe doit contenir au moins 8 caractères",
                },
              }),
            }}
          />
        </InputGroup>

        <Box color={fr.colors.decisions.text.actionHigh.blueFrance.default}>
          <Link
            className="fr-link"
            style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
            to="/reset-password"
          >
            Mot de passe oublié
          </Link>
        </Box>

        <FullWidthButton
          style={{
            marginTop: "1.5rem",
          }}
          type="submit"
          nativeButtonProps={{ type: "submit" }}
          onClick={form.handleSubmit(login)}
          disabled={mutation.isPending}
        >
          Se connecter
        </FullWidthButton>
      </form>

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
          Pour accéder au service, vous devez d'abord vous inscrire en renseignant vos informations :
        </Typography>

        <FullWidthButton linkProps={{ to: "/inscription" }} priority="secondary">
          Créer un compte
        </FullWidthButton>

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

export type LoginFormProps = RouterInputs<"/api/login-user">["body"];
