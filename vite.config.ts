import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

export default defineConfig({
  vite: {
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "react-router-dom": path.resolve(__dirname, "./src/lib/router-compat.tsx"),
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
