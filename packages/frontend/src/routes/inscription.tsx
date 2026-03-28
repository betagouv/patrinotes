import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/inscription")({
  component: () => <Navigate to="/connexion" />,
});
