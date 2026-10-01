import { createFileRoute } from "@tanstack/react-router";

// Server-side in-memory cache to make images load instantly after the first fetch
interface CachedImage {
  data: Uint8Array;
  contentType: string;
  timestamp: number;
}

const imageCache = new Map<string, CachedImage>();
const MAX_CACHE_ENTRIES = 100;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getFromCache(id: string): CachedImage | null {
  const item = imageCache.get(id);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    imageCache.delete(id);
    return null;
  }
  return item;
}

function setToCache(id: string, data: Uint8Array, contentType: string) {
  if (imageCache.size >= MAX_CACHE_ENTRIES) {
    // Evict oldest entry
    const oldestKey = imageCache.keys().next().value;
    if (oldestKey) imageCache.delete(oldestKey);
  }
  imageCache.set(id, { data, contentType, timestamp: Date.now() });
}

export const Route = createFileRoute("/drive-image/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const fileId = params.id;
        if (!fileId || !/^[a-zA-Z0-9_-]{25,}$/.test(fileId)) {
          return new Response("Invalid Google Drive File ID", { status: 400 });
        }

        // Return from in-memory RAM cache instantly if available (0ms load time)
        const cached = getFromCache(fileId);
        if (cached) {
          return new Response(cached.data, {
            headers: {
              "Content-Type": cached.contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
              "X-Cache": "HIT",
            },
          });
        }

        // Fetch from Google Drive usercontent endpoint
        const primaryUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=view`;
        try {
          const res = await fetch(primaryUrl);
          if (res.ok) {
            const contentType = res.headers.get("content-type") || "image/jpeg";
            const buffer = new Uint8Array(await res.arrayBuffer());
            
            // Cache in memory for instant subsequent loads
            setToCache(fileId, buffer, contentType);

            return new Response(buffer, {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Cache": "MISS",
              },
            });
          }
        } catch (err) {
          console.warn(`Drive proxy primary fetch failed for ID ${fileId}:`, err);
        }

        // Fallback to uc?export=view if primary fails
        const fallbackUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        try {
          const res = await fetch(fallbackUrl);
          if (res.ok) {
            const contentType = res.headers.get("content-type") || "image/jpeg";
            const buffer = new Uint8Array(await res.arrayBuffer());
            
            setToCache(fileId, buffer, contentType);

            return new Response(buffer, {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Cache": "MISS",
              },
            });
          }
        } catch (err) {
          console.warn(`Drive proxy fallback fetch failed for ID ${fileId}:`, err);
        }

        return new Response("Failed to fetch image from Google Drive", { status: 502 });
      },
    },
  },
});
