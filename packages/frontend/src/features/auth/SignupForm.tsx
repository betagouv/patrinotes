import { type UseFormReturn, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Flex } from "#components/ui/Flex.tsx";
import { getErrorMessage, unauthenticatedApi } from "../../api";
import { Alert, Button, Checkbox, Input, Select } from "#components/MUIDsfr.tsx";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Divider } from "#components/ui/Divider.tsx";
import { InputGroup } from "#components/InputGroup.tsx";
import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { Link, Navigate } from "@tanstack/react-router";
import { scrollToTop } from "../state-report/StateReportSummary";
import { fr } from "@codegouvfr/react-dsfr";
import { JobSelect } from "../../routes/compte";
import { InfoText } from "#components/ui/InfoText.tsx";
import { getPendingSignup, PendingSignup, useApplySignInResult } from "./signIn";

/**
 * First sign-in: the identity was verified by ProConnect or by email, the agent completes their profile.
 */
export const SignupForm = () => {
  const pending = getPendingSignup();
  if (!pending) return <Navigate to="/connexion" replace />;
  return <ProfileForm pending={pending} />;
};

const ProfileForm = ({ pending }: { pending: PendingSignup }) => {
  const form = useForm<SignupFormProps>({
    defaultValues: {
      prenom: pending.givenName ?? "",
      nom: pending.usualName ?? "",
      service_id: "",
      newsletter: false,
      job: "",
      cgu: false,
    },
  });

  const applySignInResult = useApplySignInResult();

  const mutation = useMutation({
    mutationFn: (values: SignupFormProps) =>
      unauthenticatedApi.post("/api/auth/signup", {
        body: {
          signupToken: pending.signupToken,
          name: `${values.prenom.trim()} ${values.nom.trim()}`,
          job: values.job,
          service_id: values.service_id,
          newsletter: values.newsletter,
          cgu: values.cgu,
        },
      }),
    onSuccess: applySignInResult,
    onError: () => scrollToTop(),
  });

  const servicesQuery = useQuery({
    queryKey: ["udaps"],
    queryFn: async () => {
      const response = await unauthenticatedApi.get("/api/services");
      return response;
    },
  });

  const { errors: formErrors } = form.formState;
  const { error: mutationError } = mutation;

  return (
    <Flex flexDirection="column" px={{ lg: 0, xs: "16px" }} width={{ xs: "100%", lg: "600px" }} mx="auto">
      <Typography variant="h4" mb="24px">
        Création de compte
      </Typography>
      <Typography fontSize="14px" mb="8px">
        Vous vous connectez pour la première fois avec <strong>{pending.email}</strong>.
      </Typography>
      {pending.provider === "proconnect" ? (
        <LinkExistingAccount pending={pending} defaultOpen={!pending.canCreateAccount} />
      ) : null}
      {!pending.canCreateAccount ? (
        <Alert
          sx={{ mb: "40px" }}
          severity="info"
          title={
            <Typography fontWeight="regular">
              L'adresse {pending.email} n'est pas autorisée à créer un compte. Si vous utilisiez déjà Patrinotes,
              rattachez votre compte ci-dessus. Sinon, écrivez à contact@patrinotes.beta.gouv.fr.
            </Typography>
          }
        />
      ) : (
        <ProfileFields form={form} mutation={mutation} servicesQuery={servicesQuery} />
      )}

      <Divider my="40px" color="#DDDDDD" />

      <FullWidthButton
        sx={{ mb: { xs: "64px", lg: "80px" } }}
        size="large"
        priority="secondary"
        linkProps={{ to: "/connexion" }}
      >
        Revenir à la connexion
      </FullWidthButton>
    </Flex>
  );
};

