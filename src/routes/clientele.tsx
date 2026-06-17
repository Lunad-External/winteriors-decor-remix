import { createFileRoute } from "@tanstack/react-router";
import Clientele from "@/pages/Clientele";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/clientele")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "Our Clientele | Trusted by Leading Brands — Winteriors Decor" },
      {
        name: "description",
        content:
          "Meet the prestigious clients across healthcare, hospitality, corporate and retail sectors that trust Winteriors Decor LLC.",
      },
      { property: "og:title", content: "Our Clientele — Winteriors Decor" },
      {
        property: "og:description",
        content: "Trusted by leading brands across the UAE.",
      },
      { property: "og:url", content: "/clientele" },
    ],
    links: [{ rel: "canonical", href: "/clientele" }],
  }),
  component: Clientele,
});
