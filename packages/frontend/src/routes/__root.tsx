import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { RouterOutputs } from "../api";
import { Layout } from "../features/Layout";

export const Route = createRootRouteWithContext<Partial<RouterOutputs<"/api/authenticate">>>()({
  beforeLoad: (ctx) => {
    document.title = getTitle(ctx.location.pathname);
  },
  component: () => (
    <>
      <MuiDsfrThemeProvider>
        <Layout>
          <Outlet />
        </Layout>
      </MuiDsfrThemeProvider>
    </>
  ),
});

const getTitle = (pathname: string) => {
  if (pathname.startsWith("/edit/")) {
    return "Patrimoine Embarqué | Compte rendu";
  }

  if (pathname.startsWith("/constat/")) {
    return "Patrimoine Embarqué | Constat d'état";
  }

  if (pathname.startsWith("/pdf")) {
    return "Patrimoine Embarqué | PDF";
  }

  if (pathname.startsWith("/connection")) {
    return "Patrimoine Embarqué | Connexion";
  }

  if (pathname.startsWith("/inscription")) {
    return "Patrimoine Embarqué | Inscription";
  }

  if (pathname.startsWith("/account")) {
    return "Patrimoine Embarqué | Mon compte";
  }

  if (pathname.startsWith("/service")) {
    return "Patrimoine Embarqué | Mon service";
  }

  return "Patrimoine Embarqué";
};
