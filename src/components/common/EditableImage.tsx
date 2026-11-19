import { useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSiteContent, useInvalidateSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { driveFileId, driveImageUrl } from "@/lib/drive-link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditableImageProps {
  contentKey: string;
  /** Bundled default, shown until an admin sets a Drive image. */
  src: string;
  alt: string;
  className?: string;
  page: string;
  label: string;
}

// Same select-then-update/insert flow EditableText uses for site_content.
async function saveContent(key: string, value: string, page: string, label: string) {
  const { data: existing } = await supabase.from("site_content").select("id").eq("key", key).maybeSingle();
  const res = existing
    ? await supabase.from("site_content").update({ value, updated_at: new Date().toISOString() } as never).eq("key", key)
    : await supabase.from("site_content").insert({ key, value, page, label, content_type: "image" } as never);
  if (res.error) throw new Error(res.error.message);
}

/**
 * Image whose source (a Google Drive file) and alt text admins can change.
 * Visitors get a plain <img>, so page layout is identical with or without overrides.
 * Admins click the image to open the editor; an empty value falls back to the default.
 */
export function EditableImage({ contentKey, src, alt, className, page, label }: EditableImageProps) {
  const { isAdmin } = useAuth();
  const { get } = useSiteContent();
  const invalidate = useInvalidateSiteContent();
  const altKey = `${contentKey}.alt`;
  const currentSrc = get(contentKey) || src;
  const currentAlt = get(altKey) || alt;

  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [altText, setAltText] = useState(currentAlt);
  const [saving, setSaving] = useState(false);
  const id = driveFileId(link);

  if (!isAdmin) return <img src={currentSrc} alt={currentAlt} className={className} />;

  const openEditor = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLink("");
    setAltText(currentAlt);
    setOpen(true);
  };

  const save = async (value: string | null, altValue: string) => {
    setSaving(true);
    try {
      if (value !== null) await saveContent(contentKey, value, page, `${label} (image)`);
      if (altValue !== currentAlt) await saveContent(altKey, altValue, page, `${label} (alt text)`);
      await invalidate();
      toast.success("Image updated");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to save image", { description: err instanceof Error ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <img
        src={currentSrc}
        alt={currentAlt}
        className={`${className ?? ""} cursor-pointer hover:outline-4 hover:outline-primary/70`}
        title="Click to change this image"
        onClick={openEditor}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Change image</DialogTitle>
            <DialogDescription>
              Paste a Google Drive link. In Drive, the file must be shared as "Anyone with the link".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <img src={id ? `${driveImageUrl(id)}?w=800` : currentSrc} alt="" className="w-full max-h-56 object-cover rounded" />
            <div className="space-y-1.5">
              <Label htmlFor="ei-link">Google Drive link</Label>
              <Input id="ei-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://drive.google.com/file/d/…/view" />
              {link && !id && <p className="text-xs text-destructive">This is not a Google Drive file link.</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ei-alt">Alt text (describes the image for Google and screen readers)</Label>
              <Input id="ei-alt" value={altText} onChange={(e) => setAltText(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" disabled={saving || !get(contentKey)} onClick={() => save("", alt)}>
              Restore original
            </Button>
            <Button disabled={saving || (!id && altText === currentAlt) || !altText.trim()} onClick={() => save(id ? driveImageUrl(id) : null, altText.trim())}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
