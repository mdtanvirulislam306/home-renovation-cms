import { Shield, Clock, Award, Leaf, Star, Check, Heart, Zap, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  clock: Clock,
  award: Award,
  leaf: Leaf,
  star: Star,
  check: Check,
  heart: Heart,
  zap: Zap,
};

export function getFeatureIcon(name: string): LucideIcon {
  return iconMap[name.toLowerCase()] || Shield;
}
