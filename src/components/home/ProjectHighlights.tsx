import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { EditableText } from "@/components/common/EditableText";
import { EditableLink } from "@/components/common/EditableLink";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useStorageProjects } from "@/hooks/useStorageProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { useAuth } from "@/hooks/useAuth";

gsap.registerPlugin(ScrollTrigger);

const curatedHighlights = [
  { slug: "etihad-rail" },
  { slug: "samsung-abu-dhabi-mall" },
  { slug: "alfahim-training-room" },
  { slug: "data-center-interior-design-execution-works" },
  { slug: "adnoc-eye-control-centre" },
  { slug: "hiyam-saloon-ksa-wss" },
];

export const ProjectHighlights = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { projects, loading } = useStorageProjects();
  const { get } = useSiteContent();
  const { isAdmin } = useAuth();

  const featured = (() => {
    if (!projects.length) return [];
    return curatedHighlights
      .map(({ slug }) => projects.find((p) => p.id === slug))
      .filter(Boolean);
  })();

  useEffect(() => {
    if (loading || featured.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".projects-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
      gsap.fromTo(".project-item", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out", scrollTrigger: { trigger: ".projects-grid", start: "top 75%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, featured.length]);

  // Project links are dynamic (based on project slug), so we use a simple
  // admin-aware wrapper that prevents navigation for admins
  const ProjectCard = ({ project }: { project: any }) => {
    const url = `/projects/${encodeURIComponent(project.id)}`;
    
    if (isAdmin) {
      return (
        <div className="project-item group block cursor-pointer">
          <div className="relative overflow-hidden aspect-[3/2] bg-muted">
            <OptimizedImage src={project.coverImage} alt={project.title} thumbnailWidth={80} eager={true} className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
          </div>
          <div className="flex items-baseline justify-between pt-5">
            <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-500 font-poppins">{project.title}</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] ml-4 shrink-0">{project.category}</span>
          </div>
        </div>
      );
    }

    return (
      <Link to={url} className="project-item group block">
        <div className="relative overflow-hidden aspect-[3/2] bg-muted">
          <OptimizedImage src={project.coverImage} alt={project.title} thumbnailWidth={80} eager={true} className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
        </div>
        <div className="flex items-baseline justify-between pt-5">
          <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-500 font-poppins">{project.title}</h3>
          <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] ml-4 shrink-0">{project.category}</span>
        </div>
      </Link>
    );
  };

  return (
    <section ref={sectionRef} className="pt-0 pb-12 md:pb-20 bg-background">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="projects-header text-center mb-10 md:mb-14">
          <EditableText contentKey="project_highlights_heading" fallback="Project Highlights" value={get("project_highlights_heading", "Project Highlights")} as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-poppins" page="home" label="Project Highlights Heading" />
        </div>
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/2] w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))
            : featured.map((project) => (
                <ProjectCard key={project!.id} project={project} />
              ))}
        </div>
        <div className="text-center mt-12 md:mt-16">
          <EditableLink
            textKey="view_all_projects_text"
            urlKey="view_all_projects_url"
            fallbackText="View All Projects"
            fallbackUrl="/projects"
            currentText={get("view_all_projects_text", "View All Projects")}
            currentUrl={get("view_all_projects_url", "/projects")}
            className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-medium text-foreground hover:text-primary transition-colors duration-500"
            page="home"
            label="View All Projects"
          >
            <EditableText contentKey="view_all_projects_text" fallback="View All Projects" value={get("view_all_projects_text", "View All Projects")} as="span" className="" page="home" label="View All Projects Link" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </EditableLink>
        </div>
      </div>
    </section>
  );
};
