import { createFileRoute } from "@tanstack/react-router";
import { EnsureUser } from "#components/EnsureUser";
import { MonumentFiche } from "../features/fiche/MonumentFiche";

/** Fiche of a monument historique (`up`: one of its unités patrimoniales). */
export const Route = createFileRoute("/monument/$reference")({
  validateSearch: (search: Record<string, unknown>): { up?: string } =>
    typeof search.up === "string" && search.up ? { up: search.up } : {},
  component: RouteComponent,
});

function RouteComponent() {
  const { reference } = Route.useParams();
  const { up } = Route.useSearch();
  return (
    <EnsureUser>
      <MonumentFiche key={`${reference}-${up ?? ""}`} reference={reference} upId={up} />
    </EnsureUser>
  );
}
