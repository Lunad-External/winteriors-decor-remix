import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "Contact Winteriors Decor | Fit-Out Quote in Dubai & UAE" },
      {
        name: "description",
        content:
          "Contact Winteriors Decor LLC for a free consultation or quote on commercial interior design and turnkey fit-out projects in Dubai, Abu Dhabi and across the UAE.",
      },
      { property: "og:title", content: "Contact Winteriors Decor | Interior Fit-Out Dubai" },
      {
        property: "og:description",
        content:
          "Talk to our team about your next commercial interior design or fit-out project in the UAE.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});
