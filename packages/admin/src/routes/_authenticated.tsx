import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getToken } from "../auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!getToken()) throw redirect({ to: "/login" });
  },
  component: () => <Outlet />,
});
