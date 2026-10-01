import projectCorporate from "@/assets/project-corporate.jpg";
import projectRetail from "@/assets/project-retail.jpg";
import projectOpenplan from "@/assets/project-openplan.jpg";
import projectLibrary from "@/assets/project-library.jpg";
import projectBoutique from "@/assets/project-boutique.jpg";
import projectClinic from "@/assets/project-clinic.jpg";
import projectHospitality from "@/assets/project-hospitality.jpg";
import projectHotelLobby from "@/assets/project-hotel-lobby.jpg";
import projectHealthcare from "@/assets/project-healthcare.jpg";
import bgCorporateOffice from "@/assets/bg-corporate-office.jpg";
import bgConferenceRoom from "@/assets/bg-conference-room.jpg";
import bgModernWorkspace from "@/assets/bg-modern-workspace.jpg";
import bgRetailSpace from "@/assets/bg-retail-space.jpg";
import bgLuxuryLiving from "@/assets/bg-luxury-living.jpg";
import galleryBoardroom from "@/assets/gallery-boardroom.jpg";
import dubaiModernOffice from "@/assets/dubai-modern-office.jpg";
import dubaiLoungeInterior from "@/assets/dubai-lounge-interior.jpg";
import dubaiPenthouseInterior from "@/assets/dubai-penthouse-interior.jpg";
import heroOffice from "@/assets/hero-office.jpg";

const PROJECT_GALLERIES: Record<string, string[]> = {
  "bens-cookies": [
    projectRetail,
    projectBoutique,
    bgRetailSpace,
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop"
  ],
  "gulf-tech": [
    projectCorporate,
    bgModernWorkspace,
    dubaiModernOffice,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop"
  ],
  "all-energy-services-aes": [
    projectOpenplan,
    bgCorporateOffice,
    dubaiLoungeInterior,
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=1200&auto=format&fit=crop"
  ],
  "sts-library": [
    projectLibrary,
    heroOffice,
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
  ],
  "alpha-data": [
    galleryBoardroom,
    bgConferenceRoom,
    dubaiPenthouseInterior,
    "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop"
  ],
  "rais-hassan-saadi": [
    bgCorporateOffice,
    dubaiPenthouseInterior,
    bgLuxuryLiving,
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1200&auto=format&fit=crop"
  ],
  "adveti-library": [
    projectLibrary,
    projectOpenplan,
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
  ],
  "alpha-data-phase-2": [
    bgModernWorkspace,
    dubaiModernOffice,
    galleryBoardroom,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop"
  ],
  "bens-cookies-phase-2": [
    projectBoutique,
    projectRetail,
    bgRetailSpace,
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop"
  ],
  "bens-cookies-phase-3": [
    bgRetailSpace,
    projectRetail,
    projectBoutique,
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop"
  ],
  "network-operations-center": [
    projectHotelLobby,
    projectClinic,
    dubaiModernOffice,
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
  ],
  "command-control-center": [
    projectClinic,
    projectHotelLobby,
    bgConferenceRoom,
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
  ],
  "emirates-group-office": [
    bgConferenceRoom,
    dubaiPenthouseInterior,
    bgCorporateOffice,
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop"
  ],
  "training-academy": [
    projectHospitality,
    projectOpenplan,
    heroOffice,
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop"
  ],
  "tech-hub-innovation-center": [
    dubaiModernOffice,
    dubaiLoungeInterior,
    bgModernWorkspace,
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop"
  ]
};

// Known Google Drive Folder IDs or broken test paths to exclude from direct Google rendering
const INVALID_DRIVE_IDS = new Set([
  "1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k",
  "1ealvK5g9n0XJUnt_Dbaq8_DfEFvNffsf",
  "16QKC9J8jlwU5I08rN2kh0FOhAqcG8VCs",
]);

export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return projectCorporate;

  // Handle local asset paths or data URLs
  if (path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  // Handle direct asset import paths or public projects images
  if (path.startsWith("/projects-images/") || path.startsWith("/src/assets/") || path.startsWith("/assets/")) {
    return path;
  }

  // Handle full HTTP/HTTPS URLs
  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (path.includes("1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k")) {
      return projectCorporate;
    }
    const idMatch = path.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/) ||
      path.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
      path.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    if (idMatch) {
      return `/drive-image/${idMatch[1]}`;
    }
    if (path.includes("drive-storage")) {
      const matchId = path.match(/([a-zA-Z0-9_-]{25,})/);
      if (matchId) {
        return `/drive-image/${matchId[1]}`;
      }
    }
    return path;
  }

  // Check if path is a 25+ char Google Drive File ID
  if (/^[a-zA-Z0-9_-]{25,}$/.test(path)) {
    if (INVALID_DRIVE_IDS.has(path)) {
      return projectCorporate;
    }
    return `/drive-image/${path}`;
  }

  // Handle relative project storage paths (e.g. "bens-cookies/01.jpg" or "gulf-tech/05.jpg")
  const parts = path.split("/");
  const slug = parts[0];
  const filename = parts[1] || "";

  const gallery = PROJECT_GALLERIES[slug];
  if (gallery && gallery.length > 0) {
    if (filename) {
      const numMatch = filename.match(/(\d+)/);
      const index = numMatch ? Math.max(0, parseInt(numMatch[1], 10) - 1) : 0;
      return gallery[index % gallery.length];
    }
    return gallery[0];
  }

  return projectCorporate;
}

/**
 * Returns a direct usercontent fallback URL for img onError handlers.
 * Extracts the Drive file ID from any supported URL format.
 */
export function getDriveFallbackUrl(src: string): string | null {
  // Extract file ID from uc?export=view&id=... or thumbnail?id=... URLs
  const match = src.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (match) {
    return `https://drive.usercontent.google.com/download?id=${match[1]}&export=view`;
  }
  return null;
}


