import { createFileRoute } from "@tanstack/react-router";
import Enquiry from "@/pages/Enquiry";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/enquiry")({
  head: () => ({
    meta: [
      { title: "Project Enquiry | Winteriors Decor LLC" },
      {
        name: "description",
        content:
          "Submit your interior design or fit-out project enquiry to Winteriors Decor LLC.",
      },
      { property: "og:title", content: "Project Enquiry — Winteriors Decor" },
        { property: "og:url", content: absoluteUrl("/enquiry") },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/enquiry") }],
  }),
  component: Enquiry,
});
