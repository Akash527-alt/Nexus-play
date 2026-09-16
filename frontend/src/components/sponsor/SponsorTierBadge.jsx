import React from "react";
import { Award, Crown, Shield, Star, Zap } from "lucide-react";

export function SponsorTierBadge({ tier, size = "md" }) {
  const normalized = (tier || "").toLowerCase();

  let config = {
    label: tier || "Partner",
    bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    icon: Star,
  };

  if (normalized.includes("title")) {
    config = {
      label: tier || "Title Sponsor",
      bg: "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-xs shadow-amber-500/20",
      icon: Crown,
    };
  } else if (normalized.includes("platinum")) {
    config = {
      label: tier || "Platinum Partner",
      bg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/40",
      icon: Award,
    };
  } else if (normalized.includes("gold")) {
    config = {
      label: tier || "Gold Partner",
      bg: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
      icon: Shield,
    };
  } else if (normalized.includes("silver")) {
    config = {
      label: tier || "Silver Partner",
      bg: "bg-slate-400/15 text-slate-300 border-slate-400/40",
      icon: Star,
    };
  } else if (normalized.includes("community") || normalized.includes("booster")) {
    config = {
      label: tier || "Community Booster",
      bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
      icon: Zap,
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px] gap-1" : "px-3 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{config.label}</span>
    </span>
  );
}

export default SponsorTierBadge;
