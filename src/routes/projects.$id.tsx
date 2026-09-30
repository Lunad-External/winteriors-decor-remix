import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "@/pages/ProjectDetail";
import {
  storageProjectsQuery,
  projectCmsQuery,
  projectImagesQuery,
} from "@/lib/public-data.queries";
import type {
  StorageProjectDTO,
  ProjectImageDTO,
} from "@/lib/public-data.functions";
import { absoluteUrl } from "@/lib/seo";

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
    let coverImage: string | null = project?.coverImage ?? null;
    if (project?.folder) {
      const images = await context.queryClient
        .ensureQueryData(projectImagesQuery(project.folder))
        .catch(() => [] as ProjectImageDTO[]);
      if (images.length > 0) coverImage = images[0].url;
    }
    return {
      title: project?.title ?? params.id,
      category: project?.category ?? null,
      coverImage,
    };
  },
  head: ({ params, loaderData }) => {
    const url = absoluteUrl(`/projects/${params.id}`);
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
      { property: "og:url", content: url },
    ];
    if (loaderData?.coverImage) {
      meta.push({ property: "og:image", content: loaderData.coverImage });
      meta.push({ name: "twitter:image", content: loaderData.coverImage });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProjectDetail,
});
