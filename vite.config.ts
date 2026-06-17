import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

// Node-side SSR polyfills — installed at config load so they're present before
// any module body runs (incl. the Supabase client which reads localStorage at init).
{
  const g = globalThis as any;
  if (typeof g.localStorage === "undefined") {
    const store = new Map<string, string>();
    const memoryStorage = {
      get length() { return store.size; },
      clear: () => store.clear(),
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      removeItem: (k: string) => void store.delete(k),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
    };
    g.localStorage = memoryStorage;
    g.sessionStorage = memoryStorage;
  }
}

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
