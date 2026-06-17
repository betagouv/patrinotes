import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useAuthContext } from "./contexts/AuthContext";
import { routeTree } from "./routeTree.gen";
import "./features/polyfill";
import useMatomo from "@datapunt/matomo-tracker-react/lib/useMatomo";

export const App = () => {
  const { enableLinkTracking } = useMatomo();

  enableLinkTracking();
  return <RouterProvider router={router} />;
};

const router = createRouter({
  routeTree,
  scrollToTopSelectors: [".MuiBox-root"],
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
