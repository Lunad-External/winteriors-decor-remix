import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, FolderOpen, Image, Users, FileText,
  Type, LogOut, ArrowLeft, Sparkles, ChevronRight, MessageSquare,
  Newspaper, UserCircle, Building2, Quote, Wrench, MapPin, FileBox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import winteriorsLogo from "@/assets/logos/winteriors-logo.png";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Projects", path: "/admin/projects", icon: FolderOpen },
  { label: "Blogs", path: "/admin/blogs", icon: Newspaper },
  { label: "Services", path: "/admin/services", icon: Wrench },
  { label: "Team", path: "/admin/team", icon: UserCircle },
  { label: "Clients", path: "/admin/clients", icon: Building2 },
  { label: "Testimonials", path: "/admin/testimonials", icon: Quote },
  { label: "Offices", path: "/admin/offices", icon: MapPin },
  { label: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  { label: "Pages", path: "/admin/pages", icon: FileText },
  { label: "Site Content", path: "/admin/content", icon: Type },
  { label: "Documents", path: "/admin/documents", icon: FileBox },
  { label: "Media", path: "/admin/media", icon: Image },
  { label: "Users", path: "/admin/users", icon: Users },
];


export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">You need to sign in to access the admin panel.</p>
          <Button onClick={() => navigate("/admin/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 bg-background">
        <div>
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <Button variant="outline" onClick={() => { signOut(); navigate("/admin/login"); }}>
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Get page title from nav
  const currentNav = navItems.find(i => i.path === location.pathname);
  const pageTitle = currentNav?.label || "Admin";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-[260px] bg-foreground text-background flex flex-col shrink-0 fixed inset-y-0 left-0 z-40">
        {/* Brand */}
        <div className="p-5 pb-4">
          <img src={winteriorsLogo} alt="Winteriors" className="h-7 brightness-200" />
          <p className="text-[11px] text-background/40 mt-1.5 font-medium tracking-wider uppercase">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  active 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" 
                    : "text-background/60 hover:text-background hover:bg-background/10"
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${active ? "" : "opacity-70 group-hover:opacity-100"}`} />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 space-y-0.5 border-t border-background/10 mt-auto">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-background/50 hover:text-background rounded-lg hover:bg-background/10 transition-colors"
          >
            <ArrowLeft className="w-[18px] h-[18px]" /> View Live Site
          </Link>
          <button
            onClick={() => { signOut(); navigate("/admin/login"); }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-background/50 hover:text-background rounded-lg hover:bg-background/10 transition-colors w-full"
          >
            <LogOut className="w-[18px] h-[18px]" /> Sign Out
          </button>
        </div>

        {/* User card */}
        <div className="p-4 border-t border-background/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-background/80 truncate">{user.email}</p>
              <p className="text-[10px] text-background/40 uppercase tracking-wider">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-[260px] overflow-auto min-h-screen">
        <div className="p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
