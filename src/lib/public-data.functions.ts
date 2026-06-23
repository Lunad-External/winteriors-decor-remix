import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const confidentialRenames: Record<string, string> = {
  "athar medical centre": "Confidential Project 6",
  "gal prestige office": "Confidential Project 7",
  "environmental intelligence hub": "Confidential Project 8",
};

const REPLACED_IMAGE_VERSION: Record<string, string> = {
  "confidential-project-01-1/13.jpg": "202606221810",
  "confidential-project-01-1/14.jpg": "202606230036",
  "confidential-project-01-1/15.jpg": "202606221810",
  "confidential-project-01-1/16.jpg": "202606230036",
  "environmental-intelligence-hub/07.jpg": "202606221810",
  "environmental-intelligence-hub/08.jpg": "202606221810",
  "environmental-intelligence-hub/09.jpg": "202606221810",
  "environmental-intelligence-hub/11.jpg": "202606221810",
  "environmental-intelligence-hub/12.jpg": "202606221810",
  "confidential-project-02/Meeting_room-1-5th_floor-v1.jpg": "202606221810",
};

function renameIfConfidential(title: string): string {
  return confidentialRenames[title.toLowerCase().trim()] || title;
}
function normalizeCategory(cat: string): string {
  return (cat || "").replace(/-/g, " ").toLowerCase().trim();
}
function getBaseUrl(): string {
  return (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://yyvcgmnmhoufcxtuyzpk.supabase.co"
  );
}
function getStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const v = REPLACED_IMAGE_VERSION[path];
  const suffix = v ? `?v=${v}` : "";
  return `${getBaseUrl()}/storage/v1/object/public/project-images/${path}${suffix}`;
}

function getServerSupabase() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://yyvcgmnmhoufcxtuyzpk.supabase.co";
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export interface StorageProjectDTO {
  id: string;
  title: string;
  category: string;
  folder: string;
  coverImage: string;
  imageCount: number;
}

export interface ProjectImageDTO {
  name: string;
  url: string;
  thumbnail: string;
}

export interface ProjectCmsDTO {
  short_description: string | null;
  long_description: string | null;
  client_name: string | null;
  location: string | null;
  project_type: string | null;
}

export const getSiteContentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, string>> => {
    const supabase = getServerSupabase();
    const { data } = await supabase.from("site_content").select("key, value");
    const map: Record<string, string> = {};
    (data || []).forEach((row) => {
      if (row.key && row.value != null) map[row.key] = row.value as string;
    });
    return map;
  },
);

export const getStorageProjectsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<StorageProjectDTO[]> => {
    try {
      const supabase = getServerSupabase();
      const { data, error } = await supabase
        .from("projects")
        .select(
          "slug, title, category, drive_folder_id, cover_path, image_count, status, deleted_at",
        );
      try { (await import("fs")).writeFileSync("/tmp/spf.log", JSON.stringify({ count: data?.length, error, url: process.env.SUPABASE_URL?.slice(0,40), keyLen: process.env.SUPABASE_PUBLISHABLE_KEY?.length, viteUrl: process.env.VITE_SUPABASE_URL?.slice(0,40), sample: data?.[0] }, null, 2)); } catch {}
      console.error("[getStorageProjectsFn]", { count: data?.length, error });

      if (error) {

        console.error("getStorageProjectsFn supabase error:", error);
        return [];
      }
      if (!data) return [];
      return data
        .filter(
          (p: any) =>
            p.image_count > 0 &&
            p.cover_path &&
            p.status !== "draft" &&
            !p.deleted_at,
        )
        .map((p: any) => ({
          id: p.slug,
          title: renameIfConfidential(p.title),
          category: normalizeCategory(p.category),
          folder: p.drive_folder_id || p.slug,
          coverImage: p.cover_path ? getStorageUrl(p.cover_path) : "",
          imageCount: p.image_count || 0,
        }));
    } catch (e) {
      console.error("getStorageProjectsFn threw:", e);
      return [];
    }
  },
);


export const getProjectImagesFn = createServerFn({ method: "GET" })
  .validator((input) => z.object({ folder: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<ProjectImageDTO[]> => {
    const supabase = getServerSupabase();
    const folder = data.folder.trim();
    const { data: project } = await supabase
      .from("projects")
      .select("slug")
      .or(`drive_folder_id.eq.${folder},slug.eq.${folder}`)
      .limit(1)
      .maybeSingle();
    if (!project) return [];
    const { data: imgs } = await supabase
      .from("project_images")
      .select("file_name, storage_path, sort_order")
      .eq("project_slug", project.slug)
      .order("sort_order");
    return (imgs || []).map((img: any) => ({
      name: img.file_name,
      url: getStorageUrl(img.storage_path),
      thumbnail: getStorageUrl(img.storage_path),
    }));
  });

export const getProjectCmsFn = createServerFn({ method: "GET" })
  .validator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<ProjectCmsDTO | null> => {
    const supabase = getServerSupabase();
    const { data: row } = await supabase
      .from("projects")
      .select(
        "short_description, long_description, client_name, location, project_type",
      )
      .eq("slug", data.slug)
      .maybeSingle();
    return (row as ProjectCmsDTO) ?? null;
  });
