// SSR safety polyfills — must run before any module touches browser globals.
// Imported as a side-effect at the very top of src/routes/__root.tsx so it
// executes before supabase/auth modules that read localStorage at init time.
if (typeof globalThis !== "undefined") {
  const g = globalThis as any;
  if (typeof g.localStorage === "undefined") {
    const store = new Map<string, string>();
    const memoryStorage: Storage = {
      get length() { return store.size; },
      clear: () => store.clear(),
      getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      removeItem: (k: string) => void store.delete(k),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
    };
    g.localStorage = memoryStorage;
    if (typeof g.sessionStorage === "undefined") g.sessionStorage = memoryStorage;
  }
  if (typeof g.window === "undefined") {
    // Minimal window shim so libraries that touch window during import don't crash.
    g.window = g;
  }
  if (typeof g.document === "undefined") {
    g.document = { addEventListener: () => {}, removeEventListener: () => {}, documentElement: {}, body: {} };
  }
}

export {};
