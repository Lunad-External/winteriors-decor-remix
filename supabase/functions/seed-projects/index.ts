import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ROOT_FOLDER_ID = "1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k";
const DRIVE_API = "https://www.googleapis.com/drive/v3";

interface DriveFile { id: string; name: string; mimeType: string; }

async function listAll(apiKey: string, query: string): Promise<DriveFile[]> {
  const all: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      q: query, key: apiKey, fields: "files(id,name,mimeType),nextPageToken",
      pageSize: "1000", orderBy: "name",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`${DRIVE_API}/files?${params}`);
    if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    all.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return all;
}

// Recursively find all image files at any depth (up to maxDepth levels)
async function findAllImages(apiKey: string, folderId: string, maxDepth = 5, depth = 0): Promise<DriveFile[]> {
  if (depth > maxDepth) return [];
  
  const images = await listAll(apiKey,
    `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`);
  
  const subFolders = await listAll(apiKey,
    `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  
  for (const sub of subFolders) {
    const subImages = await findAllImages(apiKey, sub.id, maxDepth, depth + 1);
    images.push(...subImages);
  }
  
  return images;
}

function slugify(t: string): string {
  return t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!GOOGLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const url = new URL(req.url);
  const categoryFilter = url.searchParams.get("category");

  try {
    const categoryFolders = await listAll(GOOGLE_API_KEY,
      `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);

    const categoriesToProcess = categoryFilter
      ? categoryFolders.filter(f => slugify(f.name) === categoryFilter)
      : categoryFolders;

    console.log(`Processing ${categoriesToProcess.length} categories: ${categoriesToProcess.map(f => f.name).join(', ')}`);

    const projects: Array<{
      slug: string; title: string; category: string;
      drive_folder_id: string; cover_path: string; image_count: number;
    }> = [];

    for (const catFolder of categoriesToProcess) {
      const projectFolders = await listAll(GOOGLE_API_KEY,
        `'${catFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);

      console.log(`  ${catFolder.name}: ${projectFolders.length} project folders`);

      // Process in parallel batches of 5
      for (let i = 0; i < projectFolders.length; i += 5) {
        const batch = projectFolders.slice(i, i + 5);
        const results = await Promise.all(batch.map(async (projFolder) => {
          try {
            // Deep recursive scan for all images
            const imageFiles = await findAllImages(GOOGLE_API_KEY, projFolder.id);

            if (imageFiles.length === 0) {
              console.log(`    Skipping ${projFolder.name} (no images)`);
              return null;
            }

            console.log(`    ${projFolder.name}: ${imageFiles.length} images`);
            return {
              slug: slugify(projFolder.name),
              title: projFolder.name,
              category: slugify(catFolder.name),
              drive_folder_id: projFolder.id,
              cover_path: `https://lh3.googleusercontent.com/d/${imageFiles[0].id}=s0`,
              image_count: imageFiles.length,
            };
          } catch (e) {
            console.error(`    Error processing ${projFolder.name}:`, e);
            return null;
          }
        }));
        projects.push(...results.filter(Boolean) as any[]);
      }
    }

    // Upsert all
    if (projects.length > 0) {
      const { error } = await supabase.from("projects").upsert(
        projects.map(p => ({ ...p, updated_at: new Date().toISOString() })),
        { onConflict: "slug" }
      );
      if (error) throw error;
    }

    console.log(`Seeded ${projects.length} projects`);

    return new Response(JSON.stringify({
      seeded: projects.length,
      projects: projects.map(p => ({ slug: p.slug, category: p.category, images: p.image_count })),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("seed-projects error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
