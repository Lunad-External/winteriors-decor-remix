import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Trash2, Upload, Image as ImageIcon, Loader2, Eye, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface MediaItem {
  id: string;
  file_name: string;
  storage_path: string;
  project_slug: string;
  alt_text: string | null;
  sort_order: number | null;
  created_at: string | null;
}

function getStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-images/${path}`;
}

export default function AdminMedia() {
  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: media = [], isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_images")
        .select("id, file_name, storage_path, project_slug, alt_text, sort_order, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as MediaItem[];
    },
  });

  const filtered = media.filter(m =>
    m.file_name.toLowerCase().includes(search.toLowerCase()) ||
    m.project_slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    let uploaded = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 10MB`, variant: "destructive" });
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const storagePath = `uploads/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(storagePath, file, { contentType: file.type });

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      await supabase.from("project_images").insert({
        project_slug: "unassigned",
        file_name: file.name,
        storage_path: storagePath,
        sort_order: 0,
      } as any);
      uploaded++;
    }

    setUploading(false);
    toast({ title: "Uploaded", description: `${uploaded} file(s) added to media library` });
    queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    e.target.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.file_name}"?`)) return;
    await supabase.storage.from("project-images").remove([item.storage_path]);
    await supabase.from("project_images").delete().eq("id", item.id);
    toast({ title: "Deleted", description: item.file_name });
    queryClient.invalidateQueries({ queryKey: ["admin-media"] });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} selected items?`)) return;

    const items = media.filter(m => selectedItems.has(m.id));
    await supabase.storage.from("project-images").remove(items.map(i => i.storage_path));
    for (const item of items) {
      await supabase.from("project_images").delete().eq("id", item.id);
    }

    setSelectedItems(new Set());
    toast({ title: "Deleted", description: `${items.length} items removed` });
    queryClient.invalidateQueries({ queryKey: ["admin-media"] });
  };

  const copyUrl = (path: string) => {
    navigator.clipboard.writeText(getStorageUrl(path));
    toast({ title: "Copied", description: "Image URL copied to clipboard" });
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins">Media Library</h1>
            <p className="text-muted-foreground mt-1">{media.length} files</p>
          </div>
          <div className="flex gap-2">
            {selectedItems.size > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete ({selectedItems.size})
              </Button>
            )}
            <div className="relative">
              <input type="file" multiple accept="image/*" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
              <Button size="sm" disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by filename or project..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No media found</div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filtered.map(item => (
                  <div
                    key={item.id}
                    className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedItems.has(item.id) ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/30"
                    }`}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <div className="aspect-square bg-muted">
                      <img src={getStorageUrl(item.storage_path)} alt={item.alt_text || item.file_name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                      <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setPreviewImage(item); }}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); copyUrl(item.storage_path); }}>
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="p-1 bg-card">
                      <p className="text-[9px] text-muted-foreground truncate">{item.file_name}</p>
                      <p className="text-[9px] text-muted-foreground/60 truncate">{item.project_slug}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{previewImage?.file_name}</DialogTitle>
            </DialogHeader>
            {previewImage && (
              <div className="space-y-4">
                <img src={getStorageUrl(previewImage.storage_path)} alt={previewImage.alt_text || previewImage.file_name} className="w-full rounded-lg" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Project:</span> <span className="font-medium">{previewImage.project_slug}</span></div>
                  <div><span className="text-muted-foreground">Alt text:</span> <span className="font-medium">{previewImage.alt_text || "—"}</span></div>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyUrl(previewImage.storage_path)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy URL
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
