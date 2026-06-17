import { createFileRoute } from "@tanstack/react-router";
import Services from "@/pages/Services";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/services")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "Our Services | Interior Design & Fit-Out — Winteriors Decor" },
      {
        name: "description",
        content:
          "Comprehensive interior design, turnkey fit-out, project management, space planning and refurbishment services across the UAE.",
      },
      { property: "og:title", content: "Our Services — Winteriors Decor" },
      {
        property: "og:description",
        content: "Interior design, fit-out, project management and refurbishment in Dubai & Abu Dhabi.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});
