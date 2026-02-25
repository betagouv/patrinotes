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
    return "Patrinotes | Compte rendu";
  }

  if (pathname.startsWith("/constat/")) {
    return "Patrinotes | Constat d'état";
  }

  if (pathname.startsWith("/pdf")) {
    return "Patrinotes | PDF";
  }

  if (pathname.startsWith("/connexion")) {
    return "Patrinotes | Connexion";
  }

  if (pathname.startsWith("/inscription")) {
    return "Patrinotes | Inscription";
  }

  if (pathname.startsWith("/account")) {
    return "Patrinotes | Mon compte";
  }

  if (pathname.startsWith("/service")) {
    return "Patrinotes | Mon service";
  }

  return "Patrinotes";
};
