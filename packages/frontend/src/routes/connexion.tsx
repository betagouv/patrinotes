import { createFileRoute } from "@tanstack/react-router";
import { RedirectIfUser } from "#components/RedirectIfUser";
import { Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Typography } from "@mui/material";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { auth } from "../features/keycloak/auth";

const LoginPage = () => {
  return (
    <Center mt="20px">
      <Flex flexDirection="column" alignItems="center" gap="24px" width="480px" p="16px">
        <Typography variant="h4">Connexion</Typography>
        <Button onClick={auth.login} size="large">
          Se connecter avec ProConnect
        </Button>
      </Flex>
    </Center>
  );
};

export const Route = createFileRoute("/connexion")({
  component: () => (
    <RedirectIfUser>
      <LoginPage />
    </RedirectIfUser>
  ),
});
