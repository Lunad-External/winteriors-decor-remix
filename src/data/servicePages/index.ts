/**
 * Redesigned service landing pages (ticket ECT-376).
 * Each JSON file is generated from the client's reference HTML: `body` is a node tree
 * ([tag, props, ...children], text as strings) rendered by components/services/ServiceLanding.
 */
export type SvcNode = string | [string, Record<string, unknown>, ...SvcNode[]];

export interface ServicePage {
  slug: string;
  meta: Array<Record<string, string>>;
  canonical: string;
  jsonLd: unknown;
  /** Package "Request quote" prefill; {size} and {finish} are replaced. */
  quote: { message: string; focusName: boolean } | null;
  body: SvcNode[];
}

// Lazy, so the header can check slugs without pulling page content into every bundle.
const pages = import.meta.glob<ServicePage>("./*.json", { import: "default" });
const loaderFor = (slug: string) => pages[`./${slug}.json`];

export const hasServicePage = (slug: string) => Boolean(loaderFor(slug));

export const loadServicePage = async (slug: string): Promise<ServicePage | null> =>
  (await loaderFor(slug)?.()) ?? null;

/** True for /services/<slug> when that slug has a redesigned page (not for subcategory pages). */
export function isServiceLandingPath(pathname: string): boolean {
  const m = pathname.match(/^\/services\/([^/]+)\/?$/);
  return Boolean(m && hasServicePage(m[1]));
}
