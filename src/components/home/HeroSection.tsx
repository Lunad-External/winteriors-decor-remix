import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/common/EditableText";
import { EditableLink } from "@/components/common/EditableLink";
import { useSiteContent } from "@/hooks/useSiteContent";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import heroSlide4 from "@/assets/hero-slide-4.jpg";

gsap.registerPlugin(ScrollTrigger);

const slideImages = [heroSlide1, heroSlide2, heroSlide3, heroSlide4];

const defaultSlides = [
  { title: "Corporate Excellence", headline: ["Elevate Living Spaces", "with Elegance"], description: "Winteriors Decor LLC has been delivering high quality sustainable interior solutions since 2008." },
  { title: "Educational Spaces", headline: ["Transforming Ideas", "Into Reality"], description: "From concept to completion, we bring your vision to life with precision craftsmanship." },
  { title: "Hospitality Design", headline: ["Crafting Inspiring", "Work Environments"], description: "We specialize in creating dynamic workspaces that boost productivity and reflect your brand identity." },
  { title: "Modern Workspaces", headline: ["Design Excellence", "Delivered on Time"], description: "Our turnkey fit-out solutions ensure seamless project delivery with uncompromising quality standards." },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { get } = useSiteContent();

  const heroSlides = [1, 2, 3, 4].map((n, i) => ({
    image: slideImages[i],
    title: get(`hero_slide_${n}_title`, defaultSlides[i].title),
    headline: get(`hero_slide_${n}_headline`, defaultSlides[i].headline.join(" ")).split(/\s(?=with|Into|Work|Delivered)/),
    description: get(`hero_slide_${n}_description`, defaultSlides[i].description),
  }));

  heroSlides.forEach(s => { if (s.headline.length < 2) s.headline = [s.headline[0], ""]; });

  useEffect(() => {
    const timer = setInterval(() => { setCurrentSlide((prev) => (prev + 1) % heroSlides.length); }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-badge", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(".hero-title-line", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, "-=0.4")
        .fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .fromTo(".hero-buttons", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const n = currentSlide + 1;

  return (
    <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover crisp-image" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
        </div>
      ))}
      <div className="relative z-10 h-full flex items-end pb-28 md:pb-32">
        <div className="container-custom w-full">
          <div className="max-w-3xl">
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <EditableText contentKey="hero_badge_text" fallback="Welcome to Winteriors" value={get("hero_badge_text", "Welcome to Winteriors")} as="span" className="text-white text-xs font-medium tracking-wide uppercase text-shadow-sm" page="home" label="Hero Badge" />
            </div>
            <h1 className="mb-4 md:mb-6" key={`title-${currentSlide}`}>
              <EditableText contentKey={`hero_slide_${n}_headline`} fallback={defaultSlides[currentSlide].headline.join(" ")} value={heroSlides[currentSlide].headline.join(" ")} as="span" className="hero-title-line block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] font-poppins text-shadow-hero" page="home" label={`Hero Slide ${n} Headline`} />
            </h1>
            <EditableText contentKey={`hero_slide_${n}_description`} fallback={defaultSlides[currentSlide].description} value={heroSlides[currentSlide].description} as="p" className="hero-subtitle text-sm md:text-base text-white/85 mb-6 md:mb-8 max-w-xl leading-relaxed text-shadow-sm" page="home" label={`Hero Slide ${n} Description`} multiline />
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <EditableLink
                textKey="hero_btn_primary_text"
                urlKey="hero_btn_primary_url"
                fallbackText="View More"
                fallbackUrl="/about"
                currentText={get("hero_btn_primary_text", "View More")}
                currentUrl={get("hero_btn_primary_url", "/about")}
                className=""
                page="home"
                label="Hero Primary Button"
              >
                <Button size="default" className="group bg-primary text-white hover:bg-primary/90 px-6 h-11 text-sm font-semibold">
                  <EditableText contentKey="hero_btn_primary_text" fallback="View More" value={get("hero_btn_primary_text", "View More")} as="span" className="" page="home" label="Hero Primary Button Text" />
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </EditableLink>
              <EditableLink
                textKey="hero_btn_secondary_text"
                urlKey="hero_btn_secondary_url"
                fallbackText="Our Portfolio"
                fallbackUrl="/projects"
                currentText={get("hero_btn_secondary_text", "Our Portfolio")}
                currentUrl={get("hero_btn_secondary_url", "/projects")}
                className=""
                page="home"
                label="Hero Secondary Button"
              >
                <Button size="default" variant="outline" className="group border-white text-white hover:bg-white hover:text-foreground bg-transparent px-6 h-11 text-sm">
                  <EditableText contentKey="hero_btn_secondary_text" fallback="Our Portfolio" value={get("hero_btn_secondary_text", "Our Portfolio")} as="span" className="" page="home" label="Hero Secondary Button Text" />
                </Button>
              </EditableLink>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-28 right-8 z-20 flex items-center gap-4">
        <button onClick={prevSlide} className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-foreground transition-all text-white" aria-label="Previous slide"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={nextSlide} className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-foreground transition-all text-white" aria-label="Next slide"><ChevronRight className="w-5 h-5" /></button>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} className={`h-1 transition-all duration-300 ${index === currentSlide ? "w-8 bg-primary" : "w-4 bg-white/40"}`} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </section>
  );
};
