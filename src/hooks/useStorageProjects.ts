import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StorageProject {
  id: string;
  title: string;
  category: string;
  folder: string;
  coverImage: string;
  imageCount: number;
  images?: ProjectImage[];
}

export interface ProjectImage {
  name: string;
  url: string;
  thumbnail?: string;
}

const confidentialRenames: Record<string, string> = {
  "athar medical centre": "Confidential Project 6",
  "gal prestige office": "Confidential Project 7",
  "environmental intelligence hub": "Confidential Project 8",
};

function renameIfConfidential(title: string): string {
  const key = title.toLowerCase().trim();
  return confidentialRenames[key] || title;
}

function normalizeCategory(cat: string): string {
  // Convert "control-room" → "control room", keep others as-is
  return (cat || "").replace(/-/g, " ").toLowerCase().trim();
}

// Cache-bust replaced images (CDN caches 1 year). Bump key when replacing files.
const REPLACED_IMAGE_VERSION: Record<string, string> = {
  "confidential-project-01-1/13.jpg": "202605060850",
  "confidential-project-01-1/14.jpg": "202605060850",
  "confidential-project-01-1/15.jpg": "202605060850",
  "confidential-project-01-1/16.jpg": "202605060850",
  "confidential-project-01-1/23.jpg": "202605060850",
  "confidential-project-01-1/24.jpg": "202605060850",
  "environmental-intelligence-hub/09.jpg": "202605060850",
  "environmental-intelligence-hub/11.jpg": "202605060850",
  "environmental-intelligence-hub/12.jpg": "202605060850",
  "confidential-project-02/Meeting_room-1-5th_floor-v1.jpg": "202605060850",
  "confidential-project-02/Reception_op-1_-_v1.jpg": "202605060850",
  "confidential-project-02/Reception_op-1_-_v2.jpg": "202605060850",
};

function getStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const v = REPLACED_IMAGE_VERSION[path];
  const suffix = v ? `?v=${v}` : "";
  return `${baseUrl}/storage/v1/object/public/project-images/${path}${suffix}`;
}

export const storageCategories = ["All", "Offices", "Retail", "Education", "Control Room"];

export function prefetchProjectCovers(count = 8) {
  fetchFromDB().then(projects => {
    if (!projects) return;
    projects.slice(0, count).forEach(p => {
      if (!p.coverImage) return;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = p.coverImage;
      if (!document.querySelector(`link[href="${CSS.escape(p.coverImage)}"]`)) {
        document.head.appendChild(link);
      }
    });
  });
}

async function fetchFromDB(): Promise<StorageProject[] | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("slug, title, category, drive_folder_id, cover_path, image_count, status, deleted_at")

  if (error || !data || data.length === 0) return null;

  return data
    .filter((p: any) => p.image_count > 0 && p.cover_path && (p as any).status !== 'draft' && !(p as any).deleted_at)
    .map((p: any) => ({
      id: p.slug,
      title: renameIfConfidential(p.title),
      category: normalizeCategory(p.category),
      folder: p.drive_folder_id || p.slug,
      coverImage: p.cover_path ? getStorageUrl(p.cover_path) : "",
      imageCount: p.image_count || 0,
    }));
}

export function useStorageProjects() {
  const [projects, setProjects] = useState<StorageProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const dbProjects = await fetchFromDB();
        if (dbProjects && dbProjects.length > 0 && !cancelled) {
          setProjects(dbProjects);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.error("Error loading projects:", err);
        if (!cancelled) {
          setError(err.message);
        }
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, error };
}

export function useProjectImages(folder: string) {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!folder) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const normalizedFolder = folder.trim();
        const { data: project } = await supabase
          .from("projects")
          .select("slug")
          .or(`drive_folder_id.eq.${normalizedFolder},slug.eq.${normalizedFolder}`)
          .limit(1)
          .maybeSingle();

        if (project) {
          const { data: imgData } = await supabase
            .from("project_images")
            .select("file_name, storage_path, sort_order")
            .eq("project_slug", project.slug)
            .order("sort_order");

          if (imgData && imgData.length > 0 && !cancelled) {
            setImages(imgData.map((img: any) => ({
              name: img.file_name,
              url: getStorageUrl(img.storage_path),
              thumbnail: getStorageUrl(img.storage_path),
            })));
          }
          // Project found in DB — trust it (even if no images synced yet)
          if (!cancelled) setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Image fetch failed:", err);
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [folder]);

  return { images, loading };
}
