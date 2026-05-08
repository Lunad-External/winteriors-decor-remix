import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/common/PageHero";
import { EditableText } from "@/components/common/EditableText";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { clients } from "@/data/clients";
import { testimonials } from "@/data/testimonials";
import heroClientele from "@/assets/hero-clientele.jpg";

const ClientelePage = () => {
  const [logoPage, setLogoPage] = useState(0);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const { get } = useSiteContent();

  const logosPerPage = 12;
  const totalLogoPages = Math.ceil(clients.length / logosPerPage);
  const currentLogos = clients.slice(logoPage * logosPerPage, (logoPage + 1) * logosPerPage);

  const testimonialsPerPage = 2;
  const totalTestimonialPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const currentTestimonials = testimonials.slice(testimonialPage * testimonialsPerPage, (testimonialPage + 1) * testimonialsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialPage((prev) => (prev + 1) % totalTestimonialPages);
    }, 8000);
    return () => clearInterval(timer);
  }, [totalTestimonialPages]);

  const nextLogos = () => setLogoPage((prev) => (prev + 1) % totalLogoPages);
  const prevLogos = () => setLogoPage((prev) => (prev - 1 + totalLogoPages) % totalLogoPages);
  const nextTestimonials = () => setTestimonialPage((prev) => (prev + 1) % totalTestimonialPages);
  const prevTestimonials = () => setTestimonialPage((prev) => (prev - 1 + totalTestimonialPages) % totalTestimonialPages);

  return (
    <Layout>
      <Helmet>
        <title>Our Clientele | Winteriors Decor LLC</title>
        <meta name="description" content="Trusted by leading organizations including Emirates, ADNOC, Samsung, and more." />
      </Helmet>

      <PageHero
        title={get("clientele_hero_title", "Trusted By")}
        subtitle={get("clientele_hero_subtitle", "Leading organizations across the UAE trust Winteriors for their commercial interior needs.")}
        backgroundImage={heroClientele}
        compact
      />

      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <EditableText contentKey="clientele_partners_heading" fallback="Trusted Partners" value={get("clientele_partners_heading", "Trusted Partners")} as="h2" className="text-3xl md:text-4xl font-bold text-foreground font-poppins" page="clientele" label="Partners Heading" />
            </div>
            {totalLogoPages > 1 && (
              <div className="flex gap-2 mt-6 md:mt-0">
                <button onClick={prevLogos} className="w-10 h-10 bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Previous clients">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextLogos} className="w-10 h-10 bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Next clients">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentLogos.map((client, index) => (
              <motion.div key={`${client.name}-${logoPage}-${index}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.03 }} className="aspect-[3/2] bg-white flex items-center justify-center p-6 transition-all" title={client.name}>
                <img src={client.logo} alt={`${client.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
              </motion.div>
            ))}
          </div>

          {totalLogoPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalLogoPages }).map((_, index) => (
                <button key={index} onClick={() => setLogoPage(index)} className={`h-1 transition-all duration-300 ${index === logoPage ? "w-8 bg-primary" : "w-4 bg-border"}`} aria-label={`Go to page ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-secondary">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <EditableText contentKey="clientele_testimonials_heading" fallback="What Our Clients Say" value={get("clientele_testimonials_heading", "What Our Clients Say")} as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-poppins" page="clientele" label="Testimonials Heading" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentTestimonials.map((testimonial, index) => (
              <motion.div key={`${testimonial.author}-${testimonialPage}-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card border border-border p-8 relative flex flex-col h-full">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
                <p className="text-foreground mb-6 leading-relaxed relative z-10 flex-grow text-justify">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="font-semibold text-foreground whitespace-nowrap">{testimonial.author}</p>
                    <span className="text-muted-foreground">|</span>
                    <p className="text-muted-foreground text-sm">{testimonial.position}, {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {Array.from({ length: totalTestimonialPages }).map((_, index) => (
                <button key={index} onClick={() => setTestimonialPage(index)} className={`h-1 transition-all duration-300 ${index === testimonialPage ? "w-8 bg-primary" : "w-4 bg-border"}`} aria-label={`Go to testimonial page ${index + 1}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prevTestimonials} className="w-10 h-10 bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Previous testimonials">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextTestimonials} className="w-10 h-10 bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Next testimonials">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ClientelePage;
