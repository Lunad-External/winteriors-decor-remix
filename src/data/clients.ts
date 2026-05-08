import client01 from "@/assets/logos/client-01.jpg";
import client02 from "@/assets/logos/client-02.jpg";
import client03 from "@/assets/logos/client-03.jpg";
import client04 from "@/assets/logos/client-04.jpg";
import client05 from "@/assets/logos/client-05.jpg";
import client06 from "@/assets/logos/client-06.jpg";
import client07 from "@/assets/logos/client-07.jpg";
import client08 from "@/assets/logos/client-08.jpg";
import client09 from "@/assets/logos/client-09.jpg";
import client10 from "@/assets/logos/client-10.jpg";
import client11 from "@/assets/logos/client-11.jpg";
import client12 from "@/assets/logos/client-12.jpg";
import client13 from "@/assets/logos/client-13.jpg";
import client14 from "@/assets/logos/client-14.jpg";
import client15 from "@/assets/logos/client-15.jpg";
import client16 from "@/assets/logos/client-16.jpg";
import client17 from "@/assets/logos/client-17.jpg";
import client18 from "@/assets/logos/client-18.jpg";
import client19 from "@/assets/logos/client-19.jpg";
import client20 from "@/assets/logos/client-20.jpg";
import client21 from "@/assets/logos/client-21.jpg";
import client22 from "@/assets/logos/client-22.jpg";
import client23 from "@/assets/logos/client-23.jpg";
import client24 from "@/assets/logos/client-24.jpg";
import client25 from "@/assets/logos/client-25.jpg";

export interface Client {
  name: string;
  logo: string;
}

export const clients: Client[] = [
  { name: "Oracle", logo: client21 },
  { name: "Alcatel-Lucent", logo: client04 },
  { name: "Cofely Besix", logo: client09 },
  { name: "AgustaWestland", logo: client25 },
  { name: "McLarens Aviation", logo: client22 },
  { name: "TNT", logo: client14 },
  { name: "The Linde Group", logo: client17 },
  { name: "Larsen & Toubro", logo: client01 },
  { name: "ADNOC", logo: client07 },
  { name: "Emirates Identity Authority", logo: client02 },
  { name: "UAE NCEMA", logo: client23 },
  { name: "VAMED", logo: client03 },
  { name: "Zublin", logo: client05 },
  { name: "ADIB", logo: client06 },
  { name: "Aurecon", logo: client08 },
  { name: "ADVETI", logo: client10 },
  { name: "Alpha Data", logo: client11 },
  { name: "Samsung", logo: client12 },
  { name: "Hill International", logo: client13 },
  { name: "FMC Technologies", logo: client15 },
  { name: "TAPI", logo: client16 },
  { name: "Site Technology", logo: client18 },
  { name: "National Life & General Insurance", logo: client19 },
  { name: "Gyproc Saint-Gobain", logo: client20 },
  { name: "Serco", logo: client24 },
];

export const featuredClients = clients.slice(0, 12);
