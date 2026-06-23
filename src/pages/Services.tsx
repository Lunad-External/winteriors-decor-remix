import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/common/PageHero";
import { EditableText } from "@/components/common/EditableText";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";
import heroServices from "@/assets/hero-services.jpg";
import projectCorporate from "@/assets/project-corporate.jpg";
import projectLibrary from "@/assets/project-library.jpg";
import projectRetail from "@/assets/project-retail.jpg";
import projectHotelLobby from "@/assets/project-hotel-lobby.jpg";
import bgModernWorkspace from "@/assets/bg-modern-workspace.jpg";
import galleryBoardroom from "@/assets/gallery-boardroom.jpg";

const serviceImages = [projectCorporate, projectLibrary, projectRetail, projectHotelLobby, bgModernWorkspace, galleryBoardroom];
const serviceIds = ["interior-design", "turnkey-fit-outs", "project-management", "space-planning", "ergonomic-design", "refurbishment-works"];

const defaultServices = [
  { title: "Interior Design", desc: "At Winteriors Decor, our interior designing services are built on the foundation of creativity, functionality, and refined aesthetics.", details: "Our design process begins with understanding your vision, your culture, and the way your team interacts within the workspace." },
  { title: "Turnkey Fit-Outs", desc: "Our interior fit-out services are designed to transform approved concepts into fully functional, ready-to-use spaces with precision and efficiency.", details: "Our experienced team handles all technical and aesthetic elements, including partitions, ceilings, flooring, MEP works, joinery, custom furniture, and lighting installations." },
  { title: "Project Management", desc: "Effective project management lies at the core of every successful interior design and fit-out project we deliver.", details: "From the moment a project begins until the final handover, we take complete ownership of every detail." },
  { title: "Space Planning", desc: "Effective space planning is the foundation of every successful interior design project.", details: "With a deep understanding of modern workplace trends, we create intelligent layouts that maximize every square meter." },
  { title: "Ergonomic Design", desc: "We believe that a well-designed workspace should prioritize the comfort, health, and productivity of every individual.", details: "By integrating ergonomic principles into our design process, we create work environments that enhance performance." },
  { title: "Refurbishment Works", desc: "Give us any type of commercial interiors for refurbishing. Our fit out contractors can develop a complete new theme.", details: "We specialize in comprehensive office refurbishment solutions that breathe new life into existing workplaces." },
];

const ServicesPage = () => {
  const location = useLocation();
  const { get } = useSiteContent();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => { element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
      }
    }
  }, [location]);

  return (
    <Layout>
      <Helmet>
        <title>Our Services | Winteriors Decor LLC - Interior Design & Fit Out</title>
        <meta name="description" content="Comprehensive interior design and fit-out services including space planning, project management, ergonomic design, and turnkey solutions across Dubai and Abu Dhabi." />
      </Helmet>

      <PageHero
        title={get("services_hero_title", "Our Expertise")}
        subtitle={get("services_hero_subtitle", "Our mission is simple: transform shell-and-core buildings into ready-to-occupy, elegant commercial spaces.")}
        backgroundImage={heroServices}
        compact
      />

      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <div className="space-y-20">
            {serviceIds.map((id, index) => {
              const n = index + 1;
              const def = defaultServices[index];
              return (
                <Link
                  key={id}
                  to={`/services/${id}`}
                  id={id}
                  className="group block scroll-mt-24"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] group-hover:-translate-y-2 group-hover:border-primary/30"
                  >
                    <div className={`lg:col-span-5 p-8 md:p-10 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <EditableText
                        contentKey={`service_${n}_title`}
                        fallback={def.title}
                        value={get(`service_${n}_title`)}
                        as="h2"
                        className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-poppins"
                        page="services"
                        label={`Service ${n} Title`}
                      />
                      <EditableText
                        contentKey={`service_${n}_desc`}
                        fallback={def.desc}
                        value={get(`service_${n}_desc`)}
                        as="p"
                        className="text-muted-foreground leading-relaxed mb-4 text-justify"
                        page="services"
                        label={`Service ${n} Description`}
                        multiline
                      />
                      <EditableText
                        contentKey={`service_${n}_details`}
                        fallback={def.details}
                        value={get(`service_${n}_details`)}
                        as="p"
                        className="text-muted-foreground leading-relaxed text-justify"
                        page="services"
                        label={`Service ${n} Details`}
                        multiline
                      />
                      <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                        Explore {def.title}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                      </span>
                    </div>
                    <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div className="overflow-hidden h-full">
                        <img
                          src={serviceImages[index]}
                          alt={get(`service_${n}_title`, def.title)}
                          className="w-full h-full object-cover aspect-[16/10] lg:aspect-auto transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
