import React from "react";
import { Trophy, Calendar, Users, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { SponsorTierBadge } from "./SponsorTierBadge";

export function SponsorCard({ deal, onViewDetails }) {
  if (!deal) return null;

  const isPending = deal.status === "pending";
  const isActive = deal.status === "active";
  const isApproved = deal.status === "approved";

  return (
    <div className="theme-card border theme-border rounded-2xl p-5 hover:border-indigo-500/40 transition-all shadow-xs flex flex-col justify-between group">
      <div>
        {/* Top meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <SponsorTierBadge tier={deal.tier} size="sm" />
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : isApproved
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                : isPending
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-slate-500/10 text-slate-400 border-slate-500/30"
            }`}
          >
            {deal.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold theme-text leading-snug line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {deal.tournamentTitle}
        </h3>
        <p className="text-xs theme-subtext mt-1 flex items-center gap-1.5">
          <span>Game:</span>
          <span className="font-semibold theme-text">{deal.game}</span>
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl theme-icon-box border theme-border text-xs">
          <div>
            <p className="text-[10px] theme-subtext uppercase">Pledged</p>
            <p className="font-extrabold text-indigo-400 text-sm mt-0.5">
              ${Number(deal.amount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] theme-subtext uppercase">Est. Reach</p>
            <p className="font-bold theme-text text-sm mt-0.5">{deal.audienceReach || "50K+"}</p>
          </div>
        </div>

        {/* Deliverables snippet */}
        {deal.deliverables && deal.deliverables.length > 0 && (
          <div className="space-y-1 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">Deliverables</p>
            {deal.deliverables.slice(0, 2).map((deliv, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] theme-subtext">
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{deliv}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom info & Action */}
      <div className="pt-3 border-t theme-border flex items-center justify-between text-xs">
        <span className="text-[11px] theme-subtext flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {deal.date || "Active"}
        </span>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(deal)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
          >
            <span>View Deal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SponsorCard;
