import React, { useEffect, useState } from "react";
import { useTournaments } from "../../context/TournamentContext";
import { ParticipantRegistrationModal } from "../../components/participant/ParticipantRegistrationModal";
import {
  Trophy,
  Users,
  Calendar,
  Search,
  MapPin,
  Gamepad2,
  Loader2,
} from "lucide-react";

export function ParticipantTournaments() {
  const { tournaments, loading, error, fetchAllTournaments } = useTournaments();

  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("All");

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllTournaments();
  }, []);

  const handleOpenRegistration = (tournament) => {
    setSelectedTournament(tournament);
    setIsModalOpen(true);
  };

  const games = ["All", ...new Set(tournaments.map((t) => t.game))];

  const filtered = tournaments.filter((t) => {
    const matchesGame = selectedGame === "All" || t.game === selectedGame;

    const matchesSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.game?.toLowerCase().includes(search.toLowerCase());

    return matchesGame && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black theme-text tracking-wide">
            Available Tournaments
          </h1>

          <p className="text-xs theme-subtext mt-1">
            Browse active tournaments created by organizers and register your
            squad.
          </p>
        </div>

        {/* Search / Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border theme-border rounded-xl theme-card theme-text outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="text-xs py-2 px-3 border theme-border rounded-xl theme-card theme-text outline-none font-semibold cursor-pointer"
          >
            {games.map((game) => (
              <option key={game} value={game}>
                {game === "All" ? "All Games" : game}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="theme-card border theme-border p-12 rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />

          <p className="text-sm theme-subtext">Loading tournaments...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="theme-card border theme-border p-12 rounded-2xl text-center space-y-2">
          <p className="text-sm font-bold text-red-500">
            Unable to load tournaments
          </p>

          <p className="text-xs theme-subtext">{error}</p>

          <button
            onClick={fetchAllTournaments}
            className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Tournaments */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tournament) => (
            <div
              key={tournament._id}
              className="theme-card border theme-border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
            >
              <div className="space-y-3">
                {/* Game + Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    {tournament.game}
                  </span>

                  <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    {tournament.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base theme-text line-clamp-1">
                  {tournament.title}
                </h3>

                {/* Details */}
                <div className="space-y-2 text-xs theme-subtext pt-2 border-t theme-border">
                  {/* Prize */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                      Prize Pool
                    </span>

                    <span className="font-bold theme-text">
                      ₹{(tournament.prizePool || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      Slots
                    </span>

                    <span className="font-medium theme-text">
                      {tournament.currentParticipants || 0}/
                      {tournament.maxParticipants}
                    </span>
                  </div>

                  {/* Start Date */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      Start Date
                    </span>

                    <span className="font-medium theme-text">
                      {tournament.startDate
                        ? new Date(tournament.startDate).toLocaleDateString(
                            "en-IN",
                          )
                        : "TBA"}
                    </span>
                  </div>

                  {/* Venue */}
                  {tournament.venue && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        Venue
                      </span>

                      <span className="font-medium theme-text line-clamp-1">
                        {tournament.venue}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Register */}
              <button
                onClick={() => handleOpenRegistration(tournament)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Register Now (
                {tournament.entryFee ? `₹${tournament.entryFee}` : "Free Entry"}
                )
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="theme-card border theme-border p-12 rounded-2xl text-center space-y-2">
          <p className="text-sm font-bold theme-text">No tournaments found</p>

          <p className="text-xs theme-subtext">
            When organizers create events, they will appear here live.
          </p>
        </div>
      )}

      {/* Registration Modal */}
      <ParticipantRegistrationModal
        tournament={selectedTournament}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
