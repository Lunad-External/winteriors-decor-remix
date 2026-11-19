import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useSiteContent } from "@/hooks/useSiteContent";
import type { ServicePage } from "@/data/servicePages";
import { cardLinks } from "@/data/servicePages/cardLinks";
import { hasClass, renderElement, renderNode, type Ctx, type ElementNode, type Override } from "./renderNode";
import { EnquiryForm, OfficeCalculator, PackageCard } from "./widgets";

/** Highlights the "On this page" link for the section in view (from the reference script). */
function useScrollSpy() {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>("#sidenav a")];
    const targets = links.map((a) => document.querySelector(a.getAttribute("href") ?? "")).filter((t): t is Element => !!t);
    const setActive = (id: string) =>
      links.forEach((a) => {
        const on = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("is-active", on);
        if (on && window.innerWidth <= 980) a.scrollIntoView({ block: "nearest", inline: "center" });
      });
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: "-35% 0px -60% 0px",
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
}

export function ServiceLanding({ page }: { page: ServicePage }) {
  const { get } = useSiteContent();
  useScrollSpy();
  const title = page.meta.find((m) => m.title)?.title ?? page.slug;

  /** "Request quote" on a package pre-fills the enquiry form, as in the reference. */
  const quote = (size: string, finish?: string) => {
    const form = document.getElementById("enqForm") as HTMLFormElement | null;
    const field = (name: string) => form?.elements.namedItem(name) as HTMLInputElement | null;
    const sizeField = field("size");
    if (sizeField) sizeField.value = size;
    if (!finish || !page.quote) return;
    const finishField = field("finish");
    if (finishField) finishField.value = finish;
    const msg = field("message");
    if (msg && !msg.value) msg.value = page.quote.message.replace("{size}", size).replace("{finish}", finish);
    if (page.quote.focusName) setTimeout(() => field("name")?.focus({ preventScroll: true }), 500);
  };

  const override: Override = (node, path, ctx) => {
    const [tag, props] = node;
    if (tag === "article" && props["data-sqm"]) return <PackageCard key={path} node={node} path={path} ctx={ctx} onQuote={quote} />;
    if (hasClass(props, "js-quote") && props["data-size"]) return renderElement(node, path, ctx, { onClick: () => quote(String(props["data-size"])) });
    if (hasClass(props, "calc")) return <OfficeCalculator key={path} node={node} path={path} ctx={ctx} />;
    if (tag === "form") return <EnquiryForm key={path} node={node} path={path} ctx={ctx} source={title} />;
    const linkName = props["data-link"] as string | undefined;
    if (linkName) {
      // Card or button whose page was not built yet: becomes a link once its URL is set in cardLinks.ts.
      const { "data-link": _name, ...rest } = props;
      const href = cardLinks[page.slug]?.[linkName];
      const linkProps = tag === "div" ? { ...rest, href, "aria-label": linkName } : { ...rest, href };
      return renderElement([href ? "a" : tag, href ? linkProps : rest, ...node.slice(2)] as ElementNode, path, ctx);
    }
    return undefined;
  };

  const ctx: Ctx = { slug: page.slug, label: title.split("|")[0].trim(), get, editable: true, override };
  return (
    <Layout>
      <div className="svc">{page.body.map((n, i) => renderNode(n, String(i), ctx))}</div>
    </Layout>
  );
}
