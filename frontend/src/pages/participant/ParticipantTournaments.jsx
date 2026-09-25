import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Gamepad2,
  IndianRupee,
  MapPin,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { participantService } from "../../services/participantService";
import { ParticipantRegistrationModal } from "../../components/participant/ParticipantRegistrationModal";

const FALLBACK_IMAGE = "/images/tournament-placeholder.png";

export const ParticipantTournaments = () => {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [registeredTournamentIds, setRegisteredTournamentIds] = useState(
    new Set(),
  );

  const [selectedTournament, setSelectedTournament] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTournaments();
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      const response = await participantService.getMyRegistrations();

      const registrations = response?.data || response?.registrations || [];

      const ids = new Set(
        registrations
          .map((registration) => {
            const tournament =
              registration.tournament?._id ||
              registration.tournament?.id ||
              registration.tournament;

            return tournament?.toString();
          })
          .filter(Boolean),
      );

      setRegisteredTournamentIds(ids);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    }
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);

      let list = [];

      try {
        if (
          participantService &&
          typeof participantService.getTournaments === "function"
        ) {
          const response = await participantService.getTournaments();

          list =
            response?.tournaments ||
            response?.data?.tournaments ||
            response?.data ||
            [];
        }
      } catch (error) {
        console.warn("Backend tournament fetch failed:", error);
      }

      if (!Array.isArray(list)) {
        list = [];
      }

      setTournaments(list);
    } catch (error) {
      console.error("Failed to process tournaments:", error);

      toast.error("Failed to load tournaments list");

      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const getTournamentStatus = (tournament) => {
    const configuredStatus = (tournament.status || "published").toLowerCase();

    if (["draft", "cancelled", "completed"].includes(configuredStatus)) {
      return configuredStatus;
    }

    const now = new Date();

    const startDate = tournament.startDate
      ? new Date(tournament.startDate)
      : null;

    const endDate = tournament.endDate ? new Date(tournament.endDate) : null;

    if (startDate && now < startDate) {
      return "upcoming";
    }

    if (startDate && now >= startDate && (!endDate || now <= endDate)) {
      return "ongoing";
    }

    if (endDate && now > endDate) {
      return "completed";
    }

    return configuredStatus;
  };

  const getRegistrationState = (tournament) => {
    const status = getTournamentStatus(tournament);

    const now = new Date();

    const startDate = tournament.startDate
      ? new Date(tournament.startDate)
      : null;

    const registrationDeadline = tournament.registrationDeadline
      ? new Date(tournament.registrationDeadline)
      : null;

    const currentParticipants = Number(tournament.currentParticipants) || 0;

    const maxParticipants =
      Number(tournament.maxParticipants) ||
      Number(tournament.maxSlots) ||
      Number(tournament.maxTeams) ||
      0;

    if (status === "ongoing") {
      return {
        allowed: false,
        label: "Tournament Live",
        reason: "Registration is closed because the tournament is ongoing.",
      };
    }

    if (status === "completed") {
      return {
        allowed: false,
        label: "Tournament Completed",
        reason: "Registration is closed because the tournament has ended.",
      };
    }

    if (status === "cancelled") {
      return {
        allowed: false,
        label: "Tournament Cancelled",
        reason: "Registration is closed for this tournament.",
      };
    }

    if (status === "draft") {
      return {
        allowed: false,
        label: "Not Open",
        reason: "This tournament is not open for registration.",
      };
    }

    if (registrationDeadline && now >= registrationDeadline) {
      return {
        allowed: false,
        label: "Registration Closed",
        reason: "The registration deadline has passed.",
      };
    }

    if (startDate && now >= startDate) {
      return {
        allowed: false,
        label: "Tournament Started",
        reason: "Registration is closed because the tournament has started.",
      };
    }

    if (maxParticipants > 0 && currentParticipants >= maxParticipants) {
      return {
        allowed: false,
        label: "Slots Full",
        reason: "All tournament slots are filled.",
      };
    }

    return {
      allowed: true,
      label: "Register Now",
      reason: "",
    };
  };

  const formatDate = (date) => {
    if (!date) return "TBA";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "TBA";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "TBA";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "TBA";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPrizePool = (tournament) => {
    return (
      Number(tournament.prizePool) || Number(tournament.totalPrizePool) || 0
    );
  };

  const getEntryFee = (tournament) => {
    return (
      Number(tournament.entryFee) || Number(tournament.registrationFee) || 0
    );
  };

  const getMaxParticipants = (tournament) => {
    return (
      Number(tournament.maxParticipants) ||
      Number(tournament.maxSlots) ||
      Number(tournament.maxTeams) ||
      0
    );
  };

  const getCurrentParticipants = (tournament) => {
    return (
      Number(tournament.currentParticipants) ||
      Number(tournament.filledSlots) ||
      0
    );
  };

  const getOrganizerName = (tournament) => {
    return (
      tournament.organizer?.organizationName ||
      tournament.organizerName ||
      "Official Arena"
    );
  };

  const handleOpenRegisterModal = (tournament) => {
    const registrationState = getRegistrationState(tournament);

    if (!registrationState.allowed) {
      toast.error(registrationState.reason);

      return;
    }

    setSelectedTournament(tournament);

    setIsModalOpen(true);
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const title = (tournament.title || tournament.name || "").toLowerCase();

    const game = (tournament.game || "").toLowerCase();

    const query = searchQuery.toLowerCase();

    const matchesSearch = title.includes(query) || game.includes(query);

    if (!matchesSearch) {
      return false;
    }

    const status = getTournamentStatus(tournament);

    const tournamentId = String(tournament._id || tournament.id);

    const isRegistered =
      tournament.isRegistered || registeredTournamentIds.has(tournamentId);

    if (filter === "registered") {
      return isRegistered;
    }

    if (filter === "live") {
      return status === "ongoing";
    }

    if (filter === "upcoming") {
      return status === "upcoming" || status === "published";
    }

    return status !== "completed";
  });

  return (
    <div className="w-full space-y-6">
      <div className="theme-card border theme-border p-6 rounded-2xl shadow-xs w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold theme-text">
            Esports Arena Tournaments
          </h1>

          <p className="text-xs theme-subtext mt-1">
            Browse available tournaments, register your squad, and compete for
            prize pools.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-subtext" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search game or event..."
            className="w-full theme-input border theme-border rounded-xl px-3.5 py-2 text-xs theme-text focus:outline-none focus:border-indigo-500 pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          {
            id: "all",
            label: "All Tournaments",
          },
          {
            id: "registered",
            label: "My Registrations",
          },
          {
            id: "upcoming",
            label: "Upcoming / Open",
          },
          {
            id: "live",
            label: "Live Now",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filter === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "theme-card border theme-border theme-subtext theme-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs theme-subtext theme-card border theme-border rounded-2xl">
          Fetching available tournaments...
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="p-12 text-center text-xs theme-subtext theme-card border theme-border rounded-2xl">
          No tournaments found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {filteredTournaments.map((tournament) => {
            const tournamentId = String(tournament._id || tournament.id);

            const status = getTournamentStatus(tournament);

            const isRegistered =
              tournament.isRegistered ||
              registeredTournamentIds.has(tournamentId);

            const registrationState = getRegistrationState(tournament);

            const prizePool = getPrizePool(tournament);

            const entryFee = getEntryFee(tournament);

            const maxParticipants = getMaxParticipants(tournament);

            const currentParticipants = getCurrentParticipants(tournament);

            const capacityPercentage =
              maxParticipants > 0
                ? Math.min((currentParticipants / maxParticipants) * 100, 100)
                : 0;

            const isLive = status === "ongoing";

            return (
              <div
                key={tournamentId}
                onClick={() =>
                  navigate(`/participant/tournaments/${tournamentId}`)
                }
                className="theme-card border theme-border rounded-2xl overflow-hidden shadow-xs hover:border-indigo-500/50 transition cursor-pointer flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={tournament.tournamentImage || FALLBACK_IMAGE}
                    alt={tournament.title || "Tournament"}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-white bg-black/45 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                      <Gamepad2 className="w-3.5 h-3.5" />
                      {tournament.game || "Esports"}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm ${
                        isLive
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : status === "completed"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : status === "cancelled"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isLive
                        ? "Ongoing"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-bold text-white/70 uppercase">
                      {tournament.tournamentType === "team"
                        ? "Team Tournament"
                        : "Solo Tournament"}
                    </p>

                    <h3 className="text-xl font-extrabold text-white mt-1 line-clamp-1">
                      {tournament.title ||
                        tournament.name ||
                        "Untitled Tournament"}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div>
                    <p className="text-xs theme-subtext">
                      Organizer:{" "}
                      <span className="theme-text font-bold">
                        {getOrganizerName(tournament)}
                      </span>
                    </p>

                    <p className="text-xs theme-subtext mt-2 line-clamp-2 min-h-[32px]">
                      {tournament.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-amber-400" />

                        <span className="text-[10px] font-bold uppercase theme-subtext">
                          Prize Pool
                        </span>
                      </div>

                      <p className="text-sm font-bold text-emerald-500">
                        ₹{prizePool.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="w-4 h-4 text-indigo-400" />

                        <span className="text-[10px] font-bold uppercase theme-subtext">
                          Entry Fee
                        </span>
                      </div>

                      <p className="text-sm font-bold theme-text">
                        {entryFee > 0
                          ? `₹${entryFee.toLocaleString("en-IN")}`
                          : "Free"}
                      </p>
                    </div>

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
                          Slots Filled
                        </span>
                      </div>

                      <p className="text-xs font-bold theme-text">
                        {currentParticipants} / {maxParticipants}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] theme-subtext mb-1.5">
                      <span>Tournament Capacity</span>

                      <span>
                        {currentParticipants}/{maxParticipants}
                      </span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-slate-500/20 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${capacityPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs theme-subtext">
                    <Clock className="w-4 h-4 text-amber-400" />

                    <span>
                      Registration closes{" "}
                      <span className="theme-text font-bold">
                        {formatDateTime(tournament.registrationDeadline)}
                      </span>
                    </span>
                  </div>

                  <div
                    className="mt-4 pt-4 border-t"
                    style={{
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {isRegistered ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-500">
                        <CheckCircle2 className="h-5 w-5" />
                        Already Registered
                      </div>
                    ) : registrationState.allowed ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          handleOpenRegisterModal(tournament);
                        }}
                        className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 cursor-pointer"
                      >
                        Register Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        onClick={(event) => event.stopPropagation()}
                        className="w-full rounded-xl theme-icon-box border theme-border px-5 py-3 font-semibold theme-subtext cursor-not-allowed"
                      >
                        {registrationState.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTournament && (
        <ParticipantRegistrationModal
          tournament={selectedTournament}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTournament(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedTournament(null);
            fetchTournaments();
            fetchMyRegistrations();
          }}
        />
      )}
    </div>
  );
};

export default ParticipantTournaments;
