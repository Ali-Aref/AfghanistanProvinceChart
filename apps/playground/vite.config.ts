import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        en: resolve(import.meta.dirname, "index.html"),
        prs: resolve(import.meta.dirname, "prs/index.html"),
        ps: resolve(import.meta.dirname, "ps/index.html"),
      },
    },
  },
});
