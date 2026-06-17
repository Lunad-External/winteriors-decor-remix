import { createFileRoute } from "@tanstack/react-router";
import Services from "@/pages/Services";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/services")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  component: Services,
});
