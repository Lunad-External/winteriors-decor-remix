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
      { title: "Interior Design & Fit-Out Contractor Dubai | Winteriors" },
      {
        name: "description",
        content:
          "Award-winning commercial interior design and turnkey fit-out company in Dubai. 17+ years delivering offices, clinics, retail and hospitality across the UAE.",
      },
      {
        property: "og:title",
        content: "Interior Design & Fit-Out Contractor Dubai | Winteriors Decor",
      },
      {
        property: "og:description",
        content:
          "Premium commercial interior design and turnkey fit-out across Dubai, Abu Dhabi and the UAE — offices, clinics, retail and hospitality.",
      },
        { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: Index,
});
