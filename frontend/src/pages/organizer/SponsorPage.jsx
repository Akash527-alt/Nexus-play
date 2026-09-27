import React, { useEffect, useState } from "react";
import {
  Handshake,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { sponsorService } from "../../services/sponsorService";

export function SponsorsPage() {
  const [sponsorships, setSponsorships] = useState([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD SPONSORSHIPS
  // ============================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await sponsorService.getOrganizerSponsorships();

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
    loadData();
  }, []);

  // ============================================================
  // APPROVE / REJECT
  // ============================================================

  const handleStatusUpdate = async (sponsorshipId, newStatus) => {
    let rejectionReason = "";

    if (newStatus === "rejected") {
      rejectionReason =
        window.prompt("Enter rejection reason (optional):") || "";
    }

    try {
      const response = await sponsorService.updateSponsorshipStatus(
        sponsorshipId,
        newStatus,
        rejectionReason,
      );

      if (response?.success) {
        toast.success(
          newStatus === "approved"
            ? "Sponsorship request approved."
            : "Sponsorship request rejected.",
        );

        loadData();
      }
    } catch (error) {
      console.error("Failed to update sponsorship:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update sponsorship status.",
      );
    }
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalPaidAmount = sponsorships
    .filter((sponsorship) => sponsorship.paymentStatus === "paid")
    .reduce((sum, sponsorship) => sum + Number(sponsorship.amount || 0), 0);

  const pendingCount = sponsorships.filter(
    (sponsorship) => sponsorship.status === "pending",
  ).length;

  const activeCount = sponsorships.filter(
    (sponsorship) =>
      sponsorship.status === "active" || sponsorship.status === "approved",
  ).length;

  // ============================================================
  // STATUS STYLE
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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-indigo-400" />

          <h1 className="text-2xl font-bold theme-text">Tournament Sponsors</h1>
        </div>

        <p className="text-xs md:text-sm theme-subtext mt-1">
          Review sponsorship proposals submitted for your tournaments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Approved Sponsorship
            </p>

            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>

          <p className="text-2xl font-black text-emerald-400 mt-2">
            ₹{totalPaidAmount.toLocaleString("en-IN")}
          </p>

          <p className="text-[11px] theme-subtext mt-1">
            Approved sponsorship proposals
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Active Partners
            </p>

            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-2">{activeCount}</p>

          <p className="text-[11px] theme-subtext mt-1">
            Approved or active sponsorships
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Pending Requests
            </p>

            <Clock className="w-5 h-5 text-amber-400" />
          </div>

          <p className="text-2xl font-black text-amber-400 mt-2">
            {pendingCount}
          </p>

          <p className="text-[11px] theme-subtext mt-1">Awaiting your review</p>
        </div>
      </div>

      {/* Requests */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold theme-text">
            Sponsorship Requests
          </h2>

          <p className="text-xs theme-subtext mt-1">
            Review the proposed amount and requirements before approving or
            rejecting a request.
          </p>
        </div>

        {loading ? (
          <div className="theme-card border theme-border rounded-2xl p-12 text-center">
            <p className="text-xs theme-subtext">
              Loading sponsorship requests...
            </p>
          </div>
        ) : sponsorships.length === 0 ? (
          <div className="theme-card border theme-border rounded-2xl p-12 text-center space-y-3">
            <Handshake className="w-10 h-10 theme-subtext mx-auto opacity-40" />

            <p className="text-sm font-bold theme-text">
              No sponsorship requests yet
            </p>

            <p className="text-xs theme-subtext max-w-md mx-auto">
              Sponsorship requests submitted for your tournaments will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sponsorships.map((sponsorship) => {
              const tournament = sponsorship.tournamentId;

              const sponsor = sponsorship.sponsorId;

              const tournamentTitle =
                tournament?.title ||
                sponsorship.tournamentTitle ||
                "Tournament";

              const sponsorName =
                sponsor?.companyName || sponsor?.brandName || "Sponsor";

              return (
                <div
                  key={sponsorship._id}
                  className="theme-card border theme-border rounded-2xl p-5 shadow-xs"
                >
                  {/* Top */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Status + Amount */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(
                            sponsorship.status,
                          )}`}
                        >
                          {sponsorship.status}
                        </span>

                        <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                          ₹
                          {Number(sponsorship.amount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </span>

                        <span className="text-[10px] theme-subtext">
                          Payment:{" "}
                          <span className="font-semibold theme-text">
                            {sponsorship.paymentStatus || "not_required"}
                          </span>
                        </span>
                      </div>

                      {/* Tournament */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider theme-subtext">
                          Tournament
                        </p>

                        <h3 className="text-base font-bold theme-text mt-0.5">
                          {tournamentTitle}
                        </h3>

                        <p className="text-xs theme-subtext mt-1">
                          {sponsorship.game || tournament?.game || "Esports"}
                        </p>
                      </div>

                      {/* Sponsor */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider theme-subtext">
                          Sponsor
                        </p>

                        <p className="text-sm font-semibold theme-text mt-0.5">
                          {sponsorName}
                        </p>

                        {sponsor?.industry && (
                          <p className="text-xs theme-subtext">
                            {sponsor.industry}
                          </p>
                        )}
                      </div>

                      {/* Requirements */}
                      <div className="theme-icon-box border theme-border rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">
                          Sponsorship Requirements
                        </p>

                        <p className="text-xs theme-text mt-1 leading-relaxed">
                          {sponsorship.requirements ||
                            "No requirements provided."}
                        </p>
                      </div>

                      {/* Message */}
                      {sponsorship.message && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">
                            Message
                          </p>

                          <p className="text-xs theme-subtext mt-1">
                            {sponsorship.message}
                          </p>
                        </div>
                      )}

                      {/* Rejection */}
                      {sponsorship.rejectionReason && (
                        <div className="border border-rose-500/20 bg-rose-500/5 rounded-xl p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                            Rejection Reason
                          </p>

                          <p className="text-xs theme-subtext mt-1">
                            {sponsorship.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col items-center lg:items-stretch gap-2 shrink-0">
                      {sponsorship.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(sponsorship._id, "approved")
                            }
                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(sponsorship._id, "rejected")
                            }
                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl transition cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs theme-subtext flex items-center gap-1 font-semibold">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />

                          {sponsorship.status === "rejected"
                            ? "Rejected"
                            : "Reviewed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 mt-4 border-t theme-border flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] theme-subtext">
                      Submitted{" "}
                      {sponsorship.createdAt
                        ? new Date(sponsorship.createdAt).toLocaleDateString()
                        : "—"}
                    </span>

                    {tournament?.startDate && (
                      <span className="text-[11px] theme-subtext">
                        Tournament:{" "}
                        {new Date(tournament.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SponsorsPage;
