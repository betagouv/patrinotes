import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { unauthenticatedApi } from "../api";
import { setAuth, type AdminAuth, getToken } from "../auth";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const mutation = useMutation({
    mutationFn: (body: LoginFormValues) =>
      unauthenticatedApi<AdminAuth>("/api/admin/login-user", { method: "POST", body }),
  });

  const onSubmit = async (values: LoginFormValues) => {
    const response = await mutation.mutateAsync(values);
    setAuth(response);
    navigate({ to: "/dashboard" });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "12px", width: "320px" }}
      >
        <h1 style={{ margin: "0 0 8px" }}>Administration</h1>

        {mutation.error && (
          <p style={{ color: "red", margin: 0 }}>
            {(mutation.error as any)?.data?.error ?? "Une erreur s'est produite"}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="email">Courriel</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            {...register("email", {
              required: "Le courriel est requis",
              pattern: { value: /\S+@\S+\.\S+/, message: "Courriel invalide" },
            })}
          />
          {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email.message}</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "Le mot de passe est requis" })}
          />
          {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (getToken()) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});
