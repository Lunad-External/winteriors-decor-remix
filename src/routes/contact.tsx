import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "Contact Us | Get a Quote — Winteriors Decor LLC" },
      {
        name: "description",
        content:
          "Get in touch with Winteriors Decor LLC for interior design and fit-out projects in Dubai, Abu Dhabi and across the UAE.",
      },
      { property: "og:title", content: "Contact Winteriors Decor LLC" },
      {
        property: "og:description",
        content: "Reach out for a consultation or project quote.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});
