import { createFileRoute } from "@tanstack/react-router";
import Clientele from "@/pages/Clientele";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/clientele")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "Our Clients | Trusted Fit-Out Partner in the UAE" },
      {
        name: "description",
        content:
          "Trusted by leading healthcare, hospitality, corporate and retail brands across the UAE for commercial interior design and turnkey fit-out delivery by Winteriors Decor.",
      },
      { property: "og:title", content: "Our Clientele | Winteriors Decor LLC" },
      {
        property: "og:description",
        content:
          "Trusted fit-out and interior design partner for leading brands across Dubai, Abu Dhabi and the UAE.",
      },
      { property: "og:url", content: "/clientele" },
    ],
    links: [{ rel: "canonical", href: "/clientele" }],
  }),
  component: Clientele,
});
