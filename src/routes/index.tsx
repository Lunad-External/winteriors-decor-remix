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
  head: () => ({
    meta: [
      { title: "Winteriors Decor LLC | Premium Interior Design & Fit-Out Dubai & Abu Dhabi" },
      {
        name: "description",
        content:
          "17+ years of excellence in commercial interior design and fit-out solutions across Dubai and Abu Dhabi.",
      },
      {
        property: "og:title",
        content: "Winteriors Decor LLC | Premium Interior Design & Fit-Out",
      },
      {
        property: "og:description",
        content:
          "17+ years of excellence in commercial interior design and fit-out across the UAE.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});
