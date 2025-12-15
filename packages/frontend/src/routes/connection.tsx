import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RedirectIfUser } from "#components/RedirectIfUser";
import { Center } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Typography } from "@mui/material";
import { LoginForm } from "../features/auth/LoginForm";

const LoginPage = () => {
  return (
    <Center mt="20px">
      <Flex flexDirection="column" width="996px" p="16px" pb="0">
        <Typography variant="h4" mb="1.5rem">
          Connexion
        </Typography>
        <LoginForm />
      </Flex>
    </Center>
  );
};

export const Route = createFileRoute("/connection")({
  component: () => {
    return (
      <RedirectIfUser>
        <LoginPage />
      </RedirectIfUser>
    );
  },
});
