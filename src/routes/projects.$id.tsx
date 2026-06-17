import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "@/pages/ProjectDetail";
import {
  storageProjectsQuery,
  projectCmsQuery,
  projectImagesQuery,
} from "@/lib/public-data.queries";
import type { StorageProjectDTO } from "@/lib/public-data.functions";

export const Route = createFileRoute("/projects/$id")({
  loader: async ({ context, params }) => {
    const [projects] = await Promise.all([
      context.queryClient
        .ensureQueryData(storageProjectsQuery)
        .catch(() => [] as StorageProjectDTO[]),
      context.queryClient
        .ensureQueryData(projectCmsQuery(params.id))
        .catch(() => null),
    ]);
    const project = (projects || []).find(
      (p) => p.id.toLowerCase() === params.id.toLowerCase(),
    );
    if (project?.folder) {
      await context.queryClient
        .ensureQueryData(projectImagesQuery(project.folder))
        .catch(() => []);
    }
  },
  component: ProjectDetail,
});

