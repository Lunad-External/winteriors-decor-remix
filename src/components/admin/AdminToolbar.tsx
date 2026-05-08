import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Pencil, LayoutDashboard, Eye, EyeOff, ChevronDown, 
  Globe, HelpCircle
} from "lucide-react";
import winteriorsLogo from "@/assets/logos/winteriors-logo.png";

const pages = [
  { name: "Homepage", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Clientele", path: "/clientele" },
  { name: "Contact", path: "/contact" },
  { name: "Enquiry", path: "/enquiry" },
];

/**
 * A sleek floating admin toolbar that appears at the top of public pages
 * when an admin is logged in. Non-tech-friendly with helpful tooltips.
 */
export function AdminToolbar() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(true);
  const [showPageSwitcher, setShowPageSwitcher] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  if (!isAdmin || location.pathname.startsWith("/admin")) return null;

  const currentPage = pages.find(p => p.path === location.pathname)?.name || "Page";

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed top-3 left-3 z-[9999] w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        title="Show admin toolbar"
      >
        <Pencil className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[9999] h-12 bg-foreground/95 backdrop-blur-xl border-b border-border/10 flex items-center px-4 gap-2 text-background shadow-xl">
        {/* Logo */}
        <img src={winteriorsLogo} alt="W" className="h-6 brightness-200 mr-2" />
        
        <div className="w-px h-6 bg-background/20" />

        {/* Page Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowPageSwitcher(!showPageSwitcher)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-background/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 opacity-70" />
            {currentPage}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </button>
          {showPageSwitcher && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowPageSwitcher(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-card text-card-foreground rounded-lg shadow-xl border border-border py-1 min-w-[180px]">
                <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium border-b border-border mb-1">
                  Switch page to edit
                </div>
                {pages.map(page => (
                  <button
                    key={page.path}
                    onClick={() => { navigate(page.path); setShowPageSwitcher(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                      location.pathname === page.path ? "bg-primary/10 text-primary font-medium" : ""
                    }`}
                  >
                    {page.name}
                    {location.pathname === page.path && <span className="text-[10px] text-primary ml-auto">Current</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Edit Mode Toggle */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
            editMode 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "bg-background/10 hover:bg-background/20"
          }`}
        >
          {editMode ? <Pencil className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {editMode ? "Editing" : "Previewing"}
        </button>

        <div className="flex-1" />

        {/* Help */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs hover:bg-background/10 transition-colors opacity-70 hover:opacity-100"
          title="How to edit"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Actions */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-background/10 transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </button>
        
        <button
          onClick={() => setMinimized(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs hover:bg-background/10 transition-colors opacity-70 hover:opacity-100"
          title="Minimize toolbar"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowHelp(false)} />
          <div className="fixed top-14 right-4 z-[9999] bg-card text-card-foreground rounded-xl shadow-2xl border border-border p-5 w-[320px]">
            <h3 className="text-sm font-bold mb-3">How to Edit This Page</h3>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Pencil className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Edit Text</p>
                  <p>Click on any text with a ✏️ icon to edit it. Changes save automatically when you click away.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">🔗</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Edit Links</p>
                  <p>Click buttons or linked cards to change where they point to. A popup will let you type the new URL.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <span className="text-green-600 dark:text-green-400 text-sm">↩️</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Undo Changes</p>
                  <p>After saving, you'll see a notification with an <strong>Undo</strong> button for 10 seconds.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Dashboard</p>
                  <p>Click <strong>Dashboard</strong> to manage projects, enquiries, pages, and media.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} className="mt-4 w-full h-8 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors">
              Got it!
            </button>
          </div>
        </>
      )}
    </>
  );
}
