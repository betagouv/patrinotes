import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: "packages/backend/tsconfig.json",
    },
  },
  publicDir: "public",
});
