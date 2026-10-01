import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "@tanstack/react-router";
import { useStorageProjects, storageCategories } from "@/hooks/useStorageProjects";
import { getDriveFallbackUrl } from "@/lib/storage";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <Link to="/projects/$id" params={{ id: String(project.id) }} className="group block relative overflow-hidden">
        <div className="relative overflow-hidden bg-black aspect-[3/2] md:aspect-[4/3]">
          {!loaded && !error && <Skeleton className="absolute inset-0" />}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
            </div>
          ) : (
            <img
              src={project.coverImage}
              alt={project.title}
              className={`w-full h-full object-cover block transition-all duration-[1.5s] ease-out group-hover:scale-[1.05] ${loaded ? 'opacity-100' : 'opacity-0'}`}
              loading={index < 6 ? "eager" : "lazy"}
              decoding="async"
              fetchpriority={index < 6 ? "high" : "low"}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = "true";
                  const fallback = getDriveFallbackUrl(target.src);
                  if (fallback) {
                    target.src = fallback;
                    return;
                  }
                }
                setError(true);
              }}
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-center bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-white uppercase tracking-[0.12em] font-poppins leading-snug">{project.title}</h3>
            <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-[0.25em] mt-2 block">{project.category}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Explicit display order matching the shared reference site
const SLUG_ORDER: string[] = [
  "confidential-procject-05",
  "control-room",
  "confidential-project-01-2",
  "confidential-project-01-1",
  "confidential-project-02",
  "aes-office-auh",
  "rhs-group",
  "confidential-project-07",
  "dmt-reception-unification",
  "ilf-office-sky-tower",
  "alpha-data",
  "gulf-island-technical-oilfield-services",
  "confidential-project-04-1",
  "jacky-s-office",
  "khadamat",
  "confidential-project-06-1",
  "dmt-reception-chairmans-toilet",
  "winteriors-decor-office",
  "confidential-project",
  "daikin",
  "confidential-project-03-1",
  "daikin-dxb",
  "confidential-project-02-1",
  "metal-park-kezad",
  "adoc",
  "presight-by-g42",
  "nmdc-auditorium",
  "adsb-ceo-coo-room-fitout",
  "samsung-dfc",
  "vape-shop",
  "hiyam-saloon-ksa-wss",
  "flow-spa-riyadh",
  "ben-s-cookies-mercato-dubai",
  "samsung-abu-dhabi-mall",
  "sts-fujairah",
  "alfahim-training-room",
  "bloom-education",
  "provis-fdf-theater",
  "karamah-school",
  "sts-ras-al-khaimah",
  "data-center-interior-design-execution-works",
  "adnoc-eye-control-centre",
  "environmental-intelligence-hub",
];
const slugRank = (slug: string) => {
  const i = SLUG_ORDER.indexOf(slug);
  return i === -1 ? 9999 : i;
};

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { projects, loading, error } = useStorageProjects();

  const sorted = [...projects].sort((a, b) => slugRank(a.id) - slugRank(b.id));
  const filteredProjects = activeCategory === "All"
    ? sorted
    : sorted.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <Layout>
      <Helmet>
        <title>Our Projects | Winteriors Decor LLC</title>
        <meta name="description" content="Explore our portfolio of 600+ completed interior design and fit-out projects across Dubai and Abu Dhabi." />
      </Helmet>

      <h1 className="sr-only">Commercial Interior Design & Fit-Out Portfolio — Dubai & Abu Dhabi</h1>
      <section className="pt-20 md:pt-24 pb-0 bg-foreground">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-x-1 gap-y-1 justify-center">
            {storageCategories.map(category => (
              <button key={category} onClick={() => setActiveCategory(category)} className={`text-[11px] md:text-xs uppercase tracking-[0.18em] font-medium px-5 py-2.5 transition-all duration-300 border ${activeCategory === category ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-white border-white/30 hover:text-white hover:border-white/50"}`}>
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background pb-0">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] md:aspect-[3/4]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg">Unable to load projects. Please try again later.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg">No projects found in this category.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </Layout>
  );
};

export default ProjectsPage;
