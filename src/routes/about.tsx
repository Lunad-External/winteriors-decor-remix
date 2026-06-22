import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/about")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "About Winteriors Decor | Interior Fit-Out Experts Dubai" },
      {
        name: "description",
        content:
          "Learn about Winteriors Decor LLC — 17+ years designing and delivering premium commercial interiors and turnkey fit-outs across Dubai, Abu Dhabi and the UAE.",
      },
      { property: "og:title", content: "About Winteriors Decor | Fit-Out Experts in Dubai" },
      {
        property: "og:description",
        content:
          "Leading interior design and turnkey fit-out company in the UAE with 17+ years of commercial project experience.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});
