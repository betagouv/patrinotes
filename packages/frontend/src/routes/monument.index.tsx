import { createFileRoute } from "@tanstack/react-router";
import { EnsureUser } from "#components/EnsureUser";
import { MonumentSearch } from "../features/fiche/MonumentSearch";

export const Route = createFileRoute("/monument/")({
  component: () => (
    <EnsureUser>
      <MonumentSearch />
    </EnsureUser>
  ),
});
