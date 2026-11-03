import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "../features/auth/SignupForm";
import { Center } from "#components/MUIDsfr.tsx";
import { RedirectIfUser } from "#components/RedirectIfUser";

/** Reached after a first sign-in (ProConnect or email), to complete the agent's profile. */
export const Route = createFileRoute("/inscription")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RedirectIfUser>
      <Center mt={{ xs: "40px", lg: "56px" }} flexDirection="column" textAlign="left">
        <SignupForm />
      </Center>
    </RedirectIfUser>
  );
}
