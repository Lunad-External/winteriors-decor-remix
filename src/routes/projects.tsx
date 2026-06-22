import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import Projects from "@/pages/Projects";
import { storageProjectsQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/projects")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(storageProjectsQuery).catch(() => []),
  head: () => ({
    meta: [
      { title: "Interior Design & Fit-Out Projects Portfolio | Winteriors" },
      {
        name: "description",
        content:
          "Explore Winteriors Decor's portfolio of commercial interior design and turnkey fit-out projects — offices, clinics, retail and hospitality across Dubai and Abu Dhabi.",
      },
      { property: "og:title", content: "Interior Design & Fit-Out Projects | Winteriors Decor" },
      {
        property: "og:description",
        content:
          "Signature commercial interior design and fit-out projects delivered across the UAE by Winteriors Decor LLC.",
      },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsRouteComponent,
});

function ProjectsRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname.replace(/\/$/, "") === "/projects" ? <Projects /> : <Outlet />;
}
