import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, X } from "lucide-react";
import { EditableText } from "@/components/common/EditableText";
import { useSiteContent } from "@/hooks/useSiteContent";

gsap.registerPlugin(ScrollTrigger);

export const VideoGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { get } = useSiteContent();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".video-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="py-10 md:py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="video-content text-center mb-8 md:mb-10">
            <EditableText contentKey="video_gallery_heading" fallback="Video Gallery" value={get("video_gallery_heading", "Video Gallery")} as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins" page="home" label="Video Gallery Heading" />
          </div>
          <div className="video-content">
            <div className="relative aspect-video overflow-hidden cursor-pointer group" onClick={() => setIsPlaying(true)}>
              <img src="https://img.youtube.com/vi/CTxNDWI-YVo/maxresdefault.jpg" alt="Winteriors Decor LLC Video" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out" loading="lazy" />
              <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent">
                <EditableText contentKey="video_title" fallback="Winteriors Decor LLC" value={get("video_title", "Winteriors Decor LLC")} as="p" className="text-white text-lg md:text-xl font-semibold font-poppins" page="home" label="Video Title" />
                <EditableText contentKey="video_subtitle" fallback="UAE's Foremost Commercial Interiors Specialist" value={get("video_subtitle", "UAE's Foremost Commercial Interiors Specialist")} as="p" className="text-white/70 text-sm md:text-base mt-1" page="home" label="Video Subtitle" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {isPlaying && createPortal(
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-4 md:p-8" onClick={() => setIsPlaying(false)}>
          <button onClick={() => setIsPlaying(false)} className="absolute top-6 right-6 w-12 h-12 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors z-10" aria-label="Close video">
            <X className="w-6 h-6 text-black" />
          </button>
          <div className="w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe src="https://www.youtube.com/embed/CTxNDWI-YVo?autoplay=1&rel=0&modestbranding=1" title="Winteriors Decor LLC Video" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
