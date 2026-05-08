import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Plus, Pencil, Trash2, Save, Loader2, Eye, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CmsPage {
  id: string;
  slug: string;
  title: string;
  body: string;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
  updated_at: string | null;
}

export default function AdminPages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [status, setStatus] = useState("draft");

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["admin-cms-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_pages")
        .select("id, slug, title, body, meta_title, meta_description, status, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []) as CmsPage[];
    },
  });

  const openEditor = (page?: CmsPage) => {
    if (page) {
      setEditing(page);
      setIsNew(false);
      setTitle(page.title);
      setSlug(page.slug);
      setBody(page.body);
      setMetaTitle(page.meta_title || "");
      setMetaDesc(page.meta_description || "");
      setStatus(page.status);
    } else {
      setEditing({} as CmsPage);
      setIsNew(true);
      setTitle("");
      setSlug("");
      setBody("");
      setMetaTitle("");
      setMetaDesc("");
      setStatus("draft");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Missing fields", description: "Title and slug are required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload: any = {
      title: title.trim(),
      slug: slug.trim(),
      body,
      meta_title: metaTitle || null,
      meta_description: metaDesc || null,
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "published") payload.published_at = new Date().toISOString();

    let error;
    if (isNew) {
      const result = await supabase.from("cms_pages").insert(payload);
      error = result.error;
    } else {
      const result = await supabase.from("cms_pages").update(payload).eq("id", editing!.id);
      error = result.error;
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `"${title}" saved` });
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-cms-pages"] });
    }
  };

  const handleDelete = async (page: CmsPage) => {
    if (!confirm(`Delete "${page.title}"?`)) return;
    await supabase.from("cms_pages").delete().eq("id", page.id);
    toast({ title: "Deleted", description: `"${page.title}" removed` });
    queryClient.invalidateQueries({ queryKey: ["admin-cms-pages"] });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins">Pages</h1>
            <p className="text-muted-foreground mt-1">Manage site pages with rich content</p>
          </div>
          <Button onClick={() => openEditor()}>
            <Plus className="w-4 h-4 mr-2" /> New Page
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : pages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No pages yet. Create your first page.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map(page => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">/{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant={page.status === "published" ? "default" : "outline"} className="capitalize text-xs">{page.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" onClick={() => openEditor(page)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(page)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Page Editor Dialog with Preview */}
        <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isNew ? "New Page" : "Edit Page"}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="edit" className="mt-2">
              <TabsList>
                <TabsTrigger value="edit">
                  <Code className="w-3.5 h-3.5 mr-1" /> Edit
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={title} onChange={e => { setTitle(e.target.value); if (isNew) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); }} />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input value={slug} onChange={e => setSlug(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor content={body} onChange={setBody} placeholder="Page content..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="SEO title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder="SEO description" />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 border-b pb-4">
                      <h1 className="text-3xl font-bold font-poppins">{title || "Untitled Page"}</h1>
                      {metaDesc && <p className="text-muted-foreground mt-2 text-sm">{metaDesc}</p>}
                    </div>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: body || "<p class='text-muted-foreground'>No content yet...</p>" }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
