import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  component: Contact,
});
