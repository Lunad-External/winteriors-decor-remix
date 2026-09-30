import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { getCategoryBySlug, serviceHierarchy } from "@/data/serviceHierarchy";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/seo";

// Reuse existing project images for visual variety
import heroServices from "@/assets/hero-services.jpg";
import projectCorporate from "@/assets/project-corporate.jpg";
import projectLibrary from "@/assets/project-library.jpg";
import projectRetail from "@/assets/project-retail.jpg";
import projectHotelLobby from "@/assets/project-hotel-lobby.jpg";
import bgModernWorkspace from "@/assets/bg-modern-workspace.jpg";
import galleryBoardroom from "@/assets/gallery-boardroom.jpg";
import bgCorporateOffice from "@/assets/bg-corporate-office.jpg";
import bgConferenceRoom from "@/assets/bg-conference-room.jpg";
import projectOpenplan from "@/assets/project-openplan.jpg";
import projectHealthcare from "@/assets/project-healthcare.jpg";
import bgRetailSpace from "@/assets/bg-retail-space.jpg";
import projectClinic from "@/assets/project-clinic.jpg";
import projectBoutique from "@/assets/project-boutique.jpg";

const categoryImages: Record<string, string> = {
  "interior-design": heroServices,
  "turnkey-fit-outs": bgCorporateOffice,
  "project-management": bgConferenceRoom,
  "space-planning": bgModernWorkspace,
  "ergonomic-design": projectOpenplan,
  "refurbishment-works": galleryBoardroom,
};

const subcatImagePool = [
  projectCorporate, projectLibrary, projectRetail, projectHotelLobby,
  bgModernWorkspace, galleryBoardroom, bgCorporateOffice, bgConferenceRoom,
  projectOpenplan, projectHealthcare, bgRetailSpace, projectClinic, projectBoutique,
];

const whyUsPoints = [
  { title: "17+ Years of Excellence", desc: "A proven track record across Dubai and Abu Dhabi with over 500 projects delivered." },
  { title: "End-to-End Execution", desc: "From concept to handover, a single team manages every aspect of your project." },
  { title: "ISO Certified Quality", desc: "ISO 9001, 14001, and 45001 certified — guaranteeing quality, safety, and sustainability." },
  { title: "Client-Centric Approach", desc: "Every project starts with your vision. We listen, plan, and deliver spaces that reflect your brand." },
];

const processSteps = [
  { num: "01", title: "Consultation", desc: "Understanding your vision, requirements, and objectives." },
  { num: "02", title: "Concept Design", desc: "Developing creative concepts aligned with your brand and culture." },
  { num: "03", title: "Detailed Design", desc: "Technical drawings, material specifications, and 3D visualizations." },
  { num: "04", title: "Execution", desc: "Precise construction management with quality oversight." },
  { num: "05", title: "Handover", desc: "Snagging, completion, and seamless transition to occupancy." },
];

const ServiceCategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const category = getCategoryBySlug(categorySlug || "");

  if (!category) {
    return <Navigate to="/services" replace />;
  }

  const heroImage = categoryImages[category.slug] || heroServices;
  const caseStudies = projects.slice(0, 3);

  return (
    <Layout>
      <Helmet>
        <title>{category.metaTitle}</title>
        <meta name="description" content={category.metaDescription} />
        {location.pathname === `/services/${category.slug}` && (
          <link rel="canonical" href={absoluteUrl(location.pathname)} />
        )}
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={category.name}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="container-custom relative z-10 pt-28 pb-16 md:pb-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-poppins leading-tight max-w-3xl">
              {category.name}
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
              {category.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex gap-10 mt-10"
          >
            <div>
              <span className="text-3xl md:text-4xl font-bold text-primary font-poppins">500+</span>
              <span className="block text-[10px] tracking-widest uppercase text-white/40 mt-1">Projects Delivered</span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-bold text-primary font-poppins">17+</span>
              <span className="block text-[10px] tracking-widest uppercase text-white/40 mt-1">Years of Excellence</span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-bold text-primary font-poppins">100%</span>
              <span className="block text-[10px] tracking-widest uppercase text-white/40 mt-1">Client Satisfaction</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-3 text-[10px] tracking-[3px] uppercase text-primary mb-5">
                <span className="w-8 h-px bg-primary" />
                Our Expertise
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 font-poppins leading-tight">
                Comprehensive <span className="text-primary">{category.name}</span> Solutions
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
                {category.description}
              </p>
              <p className="text-muted-foreground leading-relaxed text-justify">
                With over 17 years of experience in the UAE, Winteriors Decor delivers {category.name.toLowerCase()} services
                that combine aesthetic excellence with functional precision. Every project is tailored to reflect
                your brand identity and operational needs.
              </p>
              <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
                <Link to="/enquiry">Get a Free Consultation <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={heroImage}
                alt={`${category.name} by Winteriors Decor`}
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 bg-foreground text-primary-foreground p-6 text-center min-w-[140px] hidden lg:block">
                <span className="text-4xl font-bold text-primary block font-poppins">500+</span>
                <span className="text-[10px] tracking-widest uppercase text-white/50 mt-1 block">Projects</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SUBCATEGORY GRID ── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-[10px] tracking-[3px] uppercase text-primary mb-5 justify-center">
              <span className="w-10 h-px bg-border" />
              Our Services
              <span className="w-10 h-px bg-border" />
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-poppins">
              Explore Our <span className="text-primary">{category.name}</span> Services
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mt-4 leading-relaxed">
              Each service is tailored to address specific needs within {category.name.toLowerCase()}, backed by real project experience across the UAE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {category.subcategories.map((sub, idx) => (
              <motion.div
                key={sub.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/services/${category.slug}/${sub.slug}`}
                  className="group relative block overflow-hidden aspect-[4/5] bg-background"
                >
                  <img
                    src={subcatImagePool[idx % subcatImagePool.length]}
                    alt={sub.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all duration-400 group-hover:from-black/95 group-hover:via-black/50">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="text-primary text-xs tracking-widest uppercase font-medium">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-white text-xl font-semibold font-poppins mt-2 mb-3 leading-tight">
                        {sub.name}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed max-h-0 overflow-hidden opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-400">
                        {sub.description.slice(0, 120)}...
                      </p>
                      <span className="inline-flex items-center gap-2 text-primary text-[11px] tracking-widest uppercase font-medium mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ── CASE STUDIES ── */}
      <section className="pt-0 pb-2 bg-background">
        <div className="container-custom">
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-3 text-[10px] tracking-[3px] uppercase text-primary mb-5 justify-center">
              <span className="w-10 h-px bg-border" />
              Case Studies
              <span className="w-10 h-px bg-border" />
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-poppins">
              Real Projects. <span className="text-primary">Real Results.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="pt-5">
                    <span className="text-primary text-xs tracking-widest uppercase">{project.category}</span>
                    <h3 className="text-foreground font-semibold text-lg mt-1 font-poppins group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2">{project.location} · {project.area}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground">
              <Link to="/projects" target="_blank">View All Projects <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default ServiceCategoryPage;
