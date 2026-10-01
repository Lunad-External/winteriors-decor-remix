import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Star, GripVertical, Loader2, AlertCircle } from "lucide-react";

export interface ManagedImage {
  id: string;
  file_name: string;
  storage_path: string;
  url: string;
  sort_order: number;
  alt_text: string | null;
  caption: string | null;
}

interface Props {
  projectSlug: string;
  images: ManagedImage[];
  featuredImageId: string | null;
  onImagesChange: () => void;
  onSetFeatured: (imageId: string | null) => void;
}

import { getStorageUrl } from "@/lib/storage";

/** Syncs image_count AND cover_path on the projects row so listing pages stay accurate */
async function syncProjectMeta(slug: string, images: ManagedImage[], featuredImageId: string | null) {
  const cover = featuredImageId
    ? images.find(i => i.id === featuredImageId)?.storage_path
    : images[0]?.storage_path;

  await supabase.from("projects").update({
    image_count: images.length,
    cover_path: cover || null,
    updated_at: new Date().toISOString(),
  }).eq("slug", slug);
}

export function ProjectImageManager({ projectSlug, images, featuredImageId, onImagesChange, onSetFeatured }: Props) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const maxOrder = images.length > 0 ? Math.max(...images.map(i => i.sort_order)) : -1;
    let uploaded = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Not an image file`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: Exceeds 10MB limit`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const storagePath = `${projectSlug}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        errors.push(`${file.name}: ${uploadError.message}`);
        continue;
      }

      const { error: dbError } = await supabase.from("project_images").insert({
        project_slug: projectSlug,
        file_name: file.name,
        storage_path: storagePath,
        sort_order: maxOrder + 1 + i,
      });

      if (dbError) {
        errors.push(`${file.name}: ${dbError.message}`);
      } else {
        uploaded++;
      }
    }

    // Refresh images first so we have accurate data for meta sync
    setUploading(false);
    onImagesChange();

    // Show results
    if (uploaded > 0) {
      toast({ title: `${uploaded} image${uploaded > 1 ? "s" : ""} uploaded`, description: "Gallery updated successfully." });
    }
    if (errors.length > 0) {
      toast({
        title: `${errors.length} file${errors.length > 1 ? "s" : ""} failed`,
        description: errors.slice(0, 3).join("; "),
        variant: "destructive",
      });
    }

    e.target.value = "";
  }, [projectSlug, images, toast, onImagesChange]);

  // After images change, sync project meta (called by parent after re-fetch)
  // We do this in upload/delete handlers instead of relying on effect

  const handleDelete = async (image: ManagedImage) => {
    if (!confirm(`Delete "${image.file_name}"?\n\nThis removes the image permanently from storage.`)) return;

    setDeleting(image.id);

    try {
      await supabase.storage.from("project-images").remove([image.storage_path]);
      await supabase.from("project_images").delete().eq("id", image.id);

      if (featuredImageId === image.id) onSetFeatured(null);

      // Compute new image list for meta sync
      const remaining = images.filter(i => i.id !== image.id);
      const newFeatured = featuredImageId === image.id ? null : featuredImageId;
      await syncProjectMeta(projectSlug, remaining, newFeatured);

      toast({ title: "Image deleted", description: `"${image.file_name}" removed from gallery.` });
      onImagesChange();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) {
      setDraggedIdx(null);
      return;
    }

    const reordered = [...images];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(idx, 0, moved);

    // Update sort_order in DB
    const updates = reordered
      .map((img, i) => (img.sort_order !== i ? { id: img.id, sort_order: i } : null))
      .filter(Boolean);

    for (const u of updates) {
      if (u) await supabase.from("project_images").update({ sort_order: u.sort_order }).eq("id", u.id);
    }

    setDraggedIdx(null);
    onImagesChange();
    toast({ title: "Order updated", description: "Image order saved." });
  };

  const handleUpdateAlt = async (imageId: string, altText: string) => {
    await supabase.from("project_images").update({ alt_text: altText }).eq("id", imageId);
    setEditingAlt(null);
    onImagesChange();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Gallery Images ({images.length})</Label>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button type="button" variant="outline" size="sm" disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
        </div>
      </div>

      {/* Helpful tip for non-tech users */}
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        Drag images to reorder. Click ★ to set cover image. Click filename to edit alt text.
      </p>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center text-muted-foreground">
          <Upload className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No images yet</p>
          <p className="text-xs mt-1">Upload images to build the project gallery. The first image will be used as the cover.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(idx)}
              className={`group relative rounded-lg overflow-hidden border-2 transition-all ${
                featuredImageId === img.id ? "border-primary ring-2 ring-primary/20" : "border-border"
              } ${draggedIdx === idx ? "opacity-50 scale-95" : ""}`}
            >
              <div className="aspect-square">
                <img src={getStorageUrl(img.storage_path)} alt={img.alt_text || img.file_name} className="w-full h-full object-cover" loading="lazy" />
              </div>

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  type="button"
                  size="icon"
                  variant={featuredImageId === img.id ? "default" : "secondary"}
                  className="h-8 w-8"
                  onClick={() => onSetFeatured(featuredImageId === img.id ? null : img.id)}
                  title={featuredImageId === img.id ? "Remove as cover" : "Set as cover image"}
                >
                  <Star className={`w-4 h-4 ${featuredImageId === img.id ? "fill-current" : ""}`} />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(img)}
                  disabled={deleting === img.id}
                >
                  {deleting === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Drag handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="w-4 h-4 text-white drop-shadow" />
              </div>

              {/* Featured badge */}
              {featuredImageId === img.id && (
                <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Cover
                </div>
              )}

              {/* Auto-cover indicator for first image */}
              {!featuredImageId && idx === 0 && (
                <div className="absolute top-1 right-1 bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Auto Cover
                </div>
              )}

              {/* File name */}
              <div className="p-1.5 bg-card">
                {editingAlt === img.id ? (
                  <Input
                    autoFocus
                    defaultValue={img.alt_text || ""}
                    placeholder="Alt text..."
                    className="h-7 text-xs"
                    onBlur={(e) => handleUpdateAlt(img.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateAlt(img.id, (e.target as HTMLInputElement).value);
                      if (e.key === "Escape") setEditingAlt(null);
                    }}
                  />
                ) : (
                  <p
                    className="text-[10px] text-muted-foreground truncate cursor-pointer hover:text-foreground"
                    onClick={() => setEditingAlt(img.id)}
                    title="Click to edit alt text"
                  >
                    {img.alt_text || img.file_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
