import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { getStorageUrl } from "@/lib/storage";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  /** Width for Google Drive thumbnail (default: original) */
  thumbnailWidth?: number;
  /** Enable blur-up effect */
  blurUp?: boolean;
  /** Eager load (above the fold) */
  eager?: boolean;
}

function getDriveUrl(src: string, width?: number): string {
  const resolved = getStorageUrl(src);
  if (!resolved) return resolved;

  // Google Drive URLs
  if (resolved.includes("lh3.googleusercontent.com")) {
    if (resolved.includes("?")) return resolved;
    if (width) {
      return resolved.replace(/=s\d+$/, `=w${width}`).replace(/=w\d+$/, `=w${width}`);
    }
    if (!resolved.includes("=s0") && !resolved.includes("=w")) {
      return resolved + "=s0";
    }
  }

  return resolved;
}

export function OptimizedImage({
  src,
  thumbnailWidth,
  blurUp = true,
  eager = false,
  className,
  alt = "",
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(eager);
  const [imgSrc, setImgSrc] = useState<string>(() => getDriveUrl(src));
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(getDriveUrl(src));
  }, [src]);

  const thumbSrc = blurUp && thumbnailWidth ? getDriveUrl(src, thumbnailWidth) : undefined;

  // Lazy loading via IntersectionObserver
  useEffect(() => {
    if (eager || inView) return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eager, inView]);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)} {...props}>
      {/* Blur placeholder */}
      {blurUp && thumbSrc && !loaded && (
        <img
          src={thumbSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
        />
      )}

      {/* Full image */}
      {inView && (
        <img
          src={imgSrc}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => {
            const fallback = getStorageUrl(null);
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            }
          }}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
