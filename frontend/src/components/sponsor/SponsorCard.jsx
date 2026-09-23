import React from "react";
import { Calendar, ArrowUpRight, CreditCard } from "lucide-react";

export function SponsorCard({ deal, onViewDetails }) {
  if (!deal) {
    return null;
  }

  const tournamentTitle =
    deal.tournamentId?.title || deal.tournamentTitle || "Tournament";

  const game = deal.tournamentId?.game || deal.game || "Esports";

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";

      case "approved":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

      case "rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";

      case "completed":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getPaymentText = () => {
    switch (deal.paymentStatus) {
      case "pending":
        return "Payment Pending";

      case "paid":
        return "Paid";

      case "failed":
        return "Payment Failed";

      case "refunded":
        return "Refunded";

      default:
        return "Payment Not Required";
    }
  };

  return (
    <div className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xs">
      <div>
        {/* Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusStyle(
              deal.status,
            )}`}
          >
            {deal.status}
          </span>

          <span className="text-[10px] theme-subtext flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            {getPaymentText()}
          </span>
        </div>

        {/* Tournament */}
        <h3 className="text-sm font-bold theme-text leading-snug line-clamp-2">
          {tournamentTitle}
        </h3>

        <p className="text-xs theme-subtext mt-1">
          Game: <span className="font-semibold theme-text">{game}</span>
        </p>

        {/* Amount */}
        <div className="my-4 p-3 rounded-xl theme-icon-box border theme-border">
          <p className="text-[10px] theme-subtext uppercase">
            Sponsorship Amount
          </p>

          <p className="font-extrabold text-indigo-400 text-lg mt-0.5">
            ₹{Number(deal.amount || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Requirements */}
        {deal.requirements && (
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">
              Proposal
            </p>

            <p className="text-[11px] theme-subtext line-clamp-3">
              {deal.requirements}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-4 border-t theme-border flex items-center justify-between text-xs">
        <span className="text-[11px] theme-subtext flex items-center gap-1">
          <Calendar className="w-3 h-3" />

          {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : "—"}
        </span>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(deal)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
          >
            <span>View Details</span>

            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SponsorCard;
