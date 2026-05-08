import projectCorporate from "@/assets/project-corporate.jpg";
import projectRetail from "@/assets/project-retail.jpg";
import projectHospitality from "@/assets/project-hospitality.jpg";
import projectHealthcare from "@/assets/project-healthcare.jpg";
import projectLibrary from "@/assets/project-library.jpg";
import projectOpenplan from "@/assets/project-openplan.jpg";
import projectHotelLobby from "@/assets/project-hotel-lobby.jpg";
import projectClinic from "@/assets/project-clinic.jpg";
import projectBoutique from "@/assets/project-boutique.jpg";
import galleryBoardroom from "@/assets/gallery-boardroom.jpg";
import bgModernWorkspace from "@/assets/bg-modern-workspace.jpg";
import bgCorporateOffice from "@/assets/bg-corporate-office.jpg";
import bgConferenceRoom from "@/assets/bg-conference-room.jpg";
import bgRetailSpace from "@/assets/bg-retail-space.jpg";
import bgHotelLobby from "@/assets/bg-hotel-lobby.jpg";

export interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  area?: string;
  year: string;
  scope?: string;
  image: string;
  description?: string;
}

export const projects: Project[] = [
  { id: 1, title: "Ben's Cookies", category: "Retail", location: "Dubai, UAE", area: "120 SQM", year: "2021", scope: "Design & Build", image: projectRetail, description: "A warm and inviting retail space designed to enhance the Ben's Cookies brand experience." },
  { id: 2, title: "Gulf Tech", category: "Offices", location: "Abu Dhabi, UAE", area: "600 SQM", year: "2019", scope: "Design & Built", image: projectCorporate, description: "Modern corporate headquarters featuring open-plan workspaces and executive suites." },
  { id: 3, title: "All Energy Services (AES)", category: "Offices", location: "Dubai, UAE", area: "450 SQM", year: "2020", scope: "Design & Build", image: projectOpenplan, description: "Dynamic office space designed for collaboration and productivity." },
  { id: 4, title: "STS Library", category: "Education", location: "Abu Dhabi, UAE", area: "800 SQM", year: "2022", scope: "Full Fit-Out", image: projectLibrary, description: "State-of-the-art educational library with modern learning spaces." },
  { id: 5, title: "Alpha Data", category: "Offices", location: "Dubai, UAE", area: "520 SQM", year: "2021", scope: "Design & Build", image: galleryBoardroom, description: "Executive office with premium boardroom and meeting facilities." },
  { id: 6, title: "Rais Hassan Saadi", category: "Offices", location: "Abu Dhabi, UAE", area: "380 SQM", year: "2020", scope: "Refurbishment", image: bgCorporateOffice, description: "Complete office refurbishment with modern design elements." },
  { id: 7, title: "Adveti Library", category: "Education", location: "Abu Dhabi, UAE", area: "700 SQM", year: "2023", scope: "Full Fit-Out", image: projectLibrary, description: "Contemporary library design promoting learning and collaboration." },
  { id: 8, title: "Alpha Data Phase 2", category: "Control Room", location: "Dubai, UAE", area: "650 SQM", year: "2023", scope: "Expansion", image: bgModernWorkspace, description: "Expansion of the Alpha Data headquarters with additional workspaces." },
  { id: 9, title: "Ben's Cookies Phase 2", category: "Retail", location: "Dubai, UAE", area: "150 SQM", year: "2022", scope: "Design & Build", image: projectBoutique, description: "Second outlet maintaining brand consistency with unique local touches." },
  { id: 10, title: "Ben's Cookies Phase 3", category: "Retail", location: "Abu Dhabi, UAE", area: "180 SQM", year: "2023", scope: "Design & Build", image: bgRetailSpace, description: "Abu Dhabi expansion featuring the signature warm aesthetic." },
  { id: 11, title: "Network Operations Center", category: "Control Room", location: "Dubai, UAE", area: "1200 SQM", year: "2022", scope: "Full Fit-Out", image: projectHotelLobby, description: "State-of-the-art network operations center with advanced monitoring systems." },
  { id: 12, title: "Command Control Center", category: "Control Room", location: "Abu Dhabi, UAE", area: "400 SQM", year: "2021", scope: "Design & Build", image: projectClinic, description: "Modern command center facility designed for operational excellence." },
  { id: 13, title: "Emirates Group Office", category: "Offices", location: "Dubai, UAE", area: "850 SQM", year: "2024", scope: "Full Fit-Out", image: bgConferenceRoom, description: "Premium corporate office with state-of-the-art meeting facilities." },
  { id: 14, title: "Training Academy", category: "Education", location: "Abu Dhabi, UAE", area: "950 SQM", year: "2024", scope: "Design & Build", image: bgHotelLobby, description: "Professional training facility with modern learning environments." },
  { id: 15, title: "Tech Hub Innovation Center", category: "Offices", location: "Dubai, UAE", area: "720 SQM", year: "2025", scope: "Full Fit-Out", image: projectHospitality, description: "Modern innovation center designed for tech startups and collaboration." },
];

export const featuredProjects: Project[] = projects.slice(0, 6);

export const projectCategories = ["All", "Offices", "Retail", "Education", "Control Room"];
