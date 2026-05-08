import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ROOT_FOLDER_ID = "1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k";
const DRIVE_API = "https://www.googleapis.com/drive/v3";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

async function listAll(
  apiKey: string,
  query: string,
  fields = "files(id,name,mimeType),nextPageToken"
): Promise<DriveFile[]> {
  const all: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: query,
      key: apiKey,
      fields,
      pageSize: "1000",
      orderBy: "name",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${DRIVE_API}/files?${params}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Drive API error [${res.status}]: ${text}`);
    }
    const data: DriveListResponse = await res.json();
    all.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return all;
}

// Recursively find all image files in a folder and all its subfolders (unlimited depth)
async function findAllImages(
  apiKey: string,
  folderId: string,
  maxDepth = 5,
  currentDepth = 0
): Promise<DriveFile[]> {
  if (currentDepth > maxDepth) return [];

  // Get images directly in this folder
  const images = await listAll(
    apiKey,
    `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
    "files(id,name,mimeType),nextPageToken"
  );

  // Get subfolders and recurse
  const subFolders = await listAll(
    apiKey,
    `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );

  for (const sub of subFolders) {
    const subImages = await findAllImages(apiKey, sub.id, maxDepth, currentDepth + 1);
    images.push(...subImages);
  }

  return images;
}

function driveImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=s0`;
}

function driveThumbnailUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
  if (!GOOGLE_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GOOGLE_API_KEY is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Step 1: List category folders under root
    const categoryFolders = await listAll(
      GOOGLE_API_KEY,
      `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
    );

    const projects: any[] = [];

    // Step 2: For each category, list project folders
    for (const catFolder of categoryFolders) {
      const category = catFolder.name;

      const projectFolders = await listAll(
        GOOGLE_API_KEY,
        `'${catFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
      );

      // Step 3: For each project, recursively find ALL image files at any depth
      for (const projFolder of projectFolders) {
        const imageFiles = await findAllImages(GOOGLE_API_KEY, projFolder.id);

        if (imageFiles.length === 0) continue;

        const images = imageFiles.map((f) => ({
          name: f.name,
          url: driveImageUrl(f.id),
          thumbnail: driveThumbnailUrl(f.id),
        }));

        projects.push({
          id: slugify(projFolder.name),
          title: projFolder.name,
          category: slugify(category),
          folder: projFolder.id,
          cover: images[0]?.url || "",
          imageCount: images.length,
          images,
        });
      }
    }

    return new Response(JSON.stringify({ projects }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("scan-drive error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
