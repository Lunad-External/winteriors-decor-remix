import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/drive-image/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const fileId = params.id;
        if (!fileId || !/^[a-zA-Z0-9_-]{25,}$/.test(fileId)) {
          return new Response("Invalid Google Drive File ID", { status: 400 });
        }

        // Try direct usercontent endpoint first
        const primaryUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=view`;
        try {
          const res = await fetch(primaryUrl);
          if (res.ok) {
            const contentType = res.headers.get("content-type") || "image/jpeg";
            const arrayBuffer = await res.arrayBuffer();
            return new Response(arrayBuffer, {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, immutable",
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
            const arrayBuffer = await res.arrayBuffer();
            return new Response(arrayBuffer, {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, immutable",
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
