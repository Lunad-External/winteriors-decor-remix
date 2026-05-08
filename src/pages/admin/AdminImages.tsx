import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStorageProjects, useProjectImages } from "@/hooks/useStorageProjects";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminImages() {
  const { projects } = useStorageProjects();
  const [selectedProject, setSelectedProject] = useState("");
  const { images, loading } = useProjectImages(selectedProject);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-poppins">Image Manager</h1>
          <p className="text-muted-foreground mt-1">View and manage project images</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Select Project:</span>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title} ({p.imageCount})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedProject ? (
              <p className="text-muted-foreground text-center py-12">Select a project to view its images</p>
            ) : loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
            ) : images.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No images found for this project. Images need to be synced from Google Drive.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted group relative">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end p-2">
                      <span className="text-xs text-background opacity-0 group-hover:opacity-100 truncate transition-opacity">{img.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
