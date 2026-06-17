import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";
import { storageProjectsQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/projects/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(storageProjectsQuery).catch(() => []),
  head: () => ({
    meta: [
      { title: "Our Projects | Interior Design Portfolio — Winteriors Decor" },
      {
        name: "description",
        content:
          "Browse our portfolio of premium commercial interior design and fit-out projects across Dubai, Abu Dhabi and the UAE.",
      },
      { property: "og:title", content: "Our Projects — Winteriors Decor" },
      {
        property: "og:description",
        content: "Explore signature interior design and fit-out projects delivered by Winteriors Decor LLC.",
      },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: Projects,
});
