import { createFileRoute } from "@tanstack/react-router";
import BlogDetail from "@/pages/BlogDetail";
import { blogs } from "@/data/blogs";

const SITE = "https://winteriors-decor-updated.lovable.app";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => {
    const blog = blogs.find((b) => b.slug === params.slug);
    const title = blog?.title ??
      params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const description = blog?.excerpt ??
      `${title} — insights on interior design and fit-out from Winteriors Decor LLC.`;
    const url = `${SITE}/blogs/${params.slug}`;
    const image = blog?.image ? `${SITE}${blog.image}` : undefined;
    const isoDate = blog?.date ? new Date(blog.date).toISOString() : undefined;

    const meta: Array<Record<string, string>> = [
      { title: `${title} | Winteriors Decor Blog` },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Winteriors Decor LLC" },
      publisher: {
        "@type": "Organization",
        name: "Winteriors Decor LLC",
        logo: { "@type": "ImageObject", url: `${SITE}/favicon.png` },
      },
    };
    if (image) jsonLd.image = image;
    if (isoDate && !Number.isNaN(new Date(blog!.date).getTime())) {
      jsonLd.datePublished = isoDate;
    }

    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(jsonLd) },
      ],
    };
  },
  component: BlogDetail,
});
