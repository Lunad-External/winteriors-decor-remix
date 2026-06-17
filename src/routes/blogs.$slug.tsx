import { createFileRoute } from "@tanstack/react-router";
import BlogDetail from "@/pages/BlogDetail";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => {
    const title = params.slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${title} | Winteriors Decor Blog` },
        {
          name: "description",
          content: `${title} — insights on interior design and fit-out from Winteriors Decor LLC.`,
        },
        { property: "og:title", content: title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blogs/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/blogs/${params.slug}` }],
    };
  },
  component: BlogDetail,
});
