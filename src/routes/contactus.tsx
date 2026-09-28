import { createFileRoute } from "@tanstack/react-router";
import ContactUs from "@/pages/ContactUs";
import { siteContentQuery } from "@/lib/public-data.queries";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/contactus")({
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
        { property: "og:url", content: absoluteUrl("/contactus") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contactus") }],
  }),
  component: ContactUs,
});
