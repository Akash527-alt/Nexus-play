import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  DollarSign,
  TrendingUp,
  Users,
  Handshake,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { sponsorService } from "../../services/sponsorService";
import { tournamentService } from "../../services/tournamentService";
import { SponsorCard } from "../../components/sponsor/SponsorCard";
import { SponsorModal } from "../../components/sponsor/SponsorModal";

export function SponsorDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalInvested: 0,
    activeCampaigns: 0,
    totalReach: "248,000+",
    averageRoi: "91.3%",
    pendingProposals: 0,
  });

  const [sponsorships, setSponsorships] = useState([]);
  const [featuredTournaments, setFeaturedTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, deals, allTournaments] = await Promise.all([
        sponsorService.getStats(),
        sponsorService.getMySponsorships(),
        tournamentService.getAll().catch(() => []),
      ]);

      setStats(statsData);
      setSponsorships(deals);

      // Extract tournaments list
      let tourList = [];
      if (Array.isArray(allTournaments)) tourList = allTournaments;
      else if (Array.isArray(allTournaments?.data)) tourList = allTournaments.data;
      else if (Array.isArray(allTournaments?.tournaments)) tourList = allTournaments.tournaments;

      // Fallback demo tournaments if backend list is empty
      if (tourList.length === 0) {
        tourList = [
          {
            _id: "t_01",
            title: "Nexus Invitational: Valorant Masters Season 1",
            game: "Valorant",
            prizePool: 15000,
            organizer: "Apex Gaming Club",
            startDate: "2026-09-15",
            teamsCount: 32,
          },
          {
            _id: "t_02",
            title: "BGMI Champions Series India 2026",
            game: "BGMI",
            prizePool: 25000,
            organizer: "Krypton Esports",
            startDate: "2026-10-01",
            teamsCount: 64,
          },
          {
            _id: "t_03",
            title: "CS2 Summer Showdown Pro League",
            game: "Counter-Strike 2",
            prizePool: 10000,
            organizer: "Vanguard Leagues",
            startDate: "2026-09-28",
            teamsCount: 16,
          },
        ];
      }
      setFeaturedTournaments(tourList.slice(0, 3));
    } catch (err) {
      console.error("Failed to load sponsor dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenSponsorModal = (tournament) => {
    setSelectedTournament(tournament);
    setIsModalOpen(true);
  };

  const handleSponsorSuccess = () => {
    loadDashboardData();
  };

  const activeDeals = sponsorships.filter(
    (d) => d.status === "active" || d.status === "approved"
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/70 border theme-border p-6 md:p-8 backdrop-blur-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Commercial Sponsor Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight theme-text">
            Accelerate Brand Impact Through Esports
          </h1>
          <p className="text-xs md:text-sm theme-subtext mt-2 leading-relaxed">
            Connect directly with leading tournament organizers, acquire naming rights, fund prize pools, and place your brand in front of hundreds of thousands of passionate esports viewers.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => navigate("/sponsor/tournaments")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Explore Tournaments Seeking Sponsors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/sponsor/sponsorships")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl theme-card theme-border border theme-text hover:bg-indigo-500/10 font-bold text-xs transition cursor-pointer"
            >
              <span>View My Active Sponsorships ({activeDeals.length})</span>
            </button>
          </div>
        </div>

        {/* Ambient Decorative Accents */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">Total Invested</p>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">
            ${stats.totalInvested?.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Securely escrowed & disbursed
          </p>
        </div>

        {/* Metric 2 */}
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">Active Campaigns</p>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">{stats.activeCampaigns}</p>
          <p className="text-[11px] theme-subtext mt-1">Tournaments currently sponsored</p>
        </div>

        {/* Metric 3 */}
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">Estimated Reach</p>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">{stats.totalReach}</p>
          <p className="text-[11px] text-purple-400 font-semibold mt-1">
            Stream viewers & participants
          </p>
        </div>

        {/* Metric 4 */}
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">Average ROI</p>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">{stats.averageRoi}</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">
            Deliverables fulfillment rate
          </p>
        </div>
      </div>

      {/* Main Section: High-Priority Sponsorship Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold theme-text">High-Priority Sponsorship Opportunities</h2>
            <p className="text-xs theme-subtext">
              Verified tournaments actively looking for title, gold, or gear partnerships
            </p>
          </div>
          <button
            onClick={() => navigate("/sponsor/tournaments")}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredTournaments.map((t) => {
            const title = t.title || t.name;
            const prize = t.prizePool || t.totalPrizePool || 5000;
            return (
              <div
                key={t._id || t.id}
                className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                      {t.game || "Competitive"}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      Prize: ${Number(prize).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold theme-text leading-snug line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-xs theme-subtext mt-1.5">
                    Organized by{" "}
                    <span className="font-semibold theme-text">
                      {t.organizer?.name || t.organizer || "Verified Organizer"}
                    </span>
                  </p>

                  <div className="my-4 p-3 rounded-xl theme-icon-box border theme-border text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="theme-subtext">Available Tiers:</span>
                      <span className="font-bold text-indigo-400">Title, Gold, Silver</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="theme-subtext">Est. Viewership:</span>
                      <span className="font-bold theme-text">50,000+ Viewers</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t theme-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/sponsor/tournaments/${t._id || t.id}`)}
                    className="text-xs font-bold theme-subtext hover:theme-text transition cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleOpenSponsorModal(t)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-xs shadow-indigo-600/30 flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    <span>Sponsor Event</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Sponsorships Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold theme-text">Active & Pending Brand Partnerships</h2>
            <p className="text-xs theme-subtext">
              Real-time deliverables and contract status with tournament hosts
            </p>
          </div>
          <button
            onClick={() => navigate("/sponsor/sponsorships")}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All ({sponsorships.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sponsorships.slice(0, 4).map((deal) => (
            <SponsorCard
              key={deal.id}
              deal={deal}
              onViewDetails={() => navigate("/sponsor/sponsorships")}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTournament && (
        <SponsorModal
          tournament={selectedTournament}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTournament(null);
          }}
          onSuccess={handleSponsorSuccess}
        />
      )}
    </div>
  );
}

export default SponsorDashboard;
