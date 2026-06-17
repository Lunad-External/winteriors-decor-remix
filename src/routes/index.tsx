import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import {
  siteContentQuery,
  storageProjectsQuery,
} from "@/lib/public-data.queries";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
      context.queryClient.ensureQueryData(storageProjectsQuery).catch(() => []),
    ]);
  },
  component: Index,
});
