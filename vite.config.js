import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import path from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [Vue(), UnoCSS()],
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
    host: true,
    port: 8080,
    strictPort: true,
  },
});
