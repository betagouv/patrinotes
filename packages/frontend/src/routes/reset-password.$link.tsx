import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { FullWidthButton } from "#components/FullWidthButton";
import { useMutation } from "@tanstack/react-query";
import { api, unauthenticatedApi } from "../api";
import { MutationAlert } from "#components/MutationAlert.js";
import { Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Typography } from "@mui/material";
import { SignupPasswordInput } from "../features/auth/SignupForm";

const ResetPasswordAction = () => {
  const form = useForm<any>();
  const { link } = Route.useParams();

  const mutation = useMutation({
    mutationFn: async (body: ResetPasswordActionForm) => {
      const result = await unauthenticatedApi.post("/api/reset-password", {
        body: { newPassword: body.password, temporaryLink: link },
      });

      form.reset();

      return result;
    },
  });

  return (
    <Center mt="20px" mb="80px">
      <Flex flexDirection="column" width="484px" p="16px">
        <Typography variant="h4">Récupération de mot de passe pour Patrinotes</Typography>
        <p>Veuillez saisir votre nouveau mot de passe</p>

        <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <SignupPasswordInput form={form} />

          <FullWidthButton type="submit">Valider</FullWidthButton>
        </form>

        <MutationAlert mutation={mutation} />
      </Flex>
    </Center>
  );
};

type ResetPasswordActionForm = {
  password: string;
};

export const Route = createFileRoute("/reset-password/$link")({
  component: () => <ResetPasswordAction />,
});
