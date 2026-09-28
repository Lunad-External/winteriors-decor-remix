import { createFileRoute } from "@tanstack/react-router";
import ServiceSubcategory from "@/pages/ServiceSubcategory";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/services/$categorySlug/$subcategorySlug")({
  head: ({ params }) => {
    const url = absoluteUrl(`/services/${params.categorySlug}/${params.subcategorySlug}`);
    const title = params.subcategorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const parent = params.categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${title} | ${parent} Services — Winteriors Decor` },
        {
          name: "description",
          content: `Expert ${title.toLowerCase()} as part of our ${parent.toLowerCase()} offering — commercial interior design and turnkey fit-out by Winteriors Decor LLC in Dubai & the UAE.`,
        },
        { property: "og:title", content: `${title} | ${parent} — Winteriors Decor` },
        {
          property: "og:description",
          content: `Specialist ${title.toLowerCase()} services for commercial projects across Dubai, Abu Dhabi and the UAE.`,
        },
        {
          property: "og:url",
          content: url,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: url,
        },
      ],
    };
  },
  component: ServiceSubcategory,
});
