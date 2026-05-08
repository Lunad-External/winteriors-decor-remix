import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  /** Width for Google Drive thumbnail (default: original) */
  thumbnailWidth?: number;
  /** Enable blur-up effect */
  blurUp?: boolean;
  /** Eager load (above the fold) */
  eager?: boolean;
}

/**
 * Generates a resized Google Drive URL.
 * Original: =s0
 * Thumbnail: =w{width}
 */
function getDriveUrl(src: string, width?: number): string {
  if (!src) return src;

  // Google Drive URLs
  if (src.includes("lh3.googleusercontent.com")) {
    if (width) {
      return src.replace(/=s\d+$/, `=w${width}`).replace(/=w\d+$/, `=w${width}`);
    }
    // Ensure full resolution
    if (!src.includes("=s0") && !src.includes("=w")) {
      return src + "=s0";
    }
  }

  return src;
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
  const imgRef = useRef<HTMLImageElement>(null);

  const fullSrc = getDriveUrl(src);
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
          src={fullSrc}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
