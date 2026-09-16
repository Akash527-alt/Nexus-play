import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, DollarSign, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { sponsorService } from "../../services/sponsorService";
import { SponsorTierBadge } from "./SponsorTierBadge";

const TIERS = [
  {
    name: "Title Sponsor",
    defaultAmount: 5000,
    perks: [
      "Tournament naming rights (e.g., [Brand] Invitational)",
      "Main broadcast banner & animated HUD overlay",
      "Prime physical booth & backdrop banner",
      "Daily dedicated sponsor interview segment",
    ],
  },
  {
    name: "Gold Partner",
    defaultAmount: 2500,
    perks: [
      "Live stream lower-third banner rotation",
      "Prize distribution co-announcement",
      "Logo on all official graphics & social posts",
    ],
  },
  {
    name: "Silver Partner",
    defaultAmount: 1000,
    perks: [
      "Logo on tournament landing page",
      "Discord server announcement & role tag",
      "Community match bracket mention",
    ],
  },
  {
    name: "Community Booster",
    defaultAmount: 350,
    perks: [
      "Logo in bracket stream end-credits",
      "Shoutout during community stream",
    ],
  },
];

export function SponsorModal({ tournament, isOpen, onClose, onSuccess }) {
  const [selectedTier, setSelectedTier] = useState(TIERS[1]); // Default Gold
  const [amount, setAmount] = useState(TIERS[1].defaultAmount);
  const [customMessage, setCustomMessage] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !tournament) return null;

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setAmount(tier.defaultAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid sponsorship amount");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please agree to the sponsorship engagement terms");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        tournamentId: tournament._id || tournament.id || "t_" + Date.now(),
        tournamentTitle: tournament.name || tournament.title || "Esports Championship",
        game: tournament.game || "Competitive Esports",
        tier: selectedTier.name,
        amount: Number(amount),
        organizerName: tournament.organizer?.name || tournament.organizer || "Event Organizer",
        organizerEmail: tournament.organizer?.email || "organizer@nexusplay.gg",
        deliverables: selectedTier.perks,
        message: customMessage,
      };

      const res = await sponsorService.sponsorTournament(payload);
      if (res.success) {
        toast.success(`Sponsorship proposal sent to ${payload.organizerName}!`);
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch {
      toast.error("Failed to submit sponsorship proposal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="theme-card border theme-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b theme-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold theme-text">Sponsor Tournament</h2>
              <p className="text-xs theme-subtext">
                Back <span className="font-semibold text-indigo-400">{tournament.name || tournament.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg theme-hover theme-subtext hover:theme-text transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Tournament Quick Info */}
          <div className="p-3.5 rounded-xl border theme-border theme-icon-box flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="theme-subtext">Game:</span>{" "}
              <span className="font-bold theme-text">{tournament.game || "Esports"}</span>
            </div>
            <div>
              <span className="theme-subtext">Prize Pool:</span>{" "}
              <span className="font-bold text-amber-500">
                ${tournament.prizePool || tournament.totalPrizePool || 5000}
              </span>
            </div>
            <div>
              <span className="theme-subtext">Organizer:</span>{" "}
              <span className="font-bold theme-text">
                {tournament.organizer?.name || tournament.organizer || "Verified Host"}
              </span>
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-2.5">
              Choose Sponsorship Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIERS.map((tier) => {
                const isSelected = selectedTier.name === tier.name;
                return (
                  <div
                    key={tier.name}
                    onClick={() => handleTierSelect(tier)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600/10 shadow-xs shadow-indigo-600/20"
                        : "theme-border theme-card theme-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <SponsorTierBadge tier={tier.name} size="sm" />
                      <span className="text-sm font-extrabold text-indigo-400">
                        ${tier.defaultAmount.toLocaleString()}
                      </span>
                    </div>
                    <ul className="space-y-1 text-[11px] theme-subtext">
                      {tier.perks.slice(0, 2).map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
              Pledge Amount ($ USD)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom funding amount"
                className="theme-input w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              />
            </div>
            <p className="text-[11px] theme-subtext mt-1">
              Minimum suggested for {selectedTier.name} is ${selectedTier.defaultAmount}.
            </p>
          </div>

          {/* Message / Deliverables Proposal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
              Brand Message & Deliverables Notes
            </label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g. We will provide 5 custom gaming headsets as giveaway prizes, along with high-res overlay assets..."
              className="theme-input w-full p-3 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {/* Agreement */}
          <div className="flex items-start gap-2.5 pt-2 border-t theme-border">
            <input
              type="checkbox"
              id="terms"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-1 rounded accent-indigo-600 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs theme-subtext cursor-pointer leading-relaxed">
              I agree to the <span className="text-indigo-400 underline">NexusPlay Esports Sponsorship Terms</span>. Funds will be held in secure escrow until tournament milestones are verified.
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t theme-border flex items-center justify-end gap-3 theme-card">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold theme-subtext theme-hover rounded-xl cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl cursor-pointer transition shadow-md shadow-indigo-600/30"
          >
            <ShieldCheck className="w-4 h-4" />
            {submitting ? "Sending Proposal..." : `Confirm & Pledge $${Number(amount || 0).toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SponsorModal;
