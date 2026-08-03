import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EditableText } from "@/components/common/EditableText";
import { useSiteContent } from "@/hooks/useSiteContent";

gsap.registerPlugin(ScrollTrigger);

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  compact?: boolean;
  children?: ReactNode;
}

export const PageHero = ({ title, subtitle, backgroundImage, compact, children }: PageHeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { get } = useSiteContent();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (imageRef.current && !isMobile) {
        gsap.to(imageRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(".page-hero-badge", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(".page-hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
        .fromTo(".page-hero-subtitle", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={`relative overflow-hidden flex items-end ${compact ? "h-[40vh] min-h-[280px] md:min-h-[320px]" : "h-[50vh] min-h-[350px] md:min-h-[400px]"}`}>
      {backgroundImage && (
        <div ref={imageRef} className="absolute inset-0 scale-105 will-change-transform">
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
          />
        </div>
      )}

      {!backgroundImage && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent/30" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        </div>
      )}

      <div className="container-custom relative z-10 pb-10 md:pb-14">
        <div className="max-w-3xl px-4 md:px-0">
          <span
            className={`page-hero-badge inline-block text-[10px] md:text-xs font-medium mb-2 md:mb-3 uppercase tracking-wider ${
              backgroundImage ? "text-white/80 text-shadow-sm" : "text-primary"
            }`}
          >
            {get("hero_badge_text", "17+ Years of Excellence")}
          </span>

          <h1
            className={`page-hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight ${
              backgroundImage ? "text-white text-shadow-hero" : "text-foreground"
            }`}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`page-hero-subtitle text-sm md:text-base lg:text-lg max-w-xl leading-relaxed text-justify ${
                backgroundImage ? "text-white/85 text-shadow-sm" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
};
