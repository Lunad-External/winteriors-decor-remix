import { createFileRoute } from "@tanstack/react-router";
import ServiceCategory from "@/pages/ServiceCategory";
import { ServiceLanding } from "@/components/services/ServiceLanding";
import { loadServicePage, type ServicePage } from "@/data/servicePages";
import { siteContentQuery } from "@/lib/public-data.queries";
import { absoluteUrl } from "@/lib/seo";
import referenceCss from "@/components/services/reference.generated.css?url";
import landingCss from "@/components/services/service-landing.css?url";

// An index route (not a parent layout) so /services/$categorySlug/$subcategorySlug renders its own page.
export const Route = createFileRoute("/services/$categorySlug/")({
  loader: async ({ params, context }) => {
    const [page] = await Promise.all([
      loadServicePage(params.categorySlug),
      context.queryClient.ensureQueryData(siteContentQuery).catch(() => ({})),
    ]);
    return { page };
  },
  head: ({ params, loaderData }) => (loaderData?.page ? landingHead(loaderData.page) : categoryHead(params.categorySlug)),
  component: CategoryPage,
});

function CategoryPage() {
  const { page } = Route.useLoaderData();
  return page ? <ServiceLanding page={page} /> : <ServiceCategory />;
}

function landingHead(page: ServicePage) {
  return {
    meta: page.meta,
    links: [
      { rel: "canonical", href: page.canonical },
      { rel: "stylesheet", href: referenceCss },
      { rel: "stylesheet", href: landingCss },
    ],
    scripts: page.jsonLd ? [{ type: "application/ld+json", children: JSON.stringify(page.jsonLd) }] : [],
  };
}

function categoryHead(categorySlug: string) {
  const url = absoluteUrl(`/services/${categorySlug}`);
  const title = categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
      { property: "og:url", content: url },
    ],
  };
}
