import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ProjectImageManager, ManagedImage } from "@/components/admin/ProjectImageManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Trash2, Loader2, Code, AlertTriangle, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["offices", "retail", "education", "control-room"];
const STATUSES = ["draft", "published"];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-images/${path}`;
}

export default function AdminProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = !id || id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const initialLoad = useRef(true);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [projectType, setProjectType] = useState("");
  const [category, setCategory] = useState("offices");
  const [status, setStatus] = useState("draft");
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);
  const [existingSlug, setExistingSlug] = useState("");

  // Track unsaved changes
  const markDirty = useCallback(() => {
    if (!initialLoad.current) setHasUnsaved(true);
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsaved]);

  // Load project data
  useEffect(() => {
    if (isNew) { initialLoad.current = false; return; }

    async function load() {
      const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", id)
        .maybeSingle();

      if (error || !project) {
        toast({ title: "Project not found", description: "This project may have been deleted.", variant: "destructive" });
        navigate("/admin/projects");
        return;
      }

      setTitle(project.title);
      setSlug(project.slug);
      setExistingSlug(project.slug);
      setShortDescription(project.short_description || "");
      setLongDescription(project.long_description || "");
      setClientName(project.client_name || "");
      setLocation(project.location || "");
      setProjectType(project.project_type || "");
      setCategory(project.category);
      setStatus(project.status || "published");
      setFeaturedImageId(project.featured_image_id || null);

      setLoading(false);
      // Allow a tick before tracking changes
      setTimeout(() => { initialLoad.current = false; }, 100);
    }

    load();
  }, [id, isNew, navigate, toast]);

  // Load images
  const loadImages = useCallback(async () => {
    if (isNew) return;
    const targetSlug = existingSlug || id;
    const { data } = await supabase
      .from("project_images")
      .select("id, file_name, storage_path, sort_order, alt_text, caption")
      .eq("project_slug", targetSlug)
      .order("sort_order");

    if (data) {
      setImages(data.map(img => ({
        ...img,
        sort_order: img.sort_order ?? 0,
        url: getStorageUrl(img.storage_path),
      })));

      // Auto-sync project meta after image changes (cover_path + image_count)
      const coverImg = featuredImageId
        ? data.find(i => i.id === featuredImageId)
        : data[0];

      await supabase.from("projects").update({
        image_count: data.length,
        cover_path: coverImg?.storage_path || null,
        updated_at: new Date().toISOString(),
      }).eq("slug", targetSlug);
    }
  }, [id, isNew, existingSlug, featuredImageId]);

  useEffect(() => { loadImages(); }, [loadImages]);

  // Auto-generate slug from title for new projects
  useEffect(() => {
    if (isNew && title) setSlug(slugify(title));
  }, [title, isNew]);

  // Track field changes
  useEffect(() => { markDirty(); }, [title, shortDescription, longDescription, clientName, location, projectType, category, status, featuredImageId]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", description: "Please enter a project title.", variant: "destructive" });
      return;
    }

    if (!slug.trim()) {
      toast({ title: "Slug is required", description: "The URL slug was auto-generated but is empty. Please enter one.", variant: "destructive" });
      return;
    }

    // Check for duplicate slug on new projects
    if (isNew) {
      const { data: existing } = await supabase.from("projects").select("slug").eq("slug", slug.trim()).maybeSingle();
      if (existing) {
        toast({ title: "Slug already exists", description: `A project with slug "${slug}" already exists. Please change the title or slug.`, variant: "destructive" });
        return;
      }
    }

    setSaving(true);

    const coverPath = featuredImageId
      ? images.find(i => i.id === featuredImageId)?.storage_path || images[0]?.storage_path || null
      : images[0]?.storage_path || null;

    const projectData = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      short_description: shortDescription || null,
      long_description: longDescription || null,
      client_name: clientName || null,
      location: location || null,
      project_type: projectType || null,
      status,
      featured_image_id: featuredImageId,
      updated_at: new Date().toISOString(),
      published_at: status === "published" ? new Date().toISOString() : null,
      cover_path: coverPath,
      image_count: images.length,
    };

    let error;
    if (isNew) {
      const result = await supabase.from("projects").insert(projectData);
      error = result.error;
    } else {
      // If slug changed, update project_images references first
      if (slug.trim() !== existingSlug && existingSlug) {
        await supabase.from("project_images").update({ project_slug: slug.trim() }).eq("project_slug", existingSlug);
      }
      const result = await supabase.from("projects").update(projectData).eq("slug", existingSlug);
      error = result.error;
    }

    setSaving(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      setHasUnsaved(false);
      toast({ title: "Saved successfully!", description: `"${title}" has been saved.` });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });

      if (isNew) {
        navigate(`/admin/projects/${slug}/edit`, { replace: true });
      } else if (slug.trim() !== existingSlug) {
        setExistingSlug(slug.trim());
        navigate(`/admin/projects/${slug.trim()}/edit`, { replace: true });
      }
    }
  };

  const handleSoftDelete = async () => {
    if (!confirm(`Move "${title}" to trash?\n\nYou can restore it later from the trash.`)) return;
    await supabase.from("projects").update({ deleted_at: new Date().toISOString(), status: "draft" }).eq("slug", existingSlug);
    toast({ title: "Moved to trash", description: `"${title}" can be restored from the projects list.` });
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    navigate("/admin/projects");
  };

  const handleBack = () => {
    if (hasUnsaved && !confirm("You have unsaved changes. Leave anyway?")) return;
    navigate("/admin/projects");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-poppins">{isNew ? "New Project" : "Edit Project"}</h1>
              {!isNew && <p className="text-xs text-muted-foreground mt-0.5">/{slug}</p>}
            </div>
            {hasUnsaved && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/30 gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unsaved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {!isNew && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/projects/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-1" /> Preview
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={handleSoftDelete}>
                  <Trash2 className="w-4 h-4 mr-1" /> Trash
                </Button>
              </>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="edit">
          <TabsList className="mb-4">
            <TabsTrigger value="edit"><Code className="w-3.5 h-3.5 mr-1" /> Edit</TabsTrigger>
            <TabsTrigger value="preview"><Eye className="w-3.5 h-3.5 mr-1" /> Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              {/* Main content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title <span className="text-destructive">*</span></Label>
                      <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug <span className="text-destructive">*</span></Label>
                      <Input
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        placeholder="project-slug"
                        className="font-mono text-sm"
                      />
                      <p className="text-[11px] text-muted-foreground">URL path: /projects/{slug || "..."}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <Textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="Brief summary shown on listings..." rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Description</Label>
                      <RichTextEditor content={longDescription} onChange={setLongDescription} placeholder="Detailed project description..." />
                    </div>
                  </CardContent>
                </Card>

                {!isNew && (
                  <Card>
                    <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
                    <CardContent>
                      <ProjectImageManager
                        projectSlug={existingSlug}
                        images={images}
                        featuredImageId={featuredImageId}
                        onImagesChange={loadImages}
                        onSetFeatured={(id) => { setFeaturedImageId(id); markDirty(); }}
                      />
                    </CardContent>
                  </Card>
                )}

                {isNew && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Upload className="w-8 h-8 mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-medium">Save the project first</p>
                      <p className="text-xs mt-1">After saving, you'll be able to upload gallery images here.</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Publishing</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        {status === "draft" ? "Draft projects are hidden from visitors." : "Published projects are visible to everyone."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Category <span className="text-destructive">*</span></Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(c => (
                            <SelectItem key={c} value={c} className="capitalize">{c.replace(/-/g, " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm">Project Info</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Client Name</Label>
                      <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Type</Label>
                      <Input value={projectType} onChange={e => setProjectType(e.target.value)} placeholder="e.g. Residential, Commercial" />
                    </div>
                  </CardContent>
                </Card>

                {!isNew && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><span className="font-medium">Images:</span> {images.length}</p>
                        <p><span className="font-medium">Cover:</span> {featuredImageId ? "Custom (★)" : images.length > 0 ? "Auto (first image)" : "None"}</p>
                        <p><span className="font-medium">Status:</span> <Badge variant={status === "published" ? "default" : "secondary"} className="text-[10px] capitalize">{status}</Badge></p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {images.length > 0 && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={images.find(i => i.id === featuredImageId)?.url || images[0]?.url}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <Badge variant="secondary" className="capitalize mb-2">{category.replace(/-/g, " ")}</Badge>
                    <h1 className="text-3xl font-bold font-poppins">{title || "Untitled Project"}</h1>
                    {shortDescription && <p className="text-muted-foreground mt-2">{shortDescription}</p>}
                  </div>

                  {(clientName || location || projectType) && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                      {clientName && (
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Client</p>
                          <p className="text-sm font-medium">{clientName}</p>
                        </div>
                      )}
                      {location && (
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Location</p>
                          <p className="text-sm font-medium">{location}</p>
                        </div>
                      )}
                      {projectType && (
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Type</p>
                          <p className="text-sm font-medium">{projectType}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {longDescription && (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: longDescription }} />
                  )}

                  {images.length > 1 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Gallery ({images.length} images)</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {images.slice(0, 6).map(img => (
                          <div key={img.id} className="aspect-square rounded-md overflow-hidden bg-muted">
                            <img src={img.url} alt={img.file_name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {images.length > 6 && (
                          <div className="aspect-square rounded-md bg-muted flex items-center justify-center text-muted-foreground text-sm">
                            +{images.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
