import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    });
    return () => ctx.revert();
  }, [location.pathname]);

  return <div ref={containerRef}>{children}</div>;
};
