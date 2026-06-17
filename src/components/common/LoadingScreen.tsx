import { useEffect, useState } from "react";
import { gsap } from "gsap";
import winteriorsLogo from "@/assets/logos/winteriors-logo.png";

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const screen = document.querySelector(".loading-screen");
    const progress = document.querySelector(".loading-progress");
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallbackTimeout);
        setIsLoading(false);
      },
    });

    tl.to(progress, {
      width: "100%",
      duration: 1.2,
      ease: "power2.inOut",
    })
    .to(screen, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
    }, "+=0.1");

    return () => {
      clearTimeout(fallbackTimeout);
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen fixed inset-0 z-[100] bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={winteriorsLogo} alt="Winteriors Decor LLC logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-2xl text-white">Winteriors</span>
            <span className="block text-sm text-white/60 -mt-1">Decor LLC</span>
          </div>
        </div>
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="loading-progress h-full bg-white rounded-full w-0" />
        </div>
      </div>
    </div>
  );
};
