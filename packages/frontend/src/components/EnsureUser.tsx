import { getRouteApi, Navigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useUser } from "../contexts/AuthContext";
const routeApi = getRouteApi("/");

export const EnsureUser = ({ children }: PropsWithChildren) => {
  const user = useUser();

  const params = routeApi.useSearch();

  if (!user) {
    return <Navigate to={params.from === "crvif" ? "/inscription" : "/connexion"} />;
  }

  return <>{children}</>;
};
