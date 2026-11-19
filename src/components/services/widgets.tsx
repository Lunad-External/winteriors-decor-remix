// Interactive parts of the reference pages, ported from their inline scripts.
import { useState, type FormEvent } from "react";
import { submitFormFn } from "@/lib/email.functions";
import { findNode, hasClass, renderElement, type Ctx, type ElementNode, type Override } from "./renderNode";

type WidgetProps = { node: ElementNode; path: string; ctx: Ctx };

const fmt = (n: number) => n.toLocaleString("en-US");
const RATES = { budget: 2500, executive: 3500, premium: 6000 } as const; // AED per sqm, from the reference
type Finish = keyof typeof RATES;

/** Package card: finish chips update the price, "See details" toggles the layout list. */
export function PackageCard({ node, path, ctx, onQuote }: WidgetProps & { onQuote: (size: string, finish?: string) => void }) {
  const [finish, setFinish] = useState<Finish>("budget");
  const [open, setOpen] = useState(false);
  const sqm = Number(node[1]["data-sqm"]);

  const override: Override = (n, p, c) => {
    const props = n[1];
    if (hasClass(props, "chip")) {
      const f = props["data-finish"] as Finish;
      const on = f === finish;
      return renderElement(n, p, c, { className: on ? "chip is-on" : "chip", "aria-pressed": String(on), onClick: () => setFinish(f) });
    }
    if (hasClass(props, "price-val")) return renderElement(n, p, c, {}, [`from AED ${fmt(RATES[finish])} / sqm`]);
    if (hasClass(props, "price-total")) return renderElement(n, p, c, {}, [`Approx. AED ${fmt(sqm * RATES[finish])} for ${fmt(sqm)} sqm`]);
    if (hasClass(props, "pkg-more")) return renderElement(n, p, c, { hidden: !open });
    if (hasClass(props, "js-more")) {
      return renderElement(n, p, c, { "aria-expanded": String(open), onClick: () => setOpen(!open) }, [open ? "Hide details" : "See details"]);
    }
    if (hasClass(props, "js-quote")) return renderElement(n, p, c, { onClick: () => onQuote(`${fmt(sqm)} sqm`, finish) });
    return undefined;
  };
  return renderElement(node, path, { ...ctx, override });
}

/** Office size calculator (space planning). */
export function OfficeCalculator({ node, path, ctx }: WidgetProps) {
  const initial = (id: string) => String(findNode(node, (n) => n[1].id === id)?.[1].defaultValue ?? "");
  const [vals, setVals] = useState(() => ({ "c-staff": initial("c-staff"), "c-style": initial("c-style"), "c-grow": initial("c-grow") }));

  const n = Math.max(1, Number(vals["c-staff"]) || 0);
  const [a, b] = vals["c-style"].split(",").map(Number);
  const g = 1 + Number(vals["c-grow"]);
  const lo = Math.round((n * g * a) / 10) * 10;
  const hi = Math.round((n * g * b) / 10) * 10;

  const override: Override = (el, p, c) => {
    const id = el[1].id as string | undefined;
    if (id && id in vals) {
      return renderElement(el, p, c, {
        value: vals[id as keyof typeof vals],
        defaultValue: undefined,
        onChange: (e: { target: { value: string } }) => setVals((v) => ({ ...v, [id]: e.target.value })),
      });
    }
    if (id === "c-out") return renderElement(el, p, c, {}, [`${fmt(lo)} - ${fmt(hi)} sqm`]);
    if (id === "c-note") return renderElement(el, p, c, {}, [`For ${Math.round(n * g)} people at ${a}-${b} sqm per person`]);
    return undefined;
  };
  return renderElement(node, path, { ...ctx, override });
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const labelOf = (form: HTMLFormElement, el: Field) => form.querySelector(`label[for="${el.id}"]`)?.textContent ?? el.name;

/** Enquiry form: same validation as the reference, sent through the site's existing submitFormFn. */
export function EnquiryForm({ node, path, ctx, source }: WidgetProps & { source: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = [...form.querySelectorAll<Field>("input, select, textarea")];
    const missing = fields.filter((i) => i.required && (!i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value))));
    if (missing.length) {
      setStatus(`Please add your ${missing.map((i) => labelOf(form, i).toLowerCase()).join(", ")}.`);
      missing[0].focus();
      return;
    }
    const value = (name: string) => (form.elements.namedItem(name) as Field | null)?.value.trim() ?? "";
    // The enquiries table has no columns for these, so they go at the top of the message.
    const details = fields
      .filter((f): f is HTMLSelectElement => f instanceof HTMLSelectElement)
      .map((s) => `${labelOf(form, s)}: ${s.value ? s.selectedOptions[0].text : "Not specified"}`);
    const message = [`Page: ${source}`, ...details, "", value("message")].join("\n").trim();

    setSending(true);
    try {
      await submitFormFn({
        data: { name: value("name"), email: value("email"), phone: value("phone"), company: value("company") || undefined, message, type: "Enquiry" },
      });
      setStatus("Thank you. Your enquiry has been sent and a designer will contact you shortly.");
      form.reset();
    } catch {
      setStatus("Sorry, your enquiry could not be sent. Please try again or call us.");
    } finally {
      setSending(false);
    }
  };

  const override: Override = (n, p, c) => {
    if (hasClass(n[1], "form-ok")) return renderElement(n, p, c, { className: status ? "form-ok show" : "form-ok" }, status ? [status] : []);
    if (n[0] === "button" && n[1].type === "submit") return renderElement(n, p, c, { disabled: sending });
    return undefined;
  };
  return renderElement(node, path, { ...ctx, override }, { onSubmit });
}
