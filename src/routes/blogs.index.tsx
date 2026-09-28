import { createFileRoute } from "@tanstack/react-router";
import Blogs from "@/pages/Blogs";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "Interior Design & Fit-Out Blog | Winteriors Decor Dubai" },
      {
        name: "description",
        content:
          "Expert insights, trends and case studies on commercial interior design, turnkey fit-out and workspace strategy in Dubai, Abu Dhabi and the wider UAE market.",
      },
      { property: "og:title", content: "Interior Design & Fit-Out Blog | Winteriors Decor" },
      {
        property: "og:description",
        content:
          "Insights, trends and case studies on commercial interior design and fit-out across the UAE.",
      },
        { property: "og:url", content: absoluteUrl("/blogs") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/blogs") }],
  }),
  component: Blogs,
});