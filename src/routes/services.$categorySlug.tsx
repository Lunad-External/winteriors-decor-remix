import { createFileRoute } from "@tanstack/react-router";
import ServiceCategory from "@/pages/ServiceCategory";

export const Route = createFileRoute("/services/$categorySlug")({
  head: ({ params }) => {
    const title = params.categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${title} | Services — Winteriors Decor` },
        {
          name: "description",
          content: `${title} services by Winteriors Decor LLC — interior design and fit-out across the UAE.`,
        },
        { property: "og:title", content: `${title} — Winteriors Decor` },
        { property: "og:url", content: `/services/${params.categorySlug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.categorySlug}` }],
    };
  },
  component: ServiceCategory,
});
