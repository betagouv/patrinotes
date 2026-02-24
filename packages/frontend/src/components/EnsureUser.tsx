import { Navigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useUser } from "../contexts/AuthContext";

export const EnsureUser = ({ children }: PropsWithChildren) => {
  const user = useUser();

  if (!user) {
    const href = window.location.pathname;
    return <Navigate to="/connexion" search={{ redirect: href }} />;
  }

  return <>{children}</>;
};
