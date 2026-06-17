import { createFileRoute } from "@tanstack/react-router";
import Blogs from "@/pages/Blogs";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Blog | Interior Design Insights — Winteriors Decor" },
      {
        name: "description",
        content:
          "Industry insights, trends and stories on commercial interior design and fit-out from the Winteriors Decor team.",
      },
      { property: "og:title", content: "Winteriors Decor Blog" },
      {
        property: "og:description",
        content: "Insights and trends on interior design and fit-out in the UAE.",
      },
      { property: "og:url", content: "/blogs" },
    ],
    links: [{ rel: "canonical", href: "/blogs" }],
  }),
  component: Blogs,
});
