import { useEffect, useState } from "react";

/**
 * Renders Toaster and Sonner only on the client.
 * Both pull in CSS via styleInject at module load, which crashes during SSR.
 * Using a dynamic `import()` inside useEffect keeps them entirely out of the
 * SSR module graph.
 */
export function ClientToasters() {
  const [Toasters, setToasters] = useState<null | {
    Toaster: React.ComponentType;
    Sonner: React.ComponentType;
  }>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [t, s] = await Promise.all([
        import("@/components/ui/toaster"),
        import("@/components/ui/sonner"),
      ]);
      if (cancelled) return;
      setToasters({ Toaster: t.Toaster, Sonner: s.Toaster });
    })();
    return () => { cancelled = true; };
  }, []);

  if (!Toasters) return null;
  const { Toaster, Sonner } = Toasters;
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
}
