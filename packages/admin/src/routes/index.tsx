import { createFileRoute, redirect } from "@tanstack/react-router";
import { getToken } from "../auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (getToken()) {
      throw redirect({ to: "/dashboard" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
});
