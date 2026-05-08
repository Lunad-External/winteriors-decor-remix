import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search, Image as ImageIcon, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["offices", "retail", "education", "control-room"];

interface ProjectRow {
  slug: string;
  title: string;
  category: string;
  image_count: number | null;
  cover_path: string | null;
  status: string;
  deleted_at: string | null;
  updated_at: string | null;
}

function getStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-images/${path}`;
}

export default function AdminProjects() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showTrashed, setShowTrashed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects", showTrashed],
    queryFn: async () => {
      let query = supabase.from("projects").select("slug, title, category, image_count, cover_path, status, deleted_at, updated_at").order("updated_at", { ascending: false });
      
      if (showTrashed) {
        query = query.not("deleted_at", "is", null);
      } else {
        query = query.is("deleted_at", null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as ProjectRow[];
    },
  });

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category.toLowerCase().replace(/\s+/g, "-") === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = async (slug: string, title: string, isTrashed: boolean) => {
    if (isTrashed) {
      if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;
      // Delete images from storage
      const { data: imgs } = await supabase.from("project_images").select("storage_path").eq("project_slug", slug);
      if (imgs && imgs.length > 0) {
        await supabase.storage.from("project-images").remove(imgs.map(i => i.storage_path));
        await supabase.from("project_images").delete().eq("project_slug", slug);
      }
      await supabase.from("projects").delete().eq("slug", slug);
      toast({ title: "Permanently deleted", description: `"${title}" and all its images have been removed.` });
    } else {
      if (!confirm(`Move "${title}" to trash?`)) return;
      await supabase.from("projects").update({ deleted_at: new Date().toISOString(), status: "draft" } as any).eq("slug", slug);
      toast({ title: "Moved to trash", description: `"${title}" can be restored from trash.` });
    }
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  const handleRestore = async (slug: string, title: string) => {
    await supabase.from("projects").update({ deleted_at: null } as any).eq("slug", slug);
    toast({ title: "Restored", description: `"${title}" has been restored.` });
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins">Projects</h1>
            <p className="text-muted-foreground mt-1">{projects.length} projects {showTrashed ? "in trash" : "total"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowTrashed(!showTrashed)}>
              {showTrashed ? "Show Active" : "Show Trash"}
            </Button>
            {!showTrashed && (
              <Button onClick={() => navigate("/admin/projects/new/edit")}>
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={filterCat} onValueChange={setFilterCat}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c.replace(/-/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Images</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No projects found</TableCell></TableRow>
                ) : (
                  filtered.map((project) => (
                    <TableRow key={project.slug} className={project.deleted_at ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="w-14 h-10 rounded overflow-hidden bg-muted">
                          {project.cover_path ? (
                            <img src={getStorageUrl(project.cover_path)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{project.category.replace(/-/g, " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={project.status === "published" ? "default" : "outline"} className="capitalize text-xs">
                          {project.status || "published"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{project.image_count || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {showTrashed ? (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleRestore(project.slug, project.title)} title="Restore">
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(project.slug, project.title, true)} title="Delete permanently">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/projects/${project.slug}/edit`)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(project.slug, project.title, false)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
