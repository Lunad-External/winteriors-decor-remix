import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, Image, Eye, Layers, RefreshCw, CloudDownload, 
  ArrowRight, Pencil, FileText, Globe 
} from "lucide-react";
import { useStorageProjects } from "@/hooks/useStorageProjects";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { projects } = useStorageProjects();
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: counts } = useQuery({
    queryKey: ["admin-dashboard-counts"],
    queryFn: async () => {
      const [projRes, imgRes, pagesRes] = await Promise.all([
        supabase.from("projects").select("id, category", { count: "exact" }).is("deleted_at", null),
        supabase.from("project_images").select("id", { count: "exact", head: true }),
        supabase.from("cms_pages").select("id", { count: "exact", head: true }),
      ]);
      const cats = new Set((projRes.data || []).map((p: any) => (p.category || "").toLowerCase()));
      return {
        projects: projRes.count ?? (projRes.data?.length || 0),
        images: imgRes.count ?? 0,
        categories: cats.size,
        pages: Math.max(pagesRes.count ?? 0, 7),
      };
    },
  });

  const stats = [
    { label: "Projects", value: counts?.projects ?? projects.length, icon: FolderOpen, gradient: "from-primary/20 to-primary/5" },
    { label: "Images", value: counts?.images ?? projects.reduce((s, p) => s + p.imageCount, 0), icon: Image, gradient: "from-emerald-500/20 to-emerald-500/5" },
    { label: "Categories", value: counts?.categories ?? 4, icon: Layers, gradient: "from-amber-500/20 to-amber-500/5" },
    { label: "Live Pages", value: counts?.pages ?? 7, icon: Eye, gradient: "from-blue-500/20 to-blue-500/5" },
  ];

  const quickActions = [
    { label: "Edit Site Content", description: "Visual page editor", icon: Pencil, path: "/admin/content", color: "bg-primary" },
    { label: "Manage Projects", description: "Add, edit, or remove", icon: FolderOpen, path: "/admin/projects", color: "bg-emerald-600" },
    { label: "CMS Pages", description: "Create custom pages", icon: FileText, path: "/admin/pages", color: "bg-blue-600" },
    { label: "View Live Site", description: "Open in new tab", icon: Globe, path: "/", external: true, color: "bg-amber-600" },
  ];

  const runSync = async (scanOnly = false) => {
    setSyncing(true);
    setSyncLog(prev => [...prev, scanOnly ? "Scanning Google Drive..." : "Syncing images to storage..."]);

    try {
      const { data, error } = await supabase.functions.invoke("sync-to-storage", {
        body: { scanOnly, max: 5 },
      });

      if (error) throw error;

      if (scanOnly) {
        setSyncLog(prev => [...prev, `Found ${data.totalProjects} projects in Google Drive`]);
        if (data.projects) {
          const missing = data.projects.filter((dp: any) =>
            !projects.find(p => p.id === dp.slug)
          );
          setSyncLog(prev => [...prev, `${missing.length} projects not yet in database`]);
        }
      } else {
        setSyncLog(prev => [
          ...prev,
          `Processed: ${data.processed?.length || 0} projects`,
          ...((data.processed || []).map((r: any) => `  ${r.slug}: ${r.status}${r.images ? ` (${r.images} images)` : ""}`)),
          data.remaining > 0 ? `${data.remaining} projects remaining — run sync again` : "All projects synced!",
        ]);
      }

      toast({ title: "Sync complete", description: scanOnly ? `Found ${data.totalProjects} projects` : `Processed ${data.processed?.length || 0} projects` });
    } catch (err: any) {
      setSyncLog(prev => [...prev, `Error: ${err.message}`]);
      toast({ title: "Sync failed", description: err.message, variant: "destructive" });
    }

    setSyncing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold font-poppins">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's what's happening with your site</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-5 border border-border/50`}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(action => (
              action.external ? (
                <a
                  key={action.label}
                  href={action.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className={`w-9 h-9 rounded-lg ${action.color} text-white flex items-center justify-center mb-3`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground">{action.description}</p>
                </a>
              ) : (
                <Link
                  key={action.label}
                  to={action.path}
                  className="group p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className={`w-9 h-9 rounded-lg ${action.color} text-white flex items-center justify-center mb-3`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground">{action.description}</p>
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Two-column: Recent Projects + Sync */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Projects</CardTitle>
                <Link to="/admin/projects" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projects.slice(0, 6).map((project) => (
                  <div key={project.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-9 rounded-md overflow-hidden bg-muted shrink-0">
                      {project.coverImage && (
                        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.title}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{project.category} · {project.imageCount} imgs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sync */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CloudDownload className="w-4 h-4" /> Drive Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Download project images from Google Drive. Each sync processes up to 5 projects.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => runSync(true)} disabled={syncing}>
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`} />
                  Scan
                </Button>
                <Button size="sm" onClick={() => runSync(false)} disabled={syncing}>
                  <CloudDownload className={`w-3.5 h-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`} />
                  Sync Images
                </Button>
              </div>
              {syncLog.length > 0 && (
                <div className="bg-muted rounded-lg p-3 max-h-48 overflow-y-auto">
                  <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap font-mono">
                    {syncLog.join("\n")}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
