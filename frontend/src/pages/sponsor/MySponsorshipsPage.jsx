import React, { useEffect, useState } from "react";
import {
  Handshake,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Calendar,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { sponsorService } from "../../services/sponsorService";
import { toast } from "sonner";

export function MySponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD
  // ============================================================

  const loadSponsorships = async () => {
    try {
      setLoading(true);

      const response = await sponsorService.getMySponsorships();

      setSponsorships(response?.data || []);
    } catch (error) {
      console.error("Failed to load sponsorships:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load sponsorships.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsorships();
  }, []);

  // ============================================================
  // STATUS
  // ============================================================

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;

      case "approved":
      case "active":
        return <CheckCircle className="w-4 h-4" />;

      case "rejected":
        return <XCircle className="w-4 h-4" />;

      default:
        return <Handshake className="w-4 h-4" />;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">My Sponsorships</h1>

          <p className="text-xs md:text-sm theme-subtext mt-1">
            Track your sponsorship proposals, approvals, and payment status.
          </p>
        </div>

        <button
          onClick={loadSponsorships}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl theme-card border theme-border theme-text text-xs font-semibold hover:bg-indigo-500/10 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="theme-card border theme-border rounded-2xl p-12 text-center">
          <p className="text-xs theme-subtext">Loading your sponsorships...</p>
        </div>
      ) : sponsorships.length === 0 ? (
        <div className="theme-card border theme-border rounded-2xl p-12 text-center">
          <Handshake className="w-12 h-12 theme-subtext mx-auto opacity-40" />

          <h3 className="text-sm font-bold theme-text mt-4">
            No sponsorships yet
          </h3>

          <p className="text-xs theme-subtext max-w-md mx-auto mt-1">
            Once you submit a sponsorship proposal, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sponsorships.map((sponsorship) => {
            const tournament = sponsorship.tournamentId;

            const tournamentTitle =
              tournament?.title || sponsorship.tournamentTitle || "Tournament";

            const game = tournament?.game || sponsorship.game || "Esports";

            return (
              <div
                key={sponsorship._id}
                className="theme-card border theme-border rounded-2xl p-5"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(
                          sponsorship.status,
                        )}`}
                      >
                        {getStatusIcon(sponsorship.status)}

                        {sponsorship.status}
                      </span>

                      <span className="text-[10px] theme-subtext">
                        Payment:{" "}
                        <span className="font-semibold theme-text">
                          {sponsorship.paymentStatus || "not_required"}
                        </span>
                      </span>
                    </div>

                    <h2 className="text-lg font-bold theme-text mt-3">
                      {tournamentTitle}
                    </h2>

                    <p className="text-xs theme-subtext mt-1">{game}</p>
                  </div>

                  {/* Amount */}
                  <div className="shrink-0">
                    <p className="text-[10px] theme-subtext uppercase tracking-wider">
                      Sponsorship Amount
                    </p>

                    <p className="text-xl font-black text-indigo-400 mt-1">
                      ₹{Number(sponsorship.amount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                  <div className="theme-icon-box border theme-border rounded-xl p-3">
                    <p className="text-[10px] theme-subtext uppercase">
                      Submitted
                    </p>

                    <p className="text-xs font-semibold theme-text mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 theme-subtext" />

                      {sponsorship.createdAt
                        ? new Date(sponsorship.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div className="theme-icon-box border theme-border rounded-xl p-3">
                    <p className="text-[10px] theme-subtext uppercase">
                      Tournament
                    </p>

                    <p className="text-xs font-semibold theme-text mt-1 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 theme-subtext" />

                      {tournament?.startDate
                        ? new Date(tournament.startDate).toLocaleDateString()
                        : "TBA"}
                    </p>
                  </div>

                  <div className="theme-icon-box border theme-border rounded-xl p-3">
                    <p className="text-[10px] theme-subtext uppercase">
                      Payment
                    </p>

                    <p className="text-xs font-semibold theme-text mt-1 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 theme-subtext" />

                      {sponsorship.paymentStatus || "Not required"}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-4 theme-icon-box border theme-border rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">
                    Sponsorship Requirements
                  </p>

                  <p className="text-xs theme-text mt-2 leading-relaxed">
                    {sponsorship.requirements || "No requirements provided."}
                  </p>
                </div>

                {/* Message */}
                {sponsorship.message && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">
                      Message to Organizer
                    </p>

                    <p className="text-xs theme-subtext mt-1 leading-relaxed">
                      {sponsorship.message}
                    </p>
                  </div>
                )}

                {/* Rejection */}
                {sponsorship.status === "rejected" &&
                  sponsorship.rejectionReason && (
                    <div className="mt-4 border border-rose-500/20 bg-rose-500/5 rounded-xl p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                        Rejection Reason
                      </p>

                      <p className="text-xs theme-subtext mt-1">
                        {sponsorship.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Approved / Payment */}
                {sponsorship.status === "approved" &&
                  sponsorship.paymentStatus === "pending" && (
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-cyan-500/20 bg-cyan-500/5 rounded-xl p-4">
                      <div>
                        <p className="text-xs font-bold theme-text">
                          Sponsorship Approved
                        </p>

                        <p className="text-[11px] theme-subtext mt-1">
                          Your proposal has been approved by the organizer.
                          Payment can be completed here once the NexusPlay
                          payment system is connected.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold opacity-50 cursor-not-allowed"
                      >
                        Payment Coming Soon
                      </button>
                    </div>
                  )}

                {/* Paid */}
                {sponsorship.paymentStatus === "paid" && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Payment completed
                    {sponsorship.paidAt
                      ? ` on ${new Date(
                          sponsorship.paidAt,
                        ).toLocaleDateString()}`
                      : ""}
                  </div>
                )}

                {/* Transaction */}
                {sponsorship.transactionId && (
                  <div className="mt-3 text-[11px] theme-subtext">
                    Transaction ID:{" "}
                    <span className="font-semibold theme-text">
                      {sponsorship.transactionId}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MySponsorshipsPage;
