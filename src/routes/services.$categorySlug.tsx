import { createFileRoute } from "@tanstack/react-router";
import ServiceCategory from "@/pages/ServiceCategory";

export const Route = createFileRoute("/services/$categorySlug")({
  head: ({ params }) => {
    const title = params.categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${title} Services in Dubai & UAE | Winteriors Decor` },
        {
          name: "description",
          content: `Professional ${title.toLowerCase()} services by Winteriors Decor LLC — commercial interior design and turnkey fit-out solutions across Dubai, Abu Dhabi and the UAE.`,
        },
        { property: "og:title", content: `${title} Services | Winteriors Decor Dubai` },
        {
          property: "og:description",
          content: `Expert ${title.toLowerCase()} services for offices, retail, clinics and hospitality projects across the UAE.`,
        },
        { property: "og:url", content: `/services/${params.categorySlug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.categorySlug}` }],
    };
  },
  component: ServiceCategory,
});
