import { createFileRoute } from "@tanstack/react-router";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import path from "node:path";

// Node's default 250ms per-address connect timeout is too short for
// Google's image servers on slower networks (fetch fails with ETIMEDOUT)
setDefaultAutoSelectFamilyAttemptTimeout(2000);

// Images are cached on disk so each Drive file is downloaded once and
// survives server restarts/deploys. Override the location with IMAGE_CACHE_DIR.
const CACHE_DIR = process.env.IMAGE_CACHE_DIR || path.join(process.cwd(), ".cache", "drive-images");

// Drive originals are often 2-5 MB camera photos; serve a resized copy instead.
const DEFAULT_WIDTH = 1600;
const ALLOWED_WIDTHS = [400, 800, 1200, 1600, 2000];

interface DriveImage {
  data: Uint8Array;
  contentType: string;
}

// Concurrent requests for the same uncached image share one Drive download
const inFlight = new Map<string, Promise<DriveImage | null>>();

function pickWidth(requested: string | null): number {
  const w = Number(requested);
  if (!w) return DEFAULT_WIDTH;
  return ALLOWED_WIDTHS.find((allowed) => allowed >= w) ?? ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1];
}

async function readCache(key: string): Promise<DriveImage | null> {
  try {
    const file = path.join(CACHE_DIR, key);
    const [data, contentType] = await Promise.all([readFile(file), readFile(`${file}.type`, "utf8")]);
    return { data: new Uint8Array(data), contentType };
  } catch {
    return null;
  }
}

async function writeCache(key: string, image: DriveImage) {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const file = path.join(CACHE_DIR, key);
    // Write to a temp file then rename, so a crash never leaves a half-written image
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, image.data);
    await writeFile(`${file}.type`, image.contentType);
    await rename(tmp, file);
  } catch (err) {
    console.warn(`Drive image cache write failed for ${key}:`, err);
  }
}

async function fetchImage(url: string): Promise<DriveImage | null> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const contentType = res.headers.get("content-type") || "";
    // Drive answers private/missing files with an HTML page, so require an image
    if (!res.ok || !contentType.startsWith("image/")) return null;
    return { data: new Uint8Array(await res.arrayBuffer()), contentType };
  } catch (err) {
    console.warn(`Drive image fetch failed for ${url}:`, err);
    return null;
  }
}

async function fetchFromDrive(fileId: string, width: number): Promise<DriveImage | null> {
  return (
    (await fetchImage(`https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`)) ??
    // Fall back to the full original if Drive can't make a resized copy
    (await fetchImage(`https://drive.usercontent.google.com/download?id=${fileId}&export=view`)) ??
    (await fetchImage(`https://drive.google.com/uc?export=view&id=${fileId}`))
  );
}

async function getImage(fileId: string, width: number): Promise<{ image: DriveImage | null; hit: boolean }> {
  const key = `${fileId}_w${width}`;
  const cached = await readCache(key);
  if (cached) return { image: cached, hit: true };

  let pending = inFlight.get(key);
  if (!pending) {
    pending = fetchFromDrive(fileId, width).then(async (image) => {
      if (image) await writeCache(key, image);
      return image;
    });
    inFlight.set(key, pending);
    pending.finally(() => inFlight.delete(key));
  }
  return { image: await pending, hit: false };
}

export const Route = createFileRoute("/drive-image/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const fileId = params.id;
        if (!fileId || !/^[a-zA-Z0-9_-]{25,}$/.test(fileId)) {
          return new Response("Invalid Google Drive File ID", { status: 400 });
        }

        const width = pickWidth(new URL(request.url).searchParams.get("w"));
        const { image, hit } = await getImage(fileId, width);
        if (!image) {
          return new Response("Failed to fetch image from Google Drive", { status: 502 });
        }

        return new Response(image.data, {
          headers: {
            "Content-Type": image.contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Cache": hit ? "HIT" : "MISS",
          },
        });
      },
    },
  },
});
