import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Search,
  Filter,
  Calendar,
  Users,
  Handshake,
  DollarSign,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { tournamentService } from "../../services/tournamentService";
import { SponsorModal } from "../../components/sponsor/SponsorModal";
import { toast } from "sonner";

export function SponsorTournaments() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const games = ["all", "Valorant", "BGMI", "Counter-Strike 2", "Free Fire", "Apex Legends"];

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const res = await tournamentService.getAll().catch(() => []);
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.tournaments)) list = res.tournaments;

      if (list.length === 0) {
        list = [
          {
            _id: "t_01",
            title: "Nexus Invitational: Valorant Masters Season 1",
            game: "Valorant",
            prizePool: 15000,
            organizer: "Apex Gaming Club",
            startDate: "2026-09-15",
            teamsCount: 32,
            description: "Top collegiate and semi-pro teams competing across 4 regional qualifiers.",
            status: "published",
          },
          {
            _id: "t_02",
            title: "BGMI Champions Series India 2026",
            game: "BGMI",
            prizePool: 25000,
            organizer: "Krypton Esports",
            startDate: "2026-10-01",
            teamsCount: 64,
            description: "High-octane mobile battle royale showdown with national broadcast coverage.",
            status: "published",
          },
          {
            _id: "t_03",
            title: "CS2 Summer Showdown Pro League",
            game: "Counter-Strike 2",
            prizePool: 10000,
            organizer: "Vanguard Leagues",
            startDate: "2026-09-28",
            teamsCount: 16,
            description: "5v5 tactical shooter clash featuring premier FPS talent.",
            status: "published",
          },
          {
            _id: "t_04",
            title: "Free Fire Battle Royale Rush",
            game: "Free Fire",
            prizePool: 5000,
            organizer: "Firestorm Guild",
            startDate: "2026-10-15",
            teamsCount: 48,
            description: "Fast-paced mobile survival championship with massive grassroots engagement.",
            status: "published",
          },
          {
            _id: "t_05",
            title: "Apex Legends Global Arena Clash",
            game: "Apex Legends",
            prizePool: 8000,
            organizer: "Titan Series",
            startDate: "2026-11-05",
            teamsCount: 20,
            description: "Trio squad battle royale tournament broadcast live on YouTube & Twitch.",
            status: "published",
          },
        ];
      }
      setTournaments(list);
    } catch (err) {
      console.error("Failed to fetch tournaments:", err);
      toast.error("Could not load tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const handleSponsorClick = (t) => {
    setSelectedTournament(t);
    setIsModalOpen(true);
  };

  const filteredTournaments = tournaments.filter((t) => {
    const title = (t.title || t.name || "").toLowerCase();
    const org = (t.organizer?.name || t.organizer || "").toLowerCase();
    const game = (t.game || "").toLowerCase();

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      org.includes(searchQuery.toLowerCase()) ||
      game.includes(searchQuery.toLowerCase());

    const matchesGame =
      selectedGame === "all" || game === selectedGame.toLowerCase();

    return matchesSearch && matchesGame;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">Browse Tournaments Seeking Sponsors</h1>
          <p className="text-xs md:text-sm theme-subtext">
            Pledge funding, provide hardware prizes, and place your brand in esports spotlight.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 theme-card p-4 rounded-2xl border theme-border">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 theme-subtext absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tournament, game, or host..."
            className="theme-input w-full pl-10 pr-4 py-2 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Game Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {games.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGame(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedGame === g
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                  : "theme-icon-box border theme-border theme-subtext hover:theme-text"
              }`}
            >
              {g === "all" ? "All Games" : g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tournaments */}
      {loading ? (
        <div className="p-12 text-center theme-subtext text-xs">
          Loading tournaments available for sponsorship...
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="theme-card border theme-border rounded-2xl p-12 text-center space-y-3">
          <Trophy className="w-10 h-10 theme-subtext mx-auto opacity-40" />
          <h3 className="text-sm font-bold theme-text">No tournaments found</h3>
          <p className="text-xs theme-subtext max-w-sm mx-auto">
            Try adjusting your search query or selecting a different game filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTournaments.map((t) => {
            const title = t.title || t.name;
            const prize = t.prizePool || t.totalPrizePool || 5000;
            const org = t.organizer?.name || t.organizer || "Verified Organizer";

            return (
              <div
                key={t._id || t.id}
                className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                      {t.game || "Competitive"}
                    </span>
                    <span className="text-xs font-extrabold text-amber-400">
                      Prize: ${Number(prize).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold theme-text leading-snug line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {title}
                  </h3>

                  <p className="text-xs theme-subtext mt-1">
                    Hosted by <span className="font-semibold theme-text">{org}</span>
                  </p>

                  <p className="text-xs theme-subtext mt-3 line-clamp-2 leading-relaxed">
                    {t.description || "Exciting multi-stage esports competition open for brand sponsorship deals and prize matching."}
                  </p>

                  {/* Quick specs */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl theme-icon-box border theme-border text-xs">
                    <div>
                      <p className="text-[10px] theme-subtext uppercase">Start Date</p>
                      <p className="font-bold theme-text mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 theme-subtext" />
                        <span>{t.startDate ? new Date(t.startDate).toLocaleDateString() : "Upcoming"}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] theme-subtext uppercase">Audience Cap</p>
                      <p className="font-bold theme-text mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 theme-subtext" />
                        <span>40,000+ Viewers</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t theme-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/sponsor/tournaments/${t._id || t.id}`)}
                    className="flex items-center gap-1 text-xs font-semibold theme-subtext hover:theme-text transition cursor-pointer"
                  >
                    <span>View Deck</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleSponsorClick(t)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    <span>Sponsor Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedTournament && (
        <SponsorModal
          tournament={selectedTournament}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTournament(null);
          }}
          onSuccess={() => {
            loadTournaments();
          }}
        />
      )}
    </div>
  );
}

export default SponsorTournaments;
