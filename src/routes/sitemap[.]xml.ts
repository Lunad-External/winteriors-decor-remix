import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { blogs } from "@/data/blogs";
import { serviceHierarchy } from "@/data/serviceHierarchy";
import { supabase } from "@/integrations/supabase/client";
import { getStorageProjectsFn, type StorageProjectDTO } from "@/lib/public-data.functions";
import { SITE_URL } from "@/lib/seo";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/projects", changefreq: "weekly", priority: "0.9" },
          { path: "/clientele", changefreq: "monthly", priority: "0.7" },
          { path: "/blogs", changefreq: "weekly", priority: "0.8" },
          { path: "/contact", changefreq: "yearly", priority: "0.6" },
          { path: "/enquiry", changefreq: "yearly", priority: "0.6" },
        ];

        // DB reads mirror the public pages; a failed read drops only that group, never the whole sitemap.
        const loadDbBlogs = async () => {
          const { data } = await supabase.from("blogs").select("slug").eq("is_published", true);
          return (data ?? []) as { slug: string }[];
        };
        const [projects, dbBlogs] = await Promise.all([
          getStorageProjectsFn().catch((): StorageProjectDTO[] => []),
          loadDbBlogs().catch((): { slug: string }[] => []),
        ]);

        const serviceEntries: SitemapEntry[] = serviceHierarchy.flatMap((cat) => [
          { path: `/services/${cat.slug}`, changefreq: "monthly", priority: "0.8" },
          ...cat.subcategories.map((sub): SitemapEntry => ({
            path: `/services/${cat.slug}/${sub.slug}`,
            changefreq: "monthly",
            priority: "0.7",
          })),
        ]);

        const projectEntries: SitemapEntry[] = projects.map((p): SitemapEntry => ({
          path: `/projects/${p.id}`,
          changefreq: "monthly",
          priority: "0.7",
        }));

        const blogSlugs = [...blogs.map((b) => b.slug), ...dbBlogs.map((b) => b.slug)];
        const blogEntries: SitemapEntry[] = blogSlugs.map((slug): SitemapEntry => ({
          path: `/blogs/${slug}`,
          changefreq: "monthly",
          priority: "0.6",
        }));

        const seen = new Set<string>();
        const entries = [...staticEntries, ...serviceEntries, ...projectEntries, ...blogEntries].filter(
          (e) => !seen.has(e.path) && seen.add(e.path),
        );

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
