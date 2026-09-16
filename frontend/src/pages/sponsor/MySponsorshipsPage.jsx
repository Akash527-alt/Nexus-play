import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Handshake,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Mail,
  ShieldCheck,
  Search,
} from "lucide-react";
import { sponsorService } from "../../services/sponsorService";
import { SponsorTierBadge } from "../../components/sponsor/SponsorTierBadge";

export function MySponsorshipsPage() {
  const navigate = useNavigate();

  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const deals = await sponsorService.getMySponsorships();
      setSponsorships(deals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDeals = sponsorships.filter((deal) => {
    const matchesStatus = filterStatus === "all" || deal.status === filterStatus;
    const matchesSearch =
      deal.tournamentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.organizerName && deal.organizerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "approved":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "completed":
        return "bg-slate-500/15 text-slate-400 border-slate-500/30";
      default:
        return "bg-gray-500/15 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">My Sponsorship Contracts</h1>
          <p className="text-xs md:text-sm theme-subtext">
            Track deliverables, approval status, and brand presence across all sponsored tournaments.
          </p>
        </div>
        <button
          onClick={() => navigate("/sponsor/tournaments")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Sponsor New Tournament</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 theme-card p-4 rounded-2xl border theme-border">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts by tournament..."
            className="theme-input w-full pl-9 pr-4 py-2 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "active", "approved", "pending", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                filterStatus === st
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "theme-icon-box border theme-border theme-subtext hover:theme-text"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List / Cards of Sponsorship Deals */}
      {loading ? (
        <div className="p-12 text-center text-xs theme-subtext">Loading sponsorships...</div>
      ) : filteredDeals.length === 0 ? (
        <div className="theme-card border theme-border rounded-2xl p-12 text-center space-y-3">
          <Handshake className="w-10 h-10 theme-subtext mx-auto opacity-40" />
          <h3 className="text-sm font-bold theme-text">No sponsorship deals found</h3>
          <p className="text-xs theme-subtext max-w-sm mx-auto">
            You don't have any deals matching this filter. Browse open tournaments to submit your first sponsorship!
          </p>
          <button
            onClick={() => navigate("/sponsor/tournaments")}
            className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Explore Tournaments
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="theme-card border theme-border rounded-2xl p-5 md:p-6 transition-all hover:border-indigo-500/40 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Info */}
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <SponsorTierBadge tier={deal.tier} size="sm" />
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                      deal.status
                    )}`}
                  >
                    {deal.status}
                  </span>
                  <span className="text-xs theme-subtext font-semibold">
                    Contract ID: {deal.id}
                  </span>
                </div>

                <h3 className="text-base font-bold theme-text leading-snug">
                  {deal.tournamentTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs theme-subtext">
                  <span>
                    Game: <span className="font-semibold theme-text">{deal.game}</span>
                  </span>
                  <span>
                    Host: <span className="font-semibold theme-text">{deal.organizerName}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{deal.date}</span>
                  </span>
                </div>

                {/* Deliverables */}
                {deal.deliverables && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext mb-1.5">
                      Agreed Deliverables:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {deal.deliverables.map((deliv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs theme-subtext">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Financials & Actions */}
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 theme-border">
                <div className="text-left lg:text-right">
                  <p className="text-[10px] uppercase font-bold tracking-wider theme-subtext">
                    Sponsorship Amount
                  </p>
                  <p className="text-2xl font-black text-indigo-400">
                    ${Number(deal.amount).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5 justify-start lg:justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${deal.organizerEmail || "support@nexusplay.gg"}`}
                    className="p-2 rounded-xl theme-icon-box border theme-border theme-subtext hover:theme-text transition cursor-pointer"
                    title="Contact Host"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => navigate(`/sponsor/tournaments`)}
                    className="px-3 py-1.5 rounded-xl border theme-border theme-hover text-xs font-semibold theme-text transition cursor-pointer"
                  >
                    View Stream
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySponsorshipsPage;
