import { createFileRoute } from "@tanstack/react-router";
import Services from "@/pages/Services";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/services/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "Interior Design & Fit-Out Services in Dubai & Abu Dhabi" },
      {
        name: "description",
        content:
          "Turnkey commercial fit-out, interior design, MEP, joinery, project management and refurbishment services for offices, retail, clinics and hospitality across the UAE.",
      },
      { property: "og:title", content: "Interior Design & Fit-Out Services | Winteriors Decor" },
      {
        property: "og:description",
        content:
          "End-to-end interior design, fit-out, project management and refurbishment services in Dubai, Abu Dhabi and the UAE.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});
