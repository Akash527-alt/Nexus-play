import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Clock,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Handshake,
  Search,
} from "lucide-react";
import { sponsorService } from "../../services/sponsorService";

export function SponsorDashboard() {
  const navigate = useNavigate();

  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const response = await sponsorService.getMySponsorships();

      const deals = response?.data || [];

      setSponsorships(deals);
    } catch (error) {
      console.error("Failed to load sponsor dashboard:", error);

      setSponsorships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const pendingCount = sponsorships.filter(
    (deal) => deal.status === "pending",
  ).length;

  const approvedCount = sponsorships.filter(
    (deal) => deal.status === "approved",
  ).length;

  const activeCount = sponsorships.filter(
    (deal) => deal.status === "active",
  ).length;

  const totalPaid = sponsorships
    .filter((deal) => deal.paymentStatus === "paid")
    .reduce((total, deal) => total + Number(deal.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/70 border theme-border p-6 md:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
            Sponsor Portal
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight theme-text">
            Manage Your Sponsorships
          </h1>

          <p className="text-xs md:text-sm theme-subtext mt-2 leading-relaxed">
            Discover published tournaments, submit sponsorship proposals, and
            manage your approved sponsorships from one place.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => navigate("/sponsor/tournaments")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Explore Tournaments
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/sponsor/sponsorships")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl theme-card border theme-border theme-text hover:bg-indigo-500/10 font-bold text-xs transition cursor-pointer"
            >
              <Handshake className="w-4 h-4" />
              My Sponsorships
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Total Paid
            </p>

            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-3">
            ₹{totalPaid.toLocaleString("en-IN")}
          </p>

          <p className="text-[11px] theme-subtext mt-1">
            Successfully paid sponsorships
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Pending
            </p>

            <Clock className="w-5 h-5 text-amber-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-3">{pendingCount}</p>

          <p className="text-[11px] theme-subtext mt-1">
            Awaiting organizer review
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Approved
            </p>

            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-3">{approvedCount}</p>

          <p className="text-[11px] theme-subtext mt-1">Waiting for payment</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Active
            </p>

            <Trophy className="w-5 h-5 text-indigo-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-3">{activeCount}</p>

          <p className="text-[11px] theme-subtext mt-1">Active sponsorships</p>
        </div>
      </div>

      <div className="theme-card border theme-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Handshake className="w-5 h-5 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold theme-text">
                Sponsorship Opportunities
              </h2>

              <p className="text-xs theme-subtext mt-1">
                Published tournaments available for sponsorship
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/sponsor/tournaments")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
          >
            Browse Tournaments
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="theme-card border theme-border rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold theme-text">
              Sponsorship Process
            </h2>

            <p className="text-xs theme-subtext mt-1">
              How sponsorship works on NexusPlay
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="theme-icon-box border theme-border rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
              1
            </div>

            <h3 className="text-sm font-bold theme-text mt-4">
              Submit Proposal
            </h3>

            <p className="text-xs theme-subtext mt-1.5 leading-relaxed">
              Select a published tournament and submit your sponsorship amount,
              requirements, and message.
            </p>
          </div>

          <div className="theme-icon-box border theme-border rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs">
              2
            </div>

            <h3 className="text-sm font-bold theme-text mt-4">
              Organizer Review
            </h3>

            <p className="text-xs theme-subtext mt-1.5 leading-relaxed">
              The tournament organizer reviews your proposal and decides whether
              to approve or reject it.
            </p>
          </div>

          <div className="theme-icon-box border theme-border rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
              3
            </div>

            <h3 className="text-sm font-bold theme-text mt-4">Payment</h3>

            <p className="text-xs theme-subtext mt-1.5 leading-relaxed">
              Once approved, payment becomes available and the sponsorship can
              move toward activation.
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-[11px] theme-subtext text-center">
          Updating sponsorship information...
        </p>
      )}
    </div>
  );
}

export default SponsorDashboard;
