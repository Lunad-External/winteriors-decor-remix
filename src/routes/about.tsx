import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/about")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  component: About,
});
