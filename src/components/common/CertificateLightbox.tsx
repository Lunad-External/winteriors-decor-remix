import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import iso9001Cert from "@/assets/certificates/iso-9001-cert.jpg";
import iso14001Cert from "@/assets/certificates/iso-14001-cert.jpg";
import iso45001Cert from "@/assets/certificates/iso-45001-cert.jpg";

const certificates = [
  { name: "ISO 9001:2015", label: "Quality Management System", image: iso9001Cert },
  { name: "ISO 14001:2015", label: "Environmental Management", image: iso14001Cert },
  { name: "ISO 45001:2018", label: "Occupational Health & Safety", image: iso45001Cert },
];

interface CertificateLightboxProps {
  certName: string;
  onClose: () => void;
}

export const CertificateLightbox = ({ certName, onClose }: CertificateLightboxProps) => {
  const initialIndex = certificates.findIndex(c => c.name === certName);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [zoomed, setZoomed] = useState(false);

  const cert = certificates[activeIndex];

  const goNext = () => setActiveIndex((i) => (i + 1) % certificates.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + certificates.length) % certificates.length);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-foreground/90 backdrop-blur-sm flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20" onClick={(e) => e.stopPropagation()}>
        <div className="text-white">
          <h3 className="text-lg font-semibold font-poppins">{cert.name}</h3>
          <p className="text-sm text-white/60">{cert.label}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoomed(!zoomed)}
            className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            title={zoomed ? "Zoom out" : "Zoom in"}
          >
            {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); setZoomed(false); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); setZoomed(false); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div
        className={`flex-1 flex items-center justify-center w-full px-16 py-20 ${zoomed ? "overflow-auto cursor-zoom-out" : "cursor-zoom-in"}`}
        onClick={(e) => {
          e.stopPropagation();
          setZoomed(!zoomed);
        }}
      >
        <img
          src={cert.image}
          alt={`${cert.name} Certificate`}
          className={`shadow-2xl rounded-lg transition-all duration-300 ${
            zoomed
              ? "max-w-none w-[900px]"
              : "max-h-[75vh] max-w-full w-auto h-auto object-contain"
          }`}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20" onClick={(e) => e.stopPropagation()}>
        {certificates.map((c, i) => (
          <button
            key={c.name}
            onClick={() => { setActiveIndex(i); setZoomed(false); }}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              i === activeIndex
                ? "bg-white text-primary"
                : "bg-white/15 text-white/70 hover:bg-white/25 hover:text-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};
