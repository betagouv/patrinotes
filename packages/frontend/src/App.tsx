import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useAuthContext } from "./contexts/AuthContext";
import { routeTree } from "./routeTree.gen";

export const App = () => {
  const { auth } = useAuthContext();
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
