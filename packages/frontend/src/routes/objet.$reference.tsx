import { createFileRoute } from "@tanstack/react-router";
import { EnsureUser } from "#components/EnsureUser";
import { ObjetFiche } from "../features/fiche/ObjetFiche";

/** Fiche of an objet mobilier (Palissy reference). */
export const Route = createFileRoute("/objet/$reference")({
  component: RouteComponent,
});

function RouteComponent() {
  const { reference } = Route.useParams();
  return (
    <EnsureUser>
      <ObjetFiche key={reference} reference={reference} />
    </EnsureUser>
  );
}
