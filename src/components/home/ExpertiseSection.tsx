import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Paintbrush, Hammer, ClipboardList, LayoutGrid, Armchair, RefreshCw } from "lucide-react";
import { EditableText } from "@/components/common/EditableText";
import { EditableLink } from "@/components/common/EditableLink";
import { useSiteContent } from "@/hooks/useSiteContent";
import bgCorporateOffice from "@/assets/bg-corporate-office.jpg";
import bgModernWorkspace from "@/assets/bg-modern-workspace.jpg";
import projectLibrary from "@/assets/project-library.jpg";
import galleryBoardroom from "@/assets/gallery-boardroom.jpg";
import projectHospitality from "@/assets/project-hospitality.jpg";
import projectRetail from "@/assets/project-retail.jpg";

gsap.registerPlugin(ScrollTrigger);

const expertiseItems = [
  { icon: Paintbrush, key: "service_1", title: "Interior Design", description: "Creative interior designing services built on functionality and refined aesthetics.", image: bgCorporateOffice, link: "/services#interior-design" },
  { icon: Hammer, key: "service_2", title: "Turnkey Fit-Outs", description: "Complete interior fit-out from shell and core to ready-to-occupy commercial spaces.", image: bgModernWorkspace, link: "/services#turnkey-fit-outs" },
  { icon: ClipboardList, key: "service_3", title: "Project Management", description: "End-to-end coordination ensuring quality delivery within timelines and budget.", image: galleryBoardroom, link: "/services#project-management" },
  { icon: LayoutGrid, key: "service_4", title: "Space Planning", description: "Strategic layouts optimized for workflow and team collaboration.", image: projectLibrary, link: "/services#space-planning" },
  { icon: Armchair, key: "service_5", title: "Ergonomic Design", description: "Human-centered design for comfort, health, and productivity.", image: projectHospitality, link: "/services#ergonomic-design" },
  { icon: RefreshCw, key: "service_6", title: "Refurbishment Works", description: "Transform existing spaces with innovative designs and modern aesthetics.", image: projectRetail, link: "/services#refurbishment-works" },
];

export const ExpertiseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { get } = useSiteContent();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".expertise-header", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } });
      gsap.fromTo(".expertise-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".expertise-grid", start: "top 70%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-background">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="expertise-header text-center mb-10 md:mb-14">
          <EditableText contentKey="expertise_heading" fallback="Our Expertise" value={get("expertise_heading", "Our Expertise")} as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-poppins" page="home" label="Expertise Heading" />
        </div>
        <div className="expertise-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {expertiseItems.map((item) => (
            <EditableLink
              key={item.key}
              textKey={`${item.key}_title`}
              urlKey={`${item.key}_url`}
              fallbackText={item.title}
              fallbackUrl={item.link}
              currentText={get(`${item.key}_title`, item.title)}
              currentUrl={get(`${item.key}_url`, item.link)}
              className="expertise-card group relative p-6 md:p-8 bg-secondary border border-border overflow-hidden h-full flex flex-col no-underline"
              page="home"
              label={`Service ${item.key.split("_")[1]} Link`}
            >
              <div className="absolute inset-0 z-0">
                <img src={item.image} alt={get(`${item.key}_title`, item.title)} className="w-full h-full object-cover crisp-image" />
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-all duration-500"></div>
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-white transition-colors duration-300" />
                </div>
                <EditableText contentKey={`${item.key}_title`} fallback={item.title} value={get(`${item.key}_title`, item.title)} as="h3" className="text-lg font-bold text-white mb-3 font-poppins" page="home" label={`Service ${item.key.split("_")[1]} Title`} />
                <EditableText contentKey={`${item.key}_desc`} fallback={item.description} value={get(`${item.key}_desc`, item.description)} as="p" className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300" page="home" label={`Service ${item.key.split("_")[1]} Description`} />
              </div>
            </EditableLink>
          ))}
        </div>
      </div>
    </section>
  );
};
