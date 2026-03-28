import Alert from "@codegouvfr/react-dsfr/Alert";
import { useState } from "react";
import { auth } from "../features/keycloak/auth";
import { Button } from "./MUIDsfr";
import { Flex } from "./ui/Flex";

export const LoginForm = () => {
  return (
    <Flex flexDirection="column">
      <Button onClick={() => auth.login()}>Se connecter avec ProConnect</Button>
    </Flex>
  );
};
