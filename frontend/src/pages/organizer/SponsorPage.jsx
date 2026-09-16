import React, { useEffect, useState } from "react";
import {
  Handshake,
  DollarSign,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { sponsorService } from "../../services/sponsorService";
import { SponsorTierBadge } from "../../components/sponsor/SponsorTierBadge";

export function SponsorsPage() {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await sponsorService.getOrganizerSponsorships();
      setSponsorships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (dealId, newStatus) => {
    try {
      const res = await sponsorService.updateSponsorshipStatus(dealId, newStatus);
      if (res.success) {
        toast.success(`Sponsorship proposal marked as ${newStatus}!`);
        loadData();
      }
    } catch {
      toast.error("Failed to update sponsorship status");
    }
  };

  const totalRaised = sponsorships
    .filter((s) => s.status === "active" || s.status === "approved" || s.status === "completed")
    .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const pendingCount = sponsorships.filter((s) => s.status === "pending").length;
  const activeCount = sponsorships.filter((s) => s.status === "active" || s.status === "approved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold theme-text">Tournament Sponsors & Backers</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Manage commercial sponsorship proposals, approve partner tiers, and review escrow disbursements.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Total Sponsorship Raised
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            ${totalRaised.toLocaleString()}
          </p>
          <p className="text-[11px] theme-subtext mt-0.5">Disbursed to tournament prize pools</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Active Brand Partners
          </p>
          <p className="text-2xl font-black theme-text mt-2">{activeCount}</p>
          <p className="text-[11px] theme-subtext mt-0.5">Approved commercial contracts</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Pending Proposals
          </p>
          <p className="text-2xl font-black text-amber-400 mt-2">{pendingCount}</p>
          <p className="text-[11px] theme-subtext mt-0.5">Awaiting organizer approval</p>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold theme-text">Sponsorship Applications & Contracts</h2>

        {loading ? (
          <div className="p-12 text-center text-xs theme-subtext">Loading sponsorships...</div>
        ) : sponsorships.length === 0 ? (
          <div className="theme-card border theme-border rounded-2xl p-12 text-center space-y-2">
            <Handshake className="w-10 h-10 theme-subtext mx-auto opacity-40" />
            <p className="text-sm font-bold theme-text">No incoming sponsorship requests yet</p>
            <p className="text-xs theme-subtext">
              Tournaments published publicly on NexusPlay can be discovered and sponsored by commercial brands.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sponsorships.map((deal) => (
              <div
                key={deal.id}
                className="theme-card border theme-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SponsorTierBadge tier={deal.tier} size="sm" />
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                      ${Number(deal.amount).toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        deal.status === "active" || deal.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : deal.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                      }`}
                    >
                      {deal.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold theme-text">
                    {deal.tournamentTitle}
                  </h3>

                  <p className="text-xs theme-subtext">
                    Applicant: <span className="font-semibold theme-text">Razer Gaming Tech</span> (
                    {deal.organizerEmail || "partnerships@razer.com"})
                  </p>

                  {deal.deliverables && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {deal.deliverables.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-lg theme-icon-box border theme-border theme-subtext"
                        >
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 theme-border">
                  {deal.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(deal.id, "approved")}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept Proposal</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(deal.id, "rejected")}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs theme-subtext flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Contract Active</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SponsorsPage;