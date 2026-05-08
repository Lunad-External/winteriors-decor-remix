import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { EditableText } from "@/components/common/EditableText";
import { useSiteContent } from "@/hooks/useSiteContent";
import { testimonials } from "@/data/testimonials";

gsap.registerPlugin(ScrollTrigger);

export const TestimonialsSection = () => {
  const [currentPair, setCurrentPair] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { get } = useSiteContent();
  const totalPairs = Math.ceil(testimonials.length / 2);

  useEffect(() => {
    const timer = setInterval(() => { setCurrentPair((prev) => (prev + 1) % totalPairs); }, 8000);
    return () => clearInterval(timer);
  }, [totalPairs]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".testimonials-header", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } });
      gsap.fromTo(".testimonial-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, scrollTrigger: { trigger: ".testimonials-grid", start: "top 75%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const next = () => setCurrentPair((prev) => (prev + 1) % totalPairs);
  const prev = () => setCurrentPair((prev) => (prev - 1 + totalPairs) % totalPairs);
  const currentTestimonials = [testimonials[currentPair * 2], testimonials[currentPair * 2 + 1]].filter(Boolean);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-secondary">
      <div className="container-custom">
        <div className="testimonials-header text-center mb-12">
          <EditableText contentKey="testimonials_heading" fallback="What Our Clients Say" value={get("testimonials_heading", "What Our Clients Say")} as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-poppins" page="home" label="Testimonials Heading" />
        </div>
        <div className="testimonials-grid grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {currentTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.author}-${currentPair}-${index}`} className="testimonial-card bg-background border border-border p-8 md:p-10 relative flex flex-col h-full">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
              <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed relative z-10 flex-grow text-justify">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{testimonial.author.charAt(0)}</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-semibold text-foreground text-lg whitespace-nowrap">{testimonial.author}</p>
                  <span className="text-muted-foreground">|</span>
                  <p className="text-muted-foreground text-sm">{testimonial.position}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-10">
          <button onClick={prev} className="w-10 h-10 bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Previous"><ChevronLeft className="w-4 h-4" /></button>
          <div className="flex gap-2">
            {Array.from({ length: totalPairs }).map((_, index) => (
              <button key={index} onClick={() => setCurrentPair(index)} className={`h-1 transition-all duration-300 ${index === currentPair ? "w-8 bg-primary" : "w-4 bg-border"}`} aria-label={`Testimonials ${index + 1}`} />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Next"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </section>
  );
};
