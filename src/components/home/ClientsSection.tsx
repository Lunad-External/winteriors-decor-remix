import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/common/EditableText";
import { useSiteContent } from "@/hooks/useSiteContent";
import { clients } from "@/data/clients";

gsap.registerPlugin(ScrollTrigger);

const clientsPerPage = 12;

export const ClientsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { get } = useSiteContent();
  const totalPages = Math.ceil(clients.length / clientsPerPage);
  const currentClients = clients.slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".clients-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
      gsap.fromTo(".client-logo", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, scrollTrigger: { trigger: ".clients-grid", start: "top 80%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background">
      <div className="container-custom">
        <div className="clients-header flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <EditableText contentKey="clients_heading" fallback="Trusted By Leading Organizations" value={get("clients_heading", "Trusted By Leading Organizations")} as="h2" className="text-3xl md:text-4xl font-bold text-foreground font-poppins" page="home" label="Clients Section Heading" />
          {totalPages > 1 && (
            <div className="flex gap-2 mt-6 md:mt-0">
              <button onClick={prevPage} className="w-10 h-10 bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Previous"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={nextPage} className="w-10 h-10 bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Next"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>
        <div className="clients-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentClients.map((client, index) => (
            <div key={`${client.name}-${index}`} className="client-logo aspect-[3/2] flex items-center justify-center p-6 transition-all" title={client.name}>
              <img src={client.logo} alt={`${client.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button key={index} onClick={() => setCurrentPage(index)} className={`h-1 transition-all duration-300 ${index === currentPage ? "w-8 bg-primary" : "w-4 bg-border"}`} aria-label={`Page ${index + 1}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
