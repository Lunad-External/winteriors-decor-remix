import { useRef, useState } from "react";
import { CertificateLightbox } from "@/components/common/CertificateLightbox";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ZoomIn } from "lucide-react";
import { EditableText } from "@/components/common/EditableText";
import { EditableLink } from "@/components/common/EditableLink";
import { useSiteContent } from "@/hooks/useSiteContent";
import dubaiPenthouse from "@/assets/dubai-penthouse-interior.jpg";
import dubaiModernOffice from "@/assets/dubai-modern-office.jpg";
import iso9001Cert from "@/assets/certificates/iso-9001-cert.jpg";
import iso14001Cert from "@/assets/certificates/iso-14001-cert.jpg";
import iso45001Cert from "@/assets/certificates/iso-45001-cert.jpg";
import { useGSAP } from "@gsap/react";

const certifications = [
  { name: "ISO 9001:2015", label: "Quality Management", image: iso9001Cert },
  { name: "ISO 14001:2015", label: "Environmental Management", image: iso14001Cert },
  { name: "ISO 45001:2018", label: "Health & Safety", image: iso45001Cert },
];

gsap.registerPlugin(ScrollTrigger);

export const AboutPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLImageElement>(null);
  const image2Ref = useRef<HTMLImageElement>(null);
  const [lightboxImage, setLightboxImage] = useState<{ image: string; name: string } | null>(null);
  const { get } = useSiteContent();

  useGSAP(() => {
    gsap.fromTo(".about-content", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: containerRef.current, start: "top 75%" } });
    if (image1Ref.current && image2Ref.current) {
      gsap.to(image1Ref.current, { yPercent: 15, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(image2Ref.current, { yPercent: -15, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 } });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_4fr] gap-10 lg:gap-14 items-center">
          <div className="about-content relative z-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-[1.1] font-poppins">
              <EditableText contentKey="about_heading" fallback="Crafting Spaces" value={get("about_heading")} as="span" className="" page="home" label="About Heading" /> <br />
              <EditableText contentKey="about_subheading" fallback="That Inspire" value={get("about_subheading")} as="span" className="text-3xl md:text-4xl lg:text-4xl text-muted-foreground italic font-normal" page="home" label="About Subheading" />
            </h2>
            <div className="space-y-5 text-muted-foreground text-sm leading-relaxed mb-10 text-justify">
              <EditableText contentKey="about_paragraph_1" fallback="Winteriors Decor LLC is a premier Interior Fit Out and Design authority in Abu Dhabi. For over 17 years, we have redefined spatial experiences across corporate, residential, hospitality, and commercial sectors." value={get("about_paragraph_1")} as="p" className="" page="home" label="About Paragraph 1" multiline />
              <EditableText contentKey="about_paragraph_2" fallback="We don't just design spaces; we curate environments that elevate the human experience." value={get("about_paragraph_2")} as="p" className="" page="home" label="About Paragraph 2" multiline />
            </div>
            <div className="flex flex-wrap gap-5 items-start justify-between w-full mb-10">
              {certifications.map((cert) => (
                <button key={cert.name} onClick={() => setLightboxImage(cert)} className="group flex flex-col items-center gap-2 cursor-pointer">
                  <div className="relative rounded-lg shadow-md overflow-hidden border border-border/50 hover:shadow-lg transition-shadow">
                    <img src={cert.image} alt={`${cert.name} Certificate`} className="h-20 md:h-24 w-auto object-contain" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-semibold text-foreground">{cert.name}</span>
                    <span className="block text-[10px] text-muted-foreground">{cert.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <EditableLink
              textKey="about_discover_text"
              urlKey="about_discover_url"
              fallbackText="Discover Our Story"
              fallbackUrl="/about"
              currentText={get("about_discover_text", "Discover Our Story")}
              currentUrl={get("about_discover_url", "/about")}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all duration-300 group"
              page="home"
              label="Discover Our Story"
            >
              <EditableText contentKey="about_discover_text" fallback="Discover Our Story" value={get("about_discover_text", "Discover Our Story")} as="span" className="" page="home" label="Discover Our Story Text" />
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </EditableLink>
          </div>
          <div className="relative h-[600px] hidden lg:block">
            <div className="absolute top-1/4 right-0 w-3/4 h-3/4 bg-secondary/30 -z-10 rounded-tl-[100px]" />
            <div className="absolute top-0 right-10 w-3/5 h-[85%] overflow-hidden shadow-2xl z-10">
              <img ref={image1Ref} src={dubaiPenthouse} alt="Luxury Dubai Interior Design" className="w-full h-[120%] object-cover object-center" />
            </div>
            <div className="absolute bottom-10 left-0 w-3/5 h-[45%] overflow-hidden shadow-2xl z-20 border-8 border-background">
              <img ref={image2Ref} src={dubaiModernOffice} alt="Modern Dubai Office Interior" className="w-full h-[120%] object-cover" />
            </div>
            <div className="absolute top-20 left-10 z-30 bg-primary text-white p-6 shadow-xl max-w-[200px]">
              <span className="block text-4xl font-bold mb-1">{get("stat_years", "17")}+</span>
              <span className="text-sm uppercase tracking-wider opacity-90">Years of Excellence</span>
            </div>
          </div>
          <div className="lg:hidden relative aspect-[4/5]">
            <img src={dubaiPenthouse} alt="Luxury Dubai Interior Design" className="w-full h-full object-cover object-center" />
          </div>
        </div>
      </div>
      {lightboxImage && <CertificateLightbox certName={lightboxImage.name} onClose={() => setLightboxImage(null)} />}
    </section>
  );
};
