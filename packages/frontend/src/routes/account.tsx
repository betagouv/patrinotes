import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return Route.useNavigate()({ to: "/compte" });
}
