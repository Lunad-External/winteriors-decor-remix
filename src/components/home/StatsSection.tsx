import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EditableText } from "@/components/common/EditableText";
import { useSiteContent } from "@/hooks/useSiteContent";

gsap.registerPlugin(ScrollTrigger);

const Counter = ({ end, suffix = "", duration = 2 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: counterRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, { val: end, duration, ease: "power2.out", onUpdate: function() { setCount(Math.round(this.targets()[0].val)); } });
        }
      });
    }, counterRef);
    return () => ctx.revert();
  }, [end, duration]);

  return <span ref={counterRef}>{count}{suffix}</span>;
};

export const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { get, getNum } = useSiteContent();

  const stats = [
    { value: getNum("stat_years", 17), suffix: "+", key: "stat_years_label", label: "Years of Experience" },
    { value: getNum("stat_projects", 600), suffix: "+", key: "stat_projects_label", label: "Projects" },
    { value: getNum("stat_team", 40), suffix: "+", key: "stat_team_label", label: "Core Team Members" },
    { value: getNum("stat_satisfaction", 100), suffix: "%", key: "stat_satisfaction_label", label: "Client Satisfaction" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".stat-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 md:py-12 bg-primary relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.key} className="stat-card text-center p-4 md:p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1"><Counter end={stat.value} suffix={stat.suffix} /></div>
              <EditableText contentKey={stat.key} fallback={stat.label} value={get(stat.key, stat.label)} as="p" className="text-white/80 text-xs md:text-sm uppercase tracking-wider" page="home" label={`Stat Label: ${stat.label}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
