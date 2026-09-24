import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { api } from "../../../api";

type IIIFManifest = { id: string; items?: unknown[] };

type MiradorInstance = {
  store: { dispatch: (action: unknown) => void };
  renderInto: (el: HTMLElement) => void;
  unmount: () => void;
};

type Mirador = {
  viewer: (config: Record<string, unknown>) => MiradorInstance;
  receiveManifest: (manifestId: string, manifestJson: unknown) => unknown;
  addWindow: (config: Record<string, unknown>) => unknown;
};

const loadMirador = async () => {
  const mod = await import("mirador-umd");
  // depending on how the UMD bundle is transformed, Mirador is either exported or set on window
  // (mod.default is Mirador's default export which only contains `viewer`, not the actions)
  const candidates = [mod, mod?.default, (window as any).Mirador];
  const mirador = candidates.find((candidate) =>
    ["viewer", "receiveManifest", "addWindow"].every((fn) => typeof candidate?.[fn] === "function"),
  );
  if (!mirador) throw new Error("Mirador failed to load");
  return mirador as Mirador;
};

export const MonumentIIIFViewer = ({ referencePop }: { referencePop: string }) => {
  const reference = referencePop.trim();

  // POP doesn't send CORS headers on the manifest, so it goes through the backend
  const manifestQuery = useQuery({
    queryKey: ["pop-iiif-manifest", reference],
    queryFn: async () => (await api.get("/api/state-report/iiif-manifest", { query: { reference } })) as IIIFManifest,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const manifest = manifestQuery.data;
  // only show the viewer when the manifest has at least one image
  if (!manifest?.id || !manifest.items?.length) return null;

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" mb="16px">
        Images
      </Typography>
      <MiradorViewer manifest={manifest} />
    </Box>
  );
};

const MiradorViewer = ({ manifest }: { manifest: IIIFManifest }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: MiradorInstance | null = null;
    let isCancelled = false;

    loadMirador().then((mirador) => {
      if (isCancelled || !containerRef.current) return;
      instance = mirador.viewer({
        language: "fr",
        windows: [],
        window: {
          allowClose: false,
          allowMaximize: false,
          allowFullscreen: true,
          sideBarPanel: "info",
          sideBarOpen: false,
        },
        workspace: { allowNewWindows: false },
        workspaceControlPanel: { enabled: false },
      });
      // preload the manifest so Mirador doesn't fetch it itself (it would hit the CORS error)
      instance.store.dispatch(mirador.receiveManifest(manifest.id, manifest));
      instance.store.dispatch(mirador.addWindow({ manifestId: manifest.id, thumbnailNavigationPosition: "far-bottom" }));
      instance.renderInto(containerRef.current);
    });

    return () => {
      isCancelled = true;
      instance?.unmount();
    };
  }, [manifest]);

  return <Box ref={containerRef} position="relative" width="100%" height={{ xs: "400px", lg: "500px" }} />;
};
