import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { PageTransition } from "@/components/common/PageTransition";
import { ConversationSummaryProvider } from "@/hooks/useConversationSummary";
import { WhatsAppFloat } from "@/components/chat/WhatsAppFloat";
import { CallFloat } from "@/components/chat/CallFloat";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceCategoryPage from "./pages/ServiceCategory";
import ServiceSubcategoryPage from "./pages/ServiceSubcategory";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Clientele from "./pages/Clientele";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Enquiry from "./pages/Enquiry";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminImages from "./pages/admin/AdminImages";
import AdminProjectEditor from "./pages/admin/AdminProjectEditor";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminPages from "./pages/admin/AdminPages";
import { AdminToolbar } from "@/components/admin/AdminToolbar";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isHome = location.pathname === "/";

  return (
    <>
      {!isAdmin && <Header />}
      <AdminToolbar />
      {isAdmin ? (
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/projects/:id/edit" element={<AdminProjectEditor />} />
          <Route path="/admin/images" element={<AdminImages />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        </Routes>
      ) : (
        <>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:categorySlug" element={<ServiceCategoryPage />} />
              <Route path="/services/:categorySlug/:subcategorySlug" element={<ServiceSubcategoryPage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/clientele" element={<Clientele />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
          <Footer />
          <WhatsAppFloat />
          <CallFloat />
        </>
      )}
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConversationSummaryProvider>
          <TooltipProvider>
            <LoadingScreen />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </ConversationSummaryProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
