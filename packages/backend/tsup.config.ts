import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  external: ["react", "react-dom", "@react-pdf/renderer", "@react-pdf/font", "canvas"],
});
