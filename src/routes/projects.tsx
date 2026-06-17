import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";
import { storageProjectsQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/projects")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(storageProjectsQuery).catch(() => []),
  component: Projects,
});
