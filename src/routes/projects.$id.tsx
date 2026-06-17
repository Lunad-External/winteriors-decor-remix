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
    let images: string[] = [];
    if (project?.folder) {
      images = await context.queryClient
        .ensureQueryData(projectImagesQuery(project.folder))
        .catch(() => [] as string[]);
    }
    return {
      title: project?.name ?? params.id,
      category: project?.category ?? null,
      coverImage: images[0] ?? null,
    };
  },
  head: ({ params, loaderData }) => {
    const title = loaderData?.title ?? "Project";
    const desc = loaderData?.category
      ? `${title} — ${loaderData.category} interior design and fit-out project by Winteriors Decor LLC.`
      : `${title} — interior design and fit-out project by Winteriors Decor LLC.`;
    const meta: Array<Record<string, string>> = [
      { title: `${title} | Winteriors Decor Projects` },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projects/${params.id}` },
    ];
    if (loaderData?.coverImage) {
      meta.push({ property: "og:image", content: loaderData.coverImage });
      meta.push({ name: "twitter:image", content: loaderData.coverImage });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: `/projects/${params.id}` }],
    };
  },
  component: ProjectDetail,
});
