import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useStorageProjects, useProjectImages } from "@/hooks/useStorageProjects";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { getProjectContent } from "@/data/projectContent";

const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

interface ProjectCmsData {
  short_description: string | null;
  long_description: string | null;
  client_name: string | null;
  location: string | null;
  project_type: string | null;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, loading: projectsLoading } = useStorageProjects();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cmsData, setCmsData] = useState<ProjectCmsData | null>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const project = projects.find(p => p.id.toLowerCase() === id?.toLowerCase());
  const { images, loading: imagesLoading } = useProjectImages(project?.folder || "");

  // Load CMS-specific fields
  useEffect(() => {
    if (!id) return;
    supabase
      .from("projects")
      .select("short_description, long_description, client_name, location, project_type")
      .eq("slug", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setCmsData(data as unknown as ProjectCmsData);
      });
  }, [id]);

  const relatedProjects = projects
    .filter(p => p.category === project?.category && p.id.toLowerCase() !== project?.id.toLowerCase())
    .slice(0, 4);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length > 1) {
      const next = (currentIndex + 1) % images.length;
      const prev = (currentIndex - 1 + images.length) % images.length;
      preloadImage(images[next].url);
      preloadImage(images[prev].url);
    }
    if (thumbnailRef.current) {
      const activeThumb = thumbnailRef.current.querySelector(`[data-thumb-index="${currentIndex}"]`) as HTMLElement;
      if (activeThumb) {
        const container = thumbnailRef.current;
        const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextImage(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prevImage(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) setCurrentIndex(0);
  }, [images, currentIndex]);

  if (projectsLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!project) return <Navigate to="/projects" replace />;

  // Use CMS data if available, fallback to generated content
  const fallback = getProjectContent(project.category, project.title);
  const overview = cmsData?.short_description || cmsData?.long_description || fallback.overview;
  const locationText = cmsData?.location || "Abu Dhabi, UAE";
  const projectType = cmsData?.project_type || project.category;
  const clientName = cmsData?.client_name;

  return (
    <Layout>
      <Helmet>
        <title>{project.title} | Winteriors Decor LLC Projects</title>
        <meta name="description" content={`${project.title} - ${project.category} project by Winteriors Decor LLC`} />
      </Helmet>

      {/* Full-bleed hero image */}
      <section className="relative w-full h-screen bg-black">
        {imagesLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        ) : images.length === 0 ? (
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" loading="eager" />
        ) : (
          <>
            <img key={images[currentIndex]?.url} src={images[currentIndex]?.url} alt={images[currentIndex]?.name} className="absolute inset-0 w-full h-full object-cover select-none animate-in fade-in duration-500" draggable={false} loading="eager" />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:scale-110 transition-all duration-300" aria-label="Previous image">
                  <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2.5} />
                </button>
                <button onClick={nextImage} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:scale-110 transition-all duration-300" aria-label="Next image">
                  <ChevronRight className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2.5} />
                </button>
              </>
            )}
            <div className="absolute bottom-6 right-6 z-10 bg-black/40 backdrop-blur-sm px-4 py-2 text-white/70 text-xs tracking-[0.15em] font-light">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </section>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <section className="relative bg-transparent p-0">
          <div ref={thumbnailRef} className="flex gap-0 overflow-x-auto scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            {images.map((img, idx) => (
              <button key={idx} data-thumb-index={idx} onClick={() => setCurrentIndex(idx)} className={`shrink-0 w-[20vw] md:w-[16.666vw] aspect-[4/3] overflow-hidden transition-opacity duration-300 ${currentIndex === idx ? "opacity-100" : "opacity-60 hover:opacity-90"}`} aria-label={`Go to image ${idx + 1}`}>
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:scale-110 transition-all duration-300" aria-label="Scroll thumbnails left">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:scale-110 transition-all duration-300" aria-label="Scroll thumbnails right">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
        </section>
      )}

      {/* Project info section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-16 md:gap-24">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-poppins leading-[1.1] uppercase tracking-wide mb-3">{project.title}</h1>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">{locationText}</p>

              {/* If CMS has rich HTML description, render it */}
              {cmsData?.long_description ? (
                <div className="prose prose-sm max-w-none text-muted-foreground mb-10" dangerouslySetInnerHTML={{ __html: cmsData.long_description }} />
              ) : (
                <p className="text-sm md:text-base text-muted-foreground leading-[1.9] mb-10">{overview}</p>
              )}

              <div className="w-full h-px bg-border mb-10" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground font-poppins mb-4">Scope of Work</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-[1.9]">Interior fit-out, joinery, flooring, painting, MEP coordination, and project management.</p>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground font-poppins mb-8">Project Information</h2>
              <div className="space-y-5">
                {clientName && (
                  <div className="flex justify-between items-baseline border-b border-border pb-4">
                    <span className="text-sm text-muted-foreground">Client:</span>
                    <span className="text-sm font-medium text-foreground">{clientName}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline border-b border-border pb-4">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm font-medium text-foreground">{locationText}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border pb-4">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium text-foreground capitalize">{projectType}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border pb-4">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium text-foreground">Completed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-poppins">Interested in a similar project?</h3>
          <p className="text-muted-foreground mb-8 text-lg">Let our team help you create an exceptional space.</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 uppercase tracking-[0.15em] text-sm px-10 py-6">
            <Link to="/enquiry">Start Your Project</Link>
          </Button>
        </div>
      </section>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="bg-background">
          <div className="max-w-5xl mx-auto px-6 md:px-12 pt-20 md:pt-24 pb-10">
            <h2 className="text-xs uppercase tracking-[0.25em] text-foreground font-semibold mb-2 font-poppins">Related Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] pb-0">
            {relatedProjects.map((relProject, index) => (
              <motion.div key={relProject.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                <Link to={`/projects/${encodeURIComponent(relProject.id)}`} className="group block relative overflow-hidden aspect-[16/9]">
                  <img src={relProject.coverImage} alt={relProject.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05]" loading="lazy" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <h3 className="text-base md:text-lg font-semibold text-white uppercase tracking-[0.08em] font-poppins">{relProject.title}</h3>
                    <span className="text-xs text-white/60 uppercase tracking-[0.2em] mt-1 block">{relProject.category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProjectDetail;
