import { Box, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "../features/auth/SignupForm";
import { Center } from "#components/MUIDsfr.tsx";
import { Notice } from "@codegouvfr/react-dsfr/Notice";

export const Route = createFileRoute("/inscription")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Notice
        iconDisplayed
        isClosable={false}
        severity="info"
        title={
          <>
            Compte-rendu VIF est désormais intégré à Patrinotes !<br />
          </>
        }
        description="Retrouvez vos documents en créant un nouveau compte, avec le même courriel que celui utilisé sur Compte-rendu VIF."
      />
      <Center mt={{ xs: "40px", lg: "56px" }} flexDirection="column" textAlign="left">
        <SignupForm />
      </Center>
    </>
  );
}
