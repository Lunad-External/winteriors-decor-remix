import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";
import { siteContentQuery } from "@/lib/public-data.queries";

export const Route = createFileRoute("/about")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
  head: () => ({
    meta: [
      { title: "About Winteriors Decor LLC | 17+ Years of Excellence" },
      {
        name: "description",
        content:
          "Discover Winteriors Decor LLC - a leading interior design and fit-out company in Dubai & Abu Dhabi with over 17 years of expertise.",
      },
      { property: "og:title", content: "About Winteriors Decor LLC" },
      {
        property: "og:description",
        content: "17+ years delivering premium interior design and fit-out across the UAE.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});
