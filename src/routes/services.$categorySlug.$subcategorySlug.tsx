import { createFileRoute } from "@tanstack/react-router";
import ServiceSubcategory from "@/pages/ServiceSubcategory";

export const Route = createFileRoute("/services/$categorySlug/$subcategorySlug")({
  head: ({ params }) => {
    const title = params.subcategorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const parent = params.categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${title} | ${parent} — Winteriors Decor` },
        {
          name: "description",
          content: `${title} (${parent}) services by Winteriors Decor LLC.`,
        },
        { property: "og:title", content: `${title} — Winteriors Decor` },
        {
          property: "og:url",
          content: `/services/${params.categorySlug}/${params.subcategorySlug}`,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: `/services/${params.categorySlug}/${params.subcategorySlug}`,
        },
      ],
    };
  },
  component: ServiceSubcategory,
});
