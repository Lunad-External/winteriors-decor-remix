import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Globe, ExternalLink, Pencil, Monitor, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pages = [
  { name: "Homepage", path: "/", description: "Hero, about, stats, expertise, projects, testimonials" },
  { name: "About", path: "/about", description: "Vision, mission, team, certifications" },
  { name: "Services", path: "/services", description: "All 6 service categories" },
  { name: "Contact", path: "/contact", description: "Contact form, CTA, office details" },
  { name: "Projects", path: "/projects", description: "Project listings & gallery" },
  { name: "Clientele", path: "/clientele", description: "Client logos & partnerships" },
];

export default function AdminContent() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-poppins">Visual Editor</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Click any page below, then edit text directly on the live preview
            </p>
          </div>
        </div>

        {/* How it works - compact */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Pencil className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Live inline editing is active</p>
            <p className="text-xs text-muted-foreground">
              Visit any page → hover over text → click the purple pencil → edit & save. Changes go live instantly.
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            className="shrink-0"
            onClick={() => window.open(selectedPage.path, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Open {selectedPage.name}
          </Button>
        </div>

        {/* Page tabs + Preview */}
        <div className="grid grid-cols-[220px_1fr] gap-4 min-h-[600px]">
          {/* Page list */}
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">Pages</p>
            {pages.map(page => (
              <button
                key={page.path}
                onClick={() => { setSelectedPage(page); setIframeKey(k => k + 1); }}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all text-sm group ${
                  selectedPage.path === page.path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{page.name}</span>
                  {selectedPage.path === page.path && <ArrowRight className="w-3.5 h-3.5 opacity-60" />}
                </div>
                <p className={`text-[11px] mt-0.5 ${
                  selectedPage.path === page.path ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {page.description}
                </p>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="border border-border rounded-xl overflow-hidden bg-muted/30 flex flex-col">
            {/* Preview toolbar */}
            <div className="h-10 bg-card border-b border-border flex items-center px-4 gap-2 shrink-0">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono flex-1 truncate">
                winteriors-decor-llc.lovable.app{selectedPage.path}
              </span>
              <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`p-1 rounded ${viewMode === "desktop" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`p-1 rounded ${viewMode === "mobile" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => setIframeKey(k => k + 1)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Refresh
              </button>
            </div>

            {/* iframe */}
            <div className="flex-1 flex justify-center bg-muted/50 p-4">
              <div
                className={`bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                  viewMode === "mobile" ? "w-[390px]" : "w-full"
                }`}
                style={{ height: "calc(100vh - 280px)" }}
              >
                <iframe
                  key={iframeKey}
                  src={selectedPage.path}
                  className="w-full h-full border-0"
                  title={`Preview: ${selectedPage.name}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