const ProfileFields = ({
  form,
  mutation,
  servicesQuery,
}: {
  form: UseFormReturn<SignupFormProps>;
  mutation: { mutate: (values: SignupFormProps) => void; error: unknown; isPending: boolean };
  servicesQuery: { data?: Array<{ id: string; name?: unknown }> };
}) => {
  const { errors: formErrors } = form.formState;
  const { error: mutationError } = mutation;

  return (
    <>
      <Typography fontSize="12px" color={fr.colors.decisions.text.default.grey.default} mb="32px">
        Tous les champs sont obligatoires.
      </Typography>
      <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        {mutationError ? (
          <Alert
            sx={{
              mb: "1.5rem",
            }}
            severity="error"
            title={<Typography fontWeight="regular">{getErrorMessage(mutationError)}</Typography>}
          />
        ) : null}
        <InputGroup>
          <Input
            label="Nom"
            nativeInputProps={{
              ...form.register("nom", { required: "Le nom est requis" }),
            }}
            state={formErrors.nom ? "error" : undefined}
            stateRelatedMessage={formErrors.nom?.message}
          />

          <Input
            label="Prénom"
            nativeInputProps={{
              ...form.register("prenom", { required: "Le prénom est requis" }),
            }}
            state={formErrors.prenom ? "error" : undefined}
            stateRelatedMessage={formErrors.prenom?.message}
          />

          <SignupJobSelect form={form} />

          <Select
            label="Service"
            nativeSelectProps={form.register("service_id", { required: "Le service est requis" })}
            state={formErrors.service_id ? "error" : undefined}
            stateRelatedMessage={formErrors.service_id?.message}
          >
            <option value="" disabled hidden>
              Sélectionnez un service
            </option>
            {servicesQuery.data?.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name as string}
              </option>
            ))}
          </Select>

          <Checkbox
            className={formErrors.cgu ? "fr-checkbox-group--error" : ""}
            options={[
              {
                label: (
                  <span>
                    J'ai lu et j'accepte les{" "}
                    <Link
                      className="fr-link"
                      target="_blank"
                      title="app.patrinotes.beta.gouv.fr - ouvre une nouvelle fenêtre"
                      to="/cgu"
                      style={{ textDecoration: "underline", textUnderlineOffset: 2 }}
                    >
                      conditions générales d’utilisation (CGU)
                    </Link>
                  </span>
                ),
                nativeInputProps: {
                  ...form.register("cgu", { required: true }),
                },
              },
            ]}
          />
          <Checkbox
            sx={{ mt: "16px" }}
            options={[
              {
                label: (
                  <span>
                    J’accepte de recevoir des actualités et conseils du service Patrinotes. Vous pourrez vous désabonner
                    à tout moment.
                  </span>
                ),
                nativeInputProps: {
                  ...form.register("newsletter"),
                },
              },
            ]}
          />
        </InputGroup>

        <FullWidthButton
          style={{
            marginTop: "1.5rem",
          }}
          size="large"
          type="submit"
          nativeButtonProps={{ type: "submit" }}
          disabled={mutation.isPending}
        >
          Valider
        </FullWidthButton>
      </form>
    </>
  );
};

/**
 * ProConnect may send another address than the one the agent's account uses (alias, previous address):
 * prove the old address with an emailed code and keep the existing account (and its documents).
 */
const LinkExistingAccount = ({ pending, defaultOpen }: { pending: PendingSignup; defaultOpen: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const applySignInResult = useApplySignInResult();

  const sendCodeMutation = useMutation({
    mutationFn: () => unauthenticatedApi.post("/api/auth/magic-link", { body: { email: email.trim() } }),
    onSuccess: () => setCodeSent(true),
  });
  const linkMutation = useMutation({
    mutationFn: () =>
      unauthenticatedApi.post("/api/auth/link-account", {
        body: { signupToken: pending.signupToken, email: email.trim(), code },
      }),
    onSuccess: applySignInResult,
  });
  const error = linkMutation.error ?? sendCodeMutation.error;

  return (
    <Box bgcolor={fr.colors.decisions.background.default.grey.hover} p="16px 24px" mb="32px">
      <Typography fontWeight="bold" mb="8px">
        Vous utilisiez déjà Patrinotes avec une autre adresse ?
      </Typography>
      {!open ? (
        <>
          <Typography fontSize="14px" mb="16px">
            Rattachez votre connexion ProConnect à votre compte existant pour retrouver vos constats et
            comptes-rendus.
          </Typography>
          <Button priority="secondary" onClick={() => setOpen(true)} nativeButtonProps={{ type: "button" }}>
            Rattacher mon compte existant
          </Button>
        </>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (codeSent) linkMutation.mutate();
            else sendCodeMutation.mutate();
          }}
        >
          {error ? (
            <Alert
              sx={{ mb: "16px" }}
              severity="error"
              title={<Typography fontWeight="regular">{getErrorMessage(error)}</Typography>}
            />
          ) : null}
          <Input
            label="Courriel de votre compte Patrinotes"
            nativeInputProps={{
              name: "link-email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              disabled: codeSent,
              required: true,
            }}
          />
          {codeSent ? (
            <Input
              label="Code reçu par courriel"
              hintText="Valable 15 minutes"
              nativeInputProps={{
                name: "link-code",
                inputMode: "numeric",
                autoComplete: "one-time-code",
                value: code,
                onChange: (e) => setCode(e.target.value),
                required: true,
              }}
            />
          ) : null}
          <Button
            type="submit"
            nativeButtonProps={{ type: "submit" }}
            disabled={sendCodeMutation.isPending || linkMutation.isPending}
          >
            {codeSent ? "Rattacher et me connecter" : "Recevoir un code"}
          </Button>
        </form>
      )}
    </Box>
  );
};

const SignupJobSelect = ({ form }: { form: UseFormReturn<SignupFormProps> }) => {
  const job = useWatch({ control: form.control, name: "job" });

  return (
    <Box sx={{ mb: "16px" }}>
      <JobSelect job={job} onChange={(job) => form.setValue("job", job, { shouldDirty: true })} />
      <InfoText sx={{ fontSize: "12px !important" }}>
        Votre fonction sera reportée dans les constats et comptes-rendus partagés. Vous pourrez la modifier à tout
        moment dans votre compte utilisateur.
      </InfoText>
    </Box>
  );
};

type SignupFormProps = {
  nom: string;
  prenom: string;
  job: string;
  service_id: string;
  newsletter: boolean;
  cgu: boolean;
};
