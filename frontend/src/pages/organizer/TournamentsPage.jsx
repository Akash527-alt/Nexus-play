import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tournamentService } from "../../services/tournamentService";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Trophy,
  Filter,
  MapPin,
  Clock,
  IndianRupee,
  Gamepad2,
  Settings,
} from "lucide-react";

const FALLBACK_IMAGE = "/images/tournament-placeholder.png";

export function TournamentsPage() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const response = await tournamentService.getMy();

      const apiTournaments =
        response?.tournaments ||
        response?.data?.tournaments ||
        response?.data ||
        [];

      setTournaments(Array.isArray(apiTournaments) ? apiTournaments : []);
    } catch (error) {
      console.error("Failed to load organizer tournaments:", error);

      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const getPrizeAmount = (tournament) => {
    return (
      Number(tournament.prizePool) || Number(tournament.totalPrizePool) || 0
    );
  };

  const getMaxParticipants = (tournament) => {
    return (
      Number(tournament.maxParticipants) || Number(tournament.maxTeams) || 0
    );
  };

  const getCurrentParticipants = (tournament) => {
    return (
      Number(tournament.currentParticipants) ||
      Number(tournament.registeredParticipants) ||
      0
    );
  };

  const getTournamentType = (tournament) => {
    if (tournament.tournamentType) {
      return tournament.tournamentType;
    }

    return Number(tournament.teamSize) > 1 ? "team" : "solo";
  };

  const getDisplayStatus = (tournament) => {
    const status = (tournament.status || "published").toLowerCase();

    if (["draft", "cancelled", "completed", "ongoing"].includes(status)) {
      return status;
    }

    if (!tournament.startDate) {
      return "published";
    }

    const now = new Date();

    const startDate = new Date(tournament.startDate);

    const endDate = tournament.endDate ? new Date(tournament.endDate) : null;

    if (startDate > now) {
      return "upcoming";
    }

    if (endDate && endDate >= now) {
      return "ongoing";
    }

    if (endDate && endDate < now) {
      return "completed";
    }

    return "published";
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: "Upcoming",
      published: "Published",
      ongoing: "Ongoing",
      draft: "Draft",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return labels[status] || "Published";
  };

  const getStatusClasses = (status) => {
    if (status === "upcoming") {
      return "bg-amber-500/10 text-amber-500";
    }

    if (status === "ongoing") {
      return "bg-emerald-500/10 text-emerald-500";
    }

    if (status === "completed") {
      return "bg-blue-500/10 text-blue-500";
    }

    if (status === "cancelled") {
      return "bg-rose-500/10 text-rose-500";
    }

    if (status === "draft") {
      return "bg-zinc-500/10 text-zinc-400";
    }

    return "bg-emerald-500/10 text-emerald-500";
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "TBA";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "TBA";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "TBA";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "TBA";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatVenue = (tournament) => {
    return tournament.venue || tournament.venueDetails || "Online Tournament";
  };

  const getOrganizerName = (tournament) => {
    return (
      tournament.organizer?.organizationName ||
      tournament.organizer?.representativeName ||
      tournament.organizerName ||
      "You"
    );
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const title = (tournament.title || tournament.name || "").toLowerCase();

    const game = (tournament.game || "").toLowerCase();

    const query = searchQuery.toLowerCase();

    const matchesSearch = title.includes(query) || game.includes(query);

    if (!matchesSearch) {
      return false;
    }

    if (filterStatus === "All") {
      return true;
    }

    const displayStatus = getDisplayStatus(tournament);

    return displayStatus === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">My Tournaments</h1>

          <p className="text-sm theme-subtext">
            Manage, monitor, and create your competitive events.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/organizer/tournaments/create")}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Tournament
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 theme-subtext" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tournament name or game..."
            className="theme-input w-full pl-10 pr-4 py-2 text-sm border rounded-xl outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 theme-subtext hidden sm:block" />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="theme-input px-3 py-2 text-sm border rounded-xl outline-none w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Published">Published</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Draft">Draft</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="theme-card p-8 text-center rounded-2xl border">
          <p className="text-sm theme-subtext">Loading your tournaments...</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="theme-card p-12 text-center rounded-2xl border flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>

          <h3 className="theme-text font-bold text-base">
            No Tournaments Found
          </h3>

          <p className="theme-subtext text-xs max-w-sm">
            No tournaments match your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTournaments.map((tournament) => {
            const tournamentId = tournament._id || tournament.id;

            const status = getDisplayStatus(tournament);

            const tournamentType = getTournamentType(tournament);

            const prizePool = getPrizeAmount(tournament);

            const maxParticipants = getMaxParticipants(tournament);

            const currentParticipants = getCurrentParticipants(tournament);

            const registrationPercentage =
              maxParticipants > 0
                ? Math.min((currentParticipants / maxParticipants) * 100, 100)
                : 0;

            return (
              <div
                key={tournamentId}
                className="theme-card rounded-2xl border overflow-hidden shadow-sm hover:border-indigo-500/50 transition-all flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tournament.tournamentImage || FALLBACK_IMAGE}
                    alt={tournament.title || "Tournament"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (e.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
                        return;
                      }

                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                      <Gamepad2 className="w-3.5 h-3.5" />
                      {tournament.game || "Esports"}
                    </span>

                    <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 text-right border border-white/10">
                      <p className="text-[10px] font-bold uppercase text-white/60">
                        Prize Pool
                      </p>

                      <p className="text-lg font-extrabold text-amber-400">
                        ₹{prizePool.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div>
                      <span className="inline-block text-[10px] font-bold text-white/80 uppercase tracking-wide">
                        {tournamentType === "team"
                          ? "Team Tournament"
                          : "Solo Tournament"}
                      </span>

                      <h3 className="text-xl font-extrabold text-white mt-1 line-clamp-1">
                        {tournament.title ||
                          tournament.name ||
                          "Untitled Tournament"}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-full capitalize ${getStatusClasses(
                        status,
                      )}`}
                    >
                      {getStatusLabel(status)}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="text-sm theme-subtext">
                      Organized by{" "}
                      <span className="theme-text font-bold">
                        {getOrganizerName(tournament)}
                      </span>
                    </p>

                    <p className="text-sm theme-subtext mt-2 line-clamp-2 min-h-[40px]">
                      {tournament.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-indigo-400" />

                        <span className="text-[10px] font-bold uppercase theme-subtext">
                          Date
                        </span>
                      </div>

                      <p className="text-xs font-bold theme-text">
                        {formatDate(tournament.startDate)}
                      </p>

                      <p className="text-xs font-bold theme-text">
                        {tournament.endDate
                          ? `- ${formatDate(tournament.endDate)}`
                          : ""}
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-indigo-400" />

                        <span className="text-[10px] font-bold uppercase theme-subtext">
                          Venue
                        </span>
                      </div>

                      <p className="text-xs font-bold theme-text line-clamp-1">
                        {formatVenue(tournament)}
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="w-4 h-4 text-emerald-400" />

                        <span className="text-[10px] font-bold uppercase theme-subtext">
                          Entry Fee
                        </span>
                      </div>

                      <p className="text-xs font-bold theme-text">
                        {Number(tournament.entryFee) > 0
                          ? `₹${Number(tournament.entryFee).toLocaleString(
                              "en-IN",
                            )}`
                          : "Free Entry"}
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-cyan-400" />

                        <span className="text-[10px] font-bold uppercase theme-subtext">
                          Participants
                        </span>
                      </div>

                      <p className="text-xs font-bold theme-text">
                        {currentParticipants}/{maxParticipants} registered
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-400" />

                      <span className="text-xs theme-subtext">
                        Registration closes{" "}
                        <span className="theme-text font-bold">
                          {formatDateTime(tournament.registrationDeadline)}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] theme-subtext mb-2">
                      <span>Tournament Capacity</span>

                      <span>
                        {currentParticipants}/{maxParticipants}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-500/20 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{
                          width: `${registrationPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="mt-5 pt-4 border-t flex items-center justify-between gap-3"
                    style={{
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/organizer/tournaments/${tournamentId}`)
                      }
                      className="text-sm font-semibold theme-subtext hover:theme-text transition-colors cursor-pointer"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/organizer/tournaments/${tournamentId}`)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
