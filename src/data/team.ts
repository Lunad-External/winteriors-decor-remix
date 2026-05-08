import binojTc from "@/assets/team/binoj-tc.jpg";
import swarajKj from "@/assets/team/swaraj-kj.jpg";
import sushmitaMaity from "@/assets/team/sushmita-maity.jpg";
import shazadJaved from "@/assets/team/shazad-javed.jpg";
import khalidAk from "@/assets/team/khalid-ak.jpg";
import mohammedAbdulQavi from "@/assets/team/mohammed-abdul-qavi.jpg";
import dollyVk from "@/assets/team/dolly-vk.jpg";
import rashidJaved from "@/assets/team/rashid-javed.jpg";
import usaidBhati from "@/assets/team/usaid-bhati.jpg";
import alyssaGene from "@/assets/team/alyssa-gene.jpg";
import nitinChakor from "@/assets/team/nitin-chakor.jpg";
import abdulBasith from "@/assets/team/abdul-basith.jpg";
import devikaAnil from "@/assets/team/devika-anil.jpeg";
import shabanaKotta from "@/assets/team/shabana-kotta.jpg";
import arfanAhmed from "@/assets/team/arfan-ahmed.jpeg";
import sanaK from "@/assets/team/sana-k.jpg";
import arunMohan from "@/assets/team/arun-mohan.jpg";
import sanuSunny from "@/assets/team/sanu-sunny.jpg";
import abhinavMb from "@/assets/team/abhinav-mb.jpeg";
import azamMohammed from "@/assets/team/azam-mohammed.jpg";
import sudheeshPartner from "@/assets/team/sudheesh-partner.jpg";

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  objectPosition?: string;
  scale?: number;
}

export const teamMembers: TeamMember[] = [
  { name: "Sudheesh", role: "Partner", image: sudheeshPartner, objectPosition: "center 15%", scale: 1.15 },
  { name: "Binoj TC", role: "Partner", image: binojTc, objectPosition: "center 15%", scale: 1.15 },
  { name: "Swaraj KJ", role: "Operations Manager", image: swarajKj, objectPosition: "center 20%", scale: 1.0 },
  { name: "Nitin Chakor", role: "Chief Finance Officer", image: nitinChakor, objectPosition: "center 18%", scale: 1.05 },
  { name: "Sushmita Maity", role: "Sr. Business Development Manager", image: sushmitaMaity, objectPosition: "center 8%", scale: 1.2 },
  { name: "Dolly VK", role: "Design Team Lead & Sr. Architect", image: dollyVk, objectPosition: "center 5%", scale: 1.25 },
  { name: "Rashid Javed Goar", role: "Design Team Lead & Architect", image: rashidJaved, objectPosition: "center 25%", scale: 0.95 },
  { name: "Arun Mohan", role: "Sr. 3D Visualizer", image: arunMohan, objectPosition: "center 12%", scale: 1.15 },
  { name: "Sanu Sunny", role: "3D Visualizer", image: sanuSunny, objectPosition: "center 15%", scale: 1.1 },
  { name: "Usaid Bhati", role: "Architect", image: usaidBhati, objectPosition: "center 22%", scale: 1.0 },
  { name: "Abdul Basith", role: "Architect", image: abdulBasith, objectPosition: "center 12%", scale: 1.15 },
  { name: "Shabana Kotta", role: "Architect", image: shabanaKotta, objectPosition: "center 5%", scale: 1.25 },
  { name: "Devika Anil", role: "Interior Designer", image: devikaAnil, objectPosition: "center 5%", scale: 1.25 },
  { name: "Arfan Ahmed", role: "Architect", image: arfanAhmed, objectPosition: "center 15%", scale: 1.1 },
  { name: "Sana K", role: "Architect", image: sanaK, objectPosition: "center 5%", scale: 1.25 },
  { name: "Abhinav MB", role: "3D Visualizer", image: abhinavMb, objectPosition: "center 15%", scale: 1.1 },
  { name: "Azam Mohammed", role: "Draftsman", image: azamMohammed, objectPosition: "center 15%", scale: 1.1 },
  { name: "Shazad Javed", role: "Sr. Project Manager", image: shazadJaved, objectPosition: "center 15%", scale: 1.1 },
  { name: "Mohammed Abdul Qavi", role: "QHSE – Team Head", image: mohammedAbdulQavi, objectPosition: "center 14%", scale: 1.1 },
  { name: "Khalid AK", role: "Project Engineer", image: khalidAk, objectPosition: "center 18%", scale: 1.05 },
  { name: "Alyssa Gene", role: "HR & Office Administrator", image: alyssaGene, objectPosition: "center 5%", scale: 1.25 },
];
