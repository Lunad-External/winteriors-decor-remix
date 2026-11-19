// Same ID rule the /drive-image/$id route enforces.
const ID = "[a-zA-Z0-9_-]{25,}";

/** Extracts a Google Drive file ID from a share link, an open?id= link, or a bare ID. */
export function driveFileId(input: string): string | null {
  const s = input.trim();
  const m =
    s.match(new RegExp(`/d/(${ID})`)) ||
    s.match(new RegExp(`[?&]id=(${ID})`)) ||
    s.match(new RegExp(`^(${ID})$`));
  return m ? m[1] : null;
}

/** Site-relative URL served (resized + disk cached) by src/routes/drive-image.$id.ts. */
export const driveImageUrl = (id: string) => `/drive-image/${id}`;
