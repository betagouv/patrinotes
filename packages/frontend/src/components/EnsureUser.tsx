import { getRouteApi, Navigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useUser } from "../contexts/AuthContext";

export const EnsureUser = ({ children }: PropsWithChildren) => {
  const user = useUser();

  if (!user) {
    return <Navigate to={"/connexion"} />;
  }

  return <>{children}</>;
};
