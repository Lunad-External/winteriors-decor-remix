import {
  Wrench, Layers, Square, Grid3X3, Zap, Flame, Monitor, Wind, Shield, Tv, LucideIcon
} from "lucide-react";

export interface TechnicalService {
  icon: LucideIcon;
  title: string;
}

export const technicalServices: TechnicalService[] = [
  { icon: Wrench, title: "Civil Works" },
  { icon: Layers, title: "Gypsum Works" },
  { icon: Square, title: "Glass Works" },
  { icon: Grid3X3, title: "Joinery Works" },
  { icon: Layers, title: "Walls & Windows" },
  { icon: Grid3X3, title: "Flooring" },
  { icon: Zap, title: "Electrical Works" },
  { icon: Flame, title: "Fire Fighting & Alarm" },
  { icon: Monitor, title: "IT Works" },
  { icon: Wind, title: "Air Conditioning Works" },
  { icon: Shield, title: "Security Systems" },
  { icon: Tv, title: "AV Works" },
];
