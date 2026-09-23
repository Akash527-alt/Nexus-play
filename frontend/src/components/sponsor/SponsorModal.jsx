import React, { useEffect, useState } from "react";
import {
  X,
  ShieldCheck,
  DollarSign,
  FileText,
  MessageSquare,
  Calendar,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { sponsorService } from "../../services/sponsorService";

export function SponsorModal({ tournament, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [requirements, setRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setRequirements("");
      setMessage("");
      setAgreedTerms(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !tournament) {
    return null;
  }

  const tournamentId = tournament._id || tournament.id;

  const tournamentTitle = tournament.title || tournament.name || "Tournament";

  const prizePool = tournament.prizePool || tournament.totalPrizePool || 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tournamentId) {
      toast.error("Tournament ID is missing.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid sponsorship amount.");
      return;
    }

    if (!requirements.trim()) {
      toast.error("Please describe your sponsorship requirements.");
      return;
    }

    if (!agreedTerms) {
      toast.error("Please agree to the sponsorship terms.");
      return;
    }

    try {
      setSubmitting(true);

      const sponsorshipData = {
        amount: Number(amount),
        requirements: requirements.trim(),
        message: message.trim(),
      };

      const response = await sponsorService.sponsorTournament(
        tournamentId,
        sponsorshipData,
      );

      if (response?.success) {
        toast.success("Sponsorship request submitted successfully.");

        if (onSuccess) {
          onSuccess(response.data);
        }

        onClose();
      }
    } catch (error) {
      console.error("Sponsorship request error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to submit sponsorship request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="theme-card border theme-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b theme-border flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
              Sponsorship Proposal
            </p>

            <h2 className="text-lg font-bold theme-text mt-1">
              Sponsor Tournament
            </h2>

            <p className="text-xs theme-subtext mt-1">
              Submit your sponsorship proposal to the tournament organizer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg theme-hover theme-subtext hover:theme-text transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-5 flex-1"
        >
          {/* Tournament Information */}
          <div className="theme-icon-box border theme-border rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold theme-subtext">
                  Selected Tournament
                </p>

                <h3 className="text-sm font-bold theme-text mt-1">
                  {tournamentTitle}
                </h3>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] theme-subtext">
                  <span>
                    Game:{" "}
                    <span className="font-semibold theme-text">
                      {tournament.game || "Esports"}
                    </span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />

                    {tournament.startDate
                      ? new Date(tournament.startDate).toLocaleDateString()
                      : "Date TBA"}
                  </span>

                  <span>
                    Prize Pool:{" "}
                    <span className="font-semibold text-amber-400">
                      ₹{Number(prizePool).toLocaleString("en-IN")}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
              Sponsorship Amount
            </label>

            <div className="relative">
              <DollarSign className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter sponsorship amount"
                className="theme-input w-full pl-9 pr-4 py-3 text-sm rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <p className="text-[11px] theme-subtext mt-1">
              Enter the amount you are proposing to sponsor.
            </p>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
              Sponsorship Requirements / Proposal
            </label>

            <div className="relative">
              <FileText className="w-4 h-4 theme-subtext absolute left-3 top-3" />

              <textarea
                rows={5}
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                placeholder="Describe what you expect from the organizer in return for your sponsorship. Example: logo placement, social media promotion, stage branding, product showcase, etc."
                className="theme-input w-full pl-9 pr-3 py-3 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
              Message to Organizer
              <span className="normal-case font-normal ml-1">(Optional)</span>
            </label>

            <div className="relative">
              <MessageSquare className="w-4 h-4 theme-subtext absolute left-3 top-3" />

              <textarea
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Add any additional information for the tournament organizer..."
                className="theme-input w-full pl-9 pr-3 py-3 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5 pt-3 border-t theme-border">
            <input
              type="checkbox"
              id="sponsorshipTerms"
              checked={agreedTerms}
              onChange={(event) => setAgreedTerms(event.target.checked)}
              className="mt-1 accent-indigo-600 cursor-pointer"
            />

            <label
              htmlFor="sponsorshipTerms"
              className="text-xs theme-subtext cursor-pointer leading-relaxed"
            >
              I confirm that the sponsorship amount and requirements provided
              are accurate, and I agree to the NexusPlay sponsorship terms.
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t theme-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 text-xs font-semibold theme-subtext theme-hover rounded-xl cursor-pointer transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl cursor-pointer transition"
          >
            <ShieldCheck className="w-4 h-4" />

            {submitting ? "Submitting..." : "Submit Sponsorship Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SponsorModal;
