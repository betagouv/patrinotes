import { createFileRoute } from "@tanstack/react-router";
import { clearAuth } from "../../auth";
import { useNavigate } from "@tanstack/react-router";

const DashboardPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate({ to: "/login" });
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1>Dashboard</h1>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});
