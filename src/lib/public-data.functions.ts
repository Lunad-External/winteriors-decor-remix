import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { executeDbQuery } from "@/lib/db.server";

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

const PROJECT_ASSET_MAP: Record<string, string> = {
  "bens-cookies": "/src/assets/project-retail.jpg",
  "gulf-tech": "/src/assets/project-corporate.jpg",
  "all-energy-services-aes": "/src/assets/project-openplan.jpg",
  "sts-library": "/src/assets/project-library.jpg",
  "alpha-data": "/src/assets/gallery-boardroom.jpg",
  "rais-hassan-saadi": "/src/assets/bg-corporate-office.jpg",
  "adveti-library": "/src/assets/project-library.jpg",
  "alpha-data-phase-2": "/src/assets/bg-modern-workspace.jpg",
  "bens-cookies-phase-2": "/src/assets/project-boutique.jpg",
  "bens-cookies-phase-3": "/src/assets/bg-retail-space.jpg",
  "network-operations-center": "/src/assets/project-hotel-lobby.jpg",
  "command-control-center": "/src/assets/project-clinic.jpg",
  "emirates-group-office": "/src/assets/bg-conference-room.jpg",
  "training-academy": "/src/assets/bg-hotel-lobby.jpg",
  "tech-hub-innovation-center": "/src/assets/project-hospitality.jpg",
};

function renameIfConfidential(title: string): string {
  return confidentialRenames[title.toLowerCase().trim()] || title;
}
import { getStorageUrl } from "@/lib/storage";

function normalizeCategory(cat: string): string {
  return (cat || "").replace(/-/g, " ").toLowerCase().trim();
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
    const { data } = await executeDbQuery({
      table: "site_content",
      action: "select",
      columns: "key, value",
    });
    const map: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      if (row.key && row.value != null) map[row.key] = row.value as string;
    });
    return map;
  },
);

export const getStorageProjectsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<StorageProjectDTO[]> => {
    const { data, error } = await executeDbQuery({
      table: "projects",
      action: "select",
      columns: "slug, title, category, drive_folder_id, cover_path, image_count, status, deleted_at",
    });
    if (error || !data) return [];
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
        coverImage: getStorageUrl(p.cover_path),
        imageCount: p.image_count || 0,
      }));
  },
);

export const getProjectImagesFn = createServerFn({ method: "GET" })
  .validator((input) => z.object({ folder: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<ProjectImageDTO[]> => {
    const folder = data.folder.trim();
    const { data: projects } = await executeDbQuery({
      table: "projects",
      action: "select",
      columns: "slug",
      orConditions: `drive_folder_id.eq.${folder},slug.eq.${folder}`,
      limit: 1,
    });
    const project = projects?.[0];
    if (!project) return [];

    const { data: imgs } = await executeDbQuery({
      table: "project_images",
      action: "select",
      columns: "file_name, storage_path, sort_order",
      filters: [{ column: "project_slug", op: "eq", value: project.slug }],
      order: [{ column: "sort_order", ascending: true }],
    });

    return (imgs || []).map((img: any) => ({
      name: img.file_name,
      url: getStorageUrl(img.storage_path),
      thumbnail: getStorageUrl(img.storage_path),
    }));
  });

export const getProjectCmsFn = createServerFn({ method: "GET" })
  .validator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<ProjectCmsDTO | null> => {
    const { data: rows } = await executeDbQuery({
      table: "projects",
      action: "select",
      columns: "short_description, long_description, client_name, location, project_type",
      filters: [{ column: "slug", op: "eq", value: data.slug }],
      limit: 1,
    });
    return (rows?.[0] as ProjectCmsDTO) ?? null;
  });
