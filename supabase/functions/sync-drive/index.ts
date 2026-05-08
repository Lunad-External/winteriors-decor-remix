import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ROOT_FOLDER_ID = "1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const BUCKET = "project-images";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

async function listAll(apiKey: string, query: string, fields = "files(id,name,mimeType),nextPageToken"): Promise<DriveFile[]> {
  const all: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({ q: query, key: apiKey, fields, pageSize: "1000", orderBy: "name" });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`${DRIVE_API}/files?${params}`);
    if (!res.ok) throw new Error(`Drive API error [${res.status}]: ${await res.text()}`);
    const data: DriveListResponse = await res.json();
    all.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return all;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function driveDownloadUrl(fileId: string, width = 1200): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!GOOGLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing required env vars" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Parse optional params
  let limitProjects = 3;
  let targetSlug: string | null = null;
  try {
    const body = await req.json();
    if (body.limit) limitProjects = Math.min(body.limit, 20);
    if (body.project) targetSlug = body.project;
  } catch { /* no body is fine */ }

  try {
    // Step 1: Scan Drive for all projects
    const categoryFolders = await listAll(
      GOOGLE_API_KEY,
      `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
    );

    const driveProjects: Array<{
      slug: string; title: string; category: string;
      folderId: string; images: Array<{ id: string; name: string }>;
    }> = [];

    for (const catFolder of categoryFolders) {
      const projectFolders = await listAll(
        GOOGLE_API_KEY,
        `'${catFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
      );

      for (const projFolder of projectFolders) {
        const slug = slugify(projFolder.name);
        if (targetSlug && slug !== targetSlug) continue;

        const imageFiles = await listAll(
          GOOGLE_API_KEY,
          `'${projFolder.id}' in parents and mimeType contains 'image/' and trashed=false`,
          "files(id,name,mimeType),nextPageToken"
        );

        if (imageFiles.length === 0) continue;

        driveProjects.push({
          slug,
          title: projFolder.name,
          category: slugify(catFolder.name),
          folderId: projFolder.id,
          images: imageFiles.map(f => ({ id: f.id, name: f.name })),
        });
      }
    }

    // Step 2: Get already-synced projects from DB
    const { data: existingProjects } = await supabase
      .from("projects")
      .select("slug, image_count");
    const existingMap = new Map((existingProjects || []).map((p: any) => [p.slug, p.image_count]));

    // Step 3: Find projects that need syncing (new or image count changed)
    const needsSync = driveProjects.filter(p => {
      const existing = existingMap.get(p.slug);
      return existing === undefined || existing !== p.images.length;
    });

    const toProcess = targetSlug ? needsSync : needsSync.slice(0, limitProjects);
    const results: Array<{ slug: string; status: string; images: number }> = [];

    for (const project of toProcess) {
      try {
        // Upsert project metadata
        const coverPath = `${project.slug}/cover.jpg`;
        await supabase.from("projects").upsert({
          slug: project.slug,
          title: project.title,
          category: project.category,
          drive_folder_id: project.folderId,
          cover_path: coverPath,
          image_count: project.images.length,
          updated_at: new Date().toISOString(),
        }, { onConflict: "slug" });

        // Get existing images for this project
        const { data: existingImages } = await supabase
          .from("project_images")
          .select("file_name")
          .eq("project_slug", project.slug);
        const existingFileNames = new Set((existingImages || []).map((i: any) => i.file_name));

        // Download and upload each image
        let sortOrder = 0;
        for (const img of project.images) {
          const safeName = img.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `${project.slug}/${safeName}`;

          if (existingFileNames.has(safeName)) {
            sortOrder++;
            continue;
          }

          try {
            // Download from Google CDN
            const imgRes = await fetch(driveDownloadUrl(img.id, sortOrder === 0 ? 1920 : 1200));
            if (!imgRes.ok) {
              console.warn(`Failed to download ${img.name}: ${imgRes.status}`);
              sortOrder++;
              continue;
            }

            const blob = await imgRes.blob();
            const contentType = imgRes.headers.get("content-type") || "image/jpeg";

            // Upload to storage
            const { error: uploadErr } = await supabase.storage
              .from(BUCKET)
              .upload(storagePath, blob, {
                contentType,
                upsert: true,
              });

            if (uploadErr) {
              console.warn(`Upload error for ${storagePath}:`, uploadErr.message);
              sortOrder++;
              continue;
            }

            // If this is the first image, also save as cover
            if (sortOrder === 0) {
              await supabase.storage
                .from(BUCKET)
                .upload(coverPath, blob, { contentType, upsert: true });
            }

            // Insert image record
            await supabase.from("project_images").upsert({
              project_slug: project.slug,
              file_name: safeName,
              storage_path: storagePath,
              sort_order: sortOrder,
            }, { onConflict: "project_slug,file_name" });
          } catch (imgErr) {
            console.warn(`Error processing image ${img.name}:`, imgErr);
          }

          sortOrder++;
        }

        results.push({ slug: project.slug, status: "synced", images: project.images.length });
      } catch (projErr) {
        console.error(`Error syncing project ${project.slug}:`, projErr);
        results.push({ slug: project.slug, status: "error", images: 0 });
      }
    }

    const totalInDrive = driveProjects.length;
    const totalSynced = existingMap.size;
    const remaining = needsSync.length - toProcess.length;

    return new Response(JSON.stringify({
      processed: results,
      summary: {
        totalInDrive,
        totalSynced: totalSynced + results.filter(r => r.status === "synced").length,
        remaining,
        done: remaining === 0 && results.every(r => r.status === "synced"),
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("sync-drive error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
