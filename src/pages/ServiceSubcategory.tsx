import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Phone, Mail, ChevronLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { getSubcategoryBySlug, serviceHierarchy } from "@/data/serviceHierarchy";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

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

const imagePool = [
  projectCorporate, projectLibrary, projectRetail, projectHotelLobby,
  bgModernWorkspace, galleryBoardroom, bgCorporateOffice, bgConferenceRoom,
  projectOpenplan, projectHealthcare, bgRetailSpace, projectClinic, projectBoutique,
];

function getImageForSlug(slug: string, index?: number): string {
  if (index !== undefined) return imagePool[index % imagePool.length];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return imagePool[Math.abs(hash) % imagePool.length];
}

type SubcategoryItem = { slug: string; name: string; description: string; metaTitle: string; metaDescription: string };

const RelatedServicesCarousel = ({ siblings, categorySlug }: { siblings: SubcategoryItem[]; categorySlug: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); emblaApi.off("reInit", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-poppins">
            Related <span className="text-primary">Services</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className={`w-10 h-10 border border-border flex items-center justify-center transition-colors ${canScrollPrev ? 'hover:border-primary hover:text-primary text-foreground' : 'text-muted-foreground/30 cursor-default'}`}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className={`w-10 h-10 border border-border flex items-center justify-center transition-colors ${canScrollNext ? 'hover:border-primary hover:text-primary text-foreground' : 'text-muted-foreground/30 cursor-default'}`}
              disabled={!canScrollNext}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {siblings.map((sib, idx) => (
              <div key={sib.slug} className="flex-[0_0_280px] sm:flex-[0_0_300px] lg:flex-[0_0_25%] min-w-0 pl-4">
                <Link
                  to={`/services/${categorySlug}/${sib.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden aspect-[3/4] bg-background"
                >
                  <img
                    src={getImageForSlug(sib.slug, idx)}
                    alt={sib.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all duration-400 group-hover:from-black/95 group-hover:via-black/50">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-primary text-xs tracking-widest uppercase font-medium">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-white text-lg font-semibold font-poppins mt-2 mb-2 leading-tight">
                        {sib.name}
                      </h3>
                      <span className="inline-flex items-center gap-2 text-primary text-[11px] tracking-widest uppercase font-medium mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


const ServiceSubcategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const result = getSubcategoryBySlug(categorySlug || "", subcategorySlug || "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!result) {
    return <Navigate to="/services" replace />;
  }

  const { category, subcategory } = result;
  const heroImage = getImageForSlug(subcategory.slug);
  const caseStudies = projects.slice(0, 4);

  // Generate contextual FAQs
  const faqs = [
    { q: `What does ${subcategory.name} include?`, a: subcategory.description },
    { q: `How long does a typical ${subcategory.name.toLowerCase()} project take?`, a: `Project timelines vary based on scope and complexity. Typically, ${subcategory.name.toLowerCase()} projects range from 4 to 16 weeks. We provide a detailed programme schedule during the consultation phase.` },
    { q: `Do you handle ${subcategory.name.toLowerCase()} projects across the UAE?`, a: `Yes, Winteriors Decor serves clients across Dubai, Abu Dhabi, and the broader UAE. Our team manages projects in all major business districts and free zones.` },
    { q: `What makes Winteriors different for ${subcategory.name.toLowerCase()}?`, a: `With 17+ years of experience, ISO certifications, and over 500 completed projects, we bring unmatched expertise. Our end-to-end approach means one team handles design, execution, and handover — zero gaps.` },
    { q: `Can I see examples of your ${subcategory.name.toLowerCase()} work?`, a: `Absolutely. We have an extensive portfolio of completed projects. Contact us for a detailed presentation tailored to your project type, or browse our Projects page for highlights.` },
  ];

  // Sibling subcategories for related services
  const siblings = category.subcategories.filter(s => s.slug !== subcategory.slug);

  return (
    <Layout>
      <Helmet>
        <title>{subcategory.metaTitle}</title>
        <meta name="description" content={subcategory.metaDescription} />
        <link rel="canonical" href={`https://winteriors-decor-llc.lovable.app/services/${category.slug}/${subcategory.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: `Winteriors — ${subcategory.name}`,
          description: subcategory.metaDescription,
          url: `https://winteriors-decor-llc.lovable.app/services/${category.slug}/${subcategory.slug}`,
          areaServed: ["Dubai", "Abu Dhabi", "UAE"],
        })}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        {/* Right image - positioned absolutely on lg+ */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 hidden lg:block">
          <img
            src={heroImage}
            alt={`${subcategory.name} by Winteriors Decor`}
            className="w-full h-full object-cover brightness-75"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--foreground))] via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

        <div className="container-custom relative z-10 flex flex-col justify-center min-h-[60vh] pt-28 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-6 font-poppins leading-[1.05]">
              {subcategory.name}
            </h1>
            <p className="text-white/55 text-base md:text-lg leading-relaxed mb-10">
              {subcategory.description.slice(0, 200)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-4 flex-wrap mb-12"
          >
            <Button asChild className="bg-primary hover:bg-primary/90 text-sm tracking-widest uppercase font-semibold px-8">
              <Link to="/enquiry" target="_blank" rel="noopener noreferrer">Get a Free Quote</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white/70 hover:border-primary hover:text-primary bg-transparent text-sm tracking-widest uppercase">
              <a href="#services">View Services</a>
            </Button>
          </motion.div>

          <div className="flex gap-10">
            <div>
              <span className="text-3xl font-bold text-primary font-poppins">500+</span>
              <span className="block text-[10px] tracking-widest uppercase text-white/35 mt-1">Projects</span>
            </div>
            <div>
              <span className="text-3xl font-bold text-primary font-poppins">48hr</span>
              <span className="block text-[10px] tracking-widest uppercase text-white/35 mt-1">Quote Turnaround</span>
            </div>
            <div>
              <span className="text-3xl font-bold text-primary font-poppins">100%</span>
              <span className="block text-[10px] tracking-widest uppercase text-white/35 mt-1">Licensed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE DETAIL ── */}
      <section id="services" className="py-12 md:py-16 bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-3 text-[10px] tracking-[3px] uppercase text-primary mb-5">
                <span className="w-8 h-px bg-primary" />
                Service Overview
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 font-poppins leading-tight">
                What We <span className="text-primary">Deliver</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
                {subcategory.description}
              </p>
              <p className="text-muted-foreground leading-relaxed text-justify">
                At Winteriors Decor, our approach to {subcategory.name.toLowerCase()} is grounded in real-world experience across Dubai and Abu Dhabi.
                We combine design excellence with technical precision to deliver spaces that perform — functionally, aesthetically, and commercially.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={imagePool[(subcategory.slug.length + 3) % imagePool.length]}
                alt={subcategory.name}
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-3 text-[10px] tracking-[3px] uppercase text-primary mb-5 justify-center">
              <span className="w-10 h-px bg-border" />
              Portfolio
              <span className="w-10 h-px bg-border" />
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-poppins">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mt-4 leading-relaxed">
              Real projects delivered by Winteriors Decor across the UAE.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="group block relative overflow-hidden aspect-[16/9]"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.85] group-hover:brightness-[0.65]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                    <span className="text-primary text-xs tracking-widest uppercase font-medium">{project.category}</span>
                    <h3 className="text-white font-semibold text-xl mt-1 font-poppins">{project.title}</h3>
                    <p className="text-white/60 text-sm mt-2">{project.location} · {project.area}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
            <div>
              <span className="inline-flex items-center gap-3 text-[10px] tracking-[3px] uppercase text-primary mb-5">
                <span className="w-8 h-px bg-primary" />
                FAQ
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-poppins leading-tight">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed text-sm">
                Common questions about our {subcategory.name.toLowerCase()} services. Can't find your answer? Get in touch.
              </p>
              <Button asChild variant="outline" className="mt-6 text-sm">
                <Link to="/contactus" target="_blank" rel="noopener noreferrer">Contact Us</Link>
              </Button>
            </div>
            <div className="flex flex-col">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`border-b border-border overflow-hidden ${openFaq === idx ? '' : ''}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className={`flex justify-between items-center w-full py-6 text-left text-sm font-semibold gap-5 transition-colors ${
                      openFaq === idx ? 'text-primary' : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {faq.q}
                    <span className={`w-7 h-7 flex-shrink-0 border border-border flex items-center justify-center text-primary text-lg font-light transition-transform ${
                      openFaq === idx ? 'rotate-45 bg-primary/10' : ''
                    }`}>+</span>
                  </button>
                  {openFaq === idx && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-muted-foreground text-sm leading-relaxed pb-6"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED SERVICES CAROUSEL ── */}
      {siblings.length > 0 && (
        <RelatedServicesCarousel siblings={siblings} categorySlug={category.slug} />
      )}

    </Layout>
  );
};

export default ServiceSubcategoryPage;
