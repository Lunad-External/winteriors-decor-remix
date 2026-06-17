import { createFileRoute } from "@tanstack/react-router";
import Clientele from "@/pages/Clientele";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/clientele")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  component: Clientele,
});
