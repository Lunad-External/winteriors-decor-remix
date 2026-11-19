import { createElement, Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { EditableText } from "@/components/common/EditableText";
import { EditableImage } from "@/components/common/EditableImage";
import type { SvcNode } from "@/data/servicePages";

export type Props = Record<string, unknown>;
export type ElementNode = [string, Props, ...SvcNode[]];
/** Return a ReactNode to replace how a node renders, or undefined to render it normally. */
export type Override = (node: ElementNode, path: string, ctx: Ctx) => ReactNode | undefined;

export interface Ctx {
  slug: string;
  /** Page name used in admin labels. */
  label: string;
  /** site_content lookup (admin overrides). */
  get: (key: string) => string;
  editable: boolean;
  override?: Override;
}

const images = import.meta.glob<string>("/src/assets/services/*", { eager: true, import: "default" });
const imageUrl = (file: string) => images[`/src/assets/services/${file}`] ?? file;

const EDIT_TAGS = new Set(["h1", "h2", "h3", "h4", "p", "span", "b", "strong", "small", "li", "dt", "dd", "figcaption", "div"]);
const MULTILINE = new Set(["p", "li", "dd", "div"]);
// Stays code-only: FAQs (mirrored in JSON-LD), tables, prices/packages, calculator, form, navigation, buttons.
const LOCKED_TAGS = new Set(["table", "details", "form", "nav", "button", "select", "label", "svg"]);
const LOCKED_CLASSES = ["faqs", "pkg-grid", "pkg-note", "calc", "crumbs", "iso", "step-out", "hero-actions"];

export const hasClass = (props: Props, c: string) => String(props.className ?? "").split(" ").includes(c);

export function findNode(node: SvcNode, match: (n: ElementNode) => boolean): ElementNode | undefined {
  if (typeof node === "string") return undefined;
  if (match(node)) return node;
  for (const kid of node.slice(2) as SvcNode[]) {
    const hit = findNode(kid, match);
    if (hit) return hit;
  }
  return undefined;
}

export function renderNode(node: SvcNode, path: string, ctx: Ctx): ReactNode {
  if (typeof node === "string") return node;
  const custom = ctx.override?.(node, path, ctx);
  return custom !== undefined ? custom : renderElement(node, path, ctx);
}

/**
 * Renders one element. `extra` merges into its props; `kids` replaces its children.
 * Text-only leaves become EditableText and images EditableImage, keyed by tree path.
 */
export function renderElement(node: ElementNode, path: string, ctx: Ctx, extra?: Props, kids?: SvcNode[]): ReactNode {
  const [tag, props, ...children] = node;
  const key = `svc.${ctx.slug}.${path}`;
  const page = `service-${ctx.slug}`;

  if (tag === "img") {
    return (
      <EditableImage key={path} contentKey={key} src={imageUrl(String(props.src))} alt={String(props.alt ?? "")}
        className={props.className as string | undefined} page={page} label={`${ctx.label}: image ${path}`} />
    );
  }

  const editable = ctx.editable && !LOCKED_TAGS.has(tag) && !LOCKED_CLASSES.some((c) => hasClass(props, c));
  const content = kids ?? children;
  const text = !kids && content.length === 1 && typeof content[0] === "string" ? content[0] : null;
  if (editable && text?.trim() && EDIT_TAGS.has(tag) && Object.keys(props).every((k) => k === "className")) {
    const t = text.trim();
    // Edge spaces stay outside the editable element so a trimmed save cannot glue words together.
    return (
      <Fragment key={path}>
        {text.startsWith(" ") && " "}
        <EditableText as={tag as "span"} contentKey={key} fallback={t} value={ctx.get(key)}
          className={props.className as string | undefined} page={page} label={`${ctx.label}: ${t.slice(0, 48)}`}
          multiline={MULTILINE.has(tag)} />
        {text.endsWith(" ") && " "}
      </Fragment>
    );
  }

  const childCtx = { ...ctx, editable };
  const rendered = content.map((k, i) => renderNode(k, `${path}.${i}`, childCtx));
  const all = { ...props, ...extra };
  const href = all.href as string | undefined;
  if (tag === "a" && href?.startsWith("/")) {
    const { href: _href, ...rest } = all;
    return <Link key={path} to={href} {...rest}>{rendered}</Link>;
  }
  return createElement(tag, { key: path, ...all }, ...rendered);
}
