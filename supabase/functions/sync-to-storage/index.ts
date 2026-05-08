import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const ROOT_FOLDER_ID = "1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k";
const BUCKET = "project-images";

interface DriveFile { id: string; name: string; mimeType: string; }

async function listDriveFiles(apiKey: string, query: string): Promise<DriveFile[]> {
  const all: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      q: query, key: apiKey,
      fields: "files(id,name,mimeType),nextPageToken",
      pageSize: "1000", orderBy: "name",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`${DRIVE_API}/files?${params}`);
    if (!res.ok) throw new Error(`Drive API [${res.status}]: ${await res.text()}`);
    const data = await res.json();
    all.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return all;
}

async function findImages(apiKey: string, folderId: string, depth = 0): Promise<DriveFile[]> {
  if (depth > 5) return [];
  const images = await listDriveFiles(apiKey, `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`);
  const subs = await listDriveFiles(apiKey, `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  for (const sub of subs) images.push(...(await findImages(apiKey, sub.id, depth + 1)));
  return images;
}

function slugify(t: string): string {
  return t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function download(fileId: string): Promise<{ data: Uint8Array; ct: string } | null> {
  try {
    const res = await fetch(`https://lh3.googleusercontent.com/d/${fileId}=s0`);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 100) return null;
    return { data: new Uint8Array(buf), ct: res.headers.get("content-type") || "image/jpeg" };
  } catch { return null; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!GOOGLE_API_KEY) return new Response(JSON.stringify({ error: "GOOGLE_API_KEY not set" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body.action as string || "sync-next";

    // ACTION: scan — Just scan Google Drive structure and upsert to DB
    if (action === "scan") {
      const catFolders = await listDriveFiles(GOOGLE_API_KEY, `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
      const projects: any[] = [];
      for (const cf of catFolders) {
        const category = slugify(cf.name);
        const pFolders = await listDriveFiles(GOOGLE_API_KEY, `'${cf.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
        for (const pf of pFolders) {
          const slug = slugify(pf.name);
          projects.push({ slug, title: pf.name, category, folderId: pf.id });
          await supabase.from("projects").upsert({ slug, title: pf.name, category, drive_folder_id: pf.id }, { onConflict: "slug" });
        }
      }
      // Check which are synced
      const { data: synced } = await supabase.from("project_images").select("project_slug");
      const syncedSet = new Set((synced || []).map((r: any) => r.project_slug));
      return new Response(JSON.stringify({
        total: projects.length,
        synced: projects.filter(p => syncedSet.has(p.slug)).length,
        unsynced: projects.filter(p => !syncedSet.has(p.slug)).map(p => p.slug),
        projects: projects.map(p => ({ ...p, synced: syncedSet.has(p.slug) })),
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ACTION: sync-one — Sync a specific project by slug (uses DB drive_folder_id)
    if (action === "sync-one" && body.slug) {
      const { data: proj } = await supabase.from("projects").select("*").eq("slug", body.slug).maybeSingle();
      if (!proj || !proj.drive_folder_id) {
        return new Response(JSON.stringify({ error: "Project not found or no drive_folder_id" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Delete existing images if re-syncing
      await supabase.from("project_images").delete().eq("project_slug", proj.slug);

      const images = await findImages(GOOGLE_API_KEY, proj.drive_folder_id);
      const records: any[] = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const ext = img.name.split(".").pop()?.toLowerCase() || "jpg";
        const storagePath = `${proj.slug}/${String(i).padStart(3, "0")}_${slugify(img.name.replace(/\.[^.]+$/, ""))}.${ext}`;
        const dl = await download(img.id);
        if (!dl) continue;
        const { error } = await supabase.storage.from(BUCKET).upload(storagePath, dl.data, { contentType: dl.ct, upsert: true });
        if (error) { console.error(`Upload err ${storagePath}:`, error.message); continue; }
        records.push({ project_slug: proj.slug, file_name: img.name, storage_path: storagePath, sort_order: i });
      }

      if (records.length > 0) {
        await supabase.from("project_images").insert(records);
        await supabase.from("projects").update({ cover_path: records[0].storage_path, image_count: records.length }).eq("slug", proj.slug);
      }

      return new Response(JSON.stringify({ slug: proj.slug, images: records.length, total_drive: images.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ACTION: sync-next — Find next unsynced project from DB and sync it
    if (action === "sync-next") {
      const max = Math.min(body.max || 1, 3);
      const { data: allProjects } = await supabase.from("projects").select("slug, drive_folder_id").not("drive_folder_id", "is", null);
      const { data: synced } = await supabase.from("project_images").select("project_slug");
      const syncedSet = new Set((synced || []).map((r: any) => r.project_slug));
      
      const unsynced = (allProjects || []).filter((p: any) => !syncedSet.has(p.slug));
      if (unsynced.length === 0) {
        return new Response(JSON.stringify({ message: "All projects synced!", remaining: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const batch = unsynced.slice(0, max);
      const results: any[] = [];

      for (const proj of batch) {
        console.log(`Syncing ${proj.slug}...`);
        const images = await findImages(GOOGLE_API_KEY, proj.drive_folder_id);
        const records: any[] = [];

        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const ext = img.name.split(".").pop()?.toLowerCase() || "jpg";
          const storagePath = `${proj.slug}/${String(i).padStart(3, "0")}_${slugify(img.name.replace(/\.[^.]+$/, ""))}.${ext}`;
          const dl = await download(img.id);
          if (!dl) continue;
          const { error } = await supabase.storage.from(BUCKET).upload(storagePath, dl.data, { contentType: dl.ct, upsert: true });
          if (error) continue;
          records.push({ project_slug: proj.slug, file_name: img.name, storage_path: storagePath, sort_order: i });
        }

        if (records.length > 0) {
          await supabase.from("project_images").insert(records);
          await supabase.from("projects").update({ cover_path: records[0].storage_path, image_count: records.length }).eq("slug", proj.slug);
        }
        results.push({ slug: proj.slug, images: records.length });
        console.log(`Done ${proj.slug}: ${records.length} images`);
      }

      return new Response(JSON.stringify({ processed: results, remaining: unsynced.length - batch.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ACTION: fix-covers — Update cover_path for already-synced projects to use storage paths
    if (action === "fix-covers") {
      const { data: projects } = await supabase.from("projects").select("slug, cover_path");
      const { data: images } = await supabase.from("project_images").select("project_slug, storage_path, sort_order").order("sort_order");
      
      const coverMap = new Map<string, string>();
      for (const img of (images || [])) {
        if (!coverMap.has(img.project_slug)) coverMap.set(img.project_slug, img.storage_path);
      }

      let fixed = 0;
      for (const proj of (projects || [])) {
        const storageCover = coverMap.get(proj.slug);
        if (storageCover && proj.cover_path !== storageCover) {
          await supabase.from("projects").update({ cover_path: storageCover }).eq("slug", proj.slug);
          fixed++;
        }
      }

      return new Response(JSON.stringify({ fixed, total: (projects || []).length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action. Use: scan, sync-one, sync-next, fix-covers" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: unknown) {
    console.error("sync-to-storage error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
