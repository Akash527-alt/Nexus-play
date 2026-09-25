import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Gamepad2,
  IndianRupee,
  MapPin,
  ShieldAlert,
  Trophy,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { participantService } from "../../services/participantService";
import { ParticipantRegistrationModal } from "../../components/participant/ParticipantRegistrationModal";

const FALLBACK_IMAGE = "/images/tournament-placeholder.png";

export const ParticipantTournamentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);

  const [loading, setLoading] = useState(true);

  const [registeredTournamentIds, setRegisteredTournamentIds] = useState(
    new Set(),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTournament();
    fetchMyRegistrations();
  }, [id]);

  const fetchTournament = async () => {
    try {
      setLoading(true);

      const response = await participantService.getTournaments();

      const tournaments =
        response?.tournaments ||
        response?.data?.tournaments ||
        response?.data ||
        [];

      const currentTournament = Array.isArray(tournaments)
        ? tournaments.find((item) => String(item._id || item.id) === String(id))
        : null;

      if (!currentTournament) {
        toast.error("Tournament not found");
        return;
      }

      setTournament(currentTournament);
    } catch (error) {
      console.error("Failed to load tournament:", error);

      toast.error("Failed to load tournament details");
    } finally {
      setLoading(false);
    }
  };

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

  const getTournamentStatus = () => {
    if (!tournament) {
      return "published";
    }

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

  const getRegistrationState = () => {
    const status = getTournamentStatus();

    const now = new Date();

    const startDate = tournament?.startDate
      ? new Date(tournament.startDate)
      : null;

    const deadline = tournament?.registrationDeadline
      ? new Date(tournament.registrationDeadline)
      : null;

    const currentParticipants = Number(tournament?.currentParticipants) || 0;

    const maxParticipants = Number(tournament?.maxParticipants) || 0;

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
        reason: "This tournament has already ended.",
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
        label: "Registration Unavailable",
        reason: "This tournament is not open for registration.",
      };
    }

    if (deadline && now >= deadline) {
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

  const handleRegister = () => {
    const state = getRegistrationState();

    if (!state.allowed) {
      toast.error(state.reason);

      return;
    }

    setIsModalOpen(true);
  };

  const formatDate = (value) => {
    if (!value) {
      return "TBA";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "TBA";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "TBA";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "TBA";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="theme-card border theme-border rounded-2xl p-12 text-center">
        <p className="text-sm theme-subtext">Loading tournament details...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="theme-card border theme-border rounded-2xl p-12 text-center space-y-4">
        <h2 className="text-lg font-bold theme-text">Tournament Not Found</h2>

        <button
          type="button"
          onClick={() => navigate("/participant/tournaments")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  const status = getTournamentStatus();

  const registrationState = getRegistrationState();

  const tournamentId = String(tournament._id || tournament.id);

  const isRegistered = registeredTournamentIds.has(tournamentId);

  const prizePool =
    Number(tournament.prizePool) || Number(tournament.totalPrizePool) || 0;

  const entryFee =
    Number(tournament.entryFee) || Number(tournament.registrationFee) || 0;

  const currentParticipants = Number(tournament.currentParticipants) || 0;

  const maxParticipants =
    Number(tournament.maxParticipants) || Number(tournament.maxSlots) || 0;

  const capacityPercentage =
    maxParticipants > 0
      ? Math.min((currentParticipants / maxParticipants) * 100, 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <button
        type="button"
        onClick={() => navigate("/participant/tournaments")}
        className="theme-text theme-card border theme-border flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tournaments
      </button>

      <div className="theme-card border theme-border rounded-2xl overflow-hidden">
        <div className="relative h-[300px] sm:h-[400px]">
          <img
            src={tournament.tournamentImage || FALLBACK_IMAGE}
            alt={tournament.title || "Tournament"}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-white bg-black/50 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
              <Gamepad2 className="w-3.5 h-3.5" />
              {tournament.game || "Esports"}
            </span>

            <span
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${
                status === "ongoing"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : status === "completed"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : status === "cancelled"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {status === "ongoing"
                ? "Ongoing"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="absolute bottom-6 left-5 right-5">
            <p className="text-xs text-white/70 font-bold uppercase">
              {tournament.tournamentType === "team"
                ? "Team Tournament"
                : "Solo Tournament"}
            </p>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              {tournament.title || tournament.name}
            </h1>

            <p className="text-sm text-white/70 mt-2 max-w-3xl">
              {tournament.description || "No description provided."}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <Trophy className="w-4 h-4 text-amber-400 mb-2" />

              <p className="text-[10px] theme-subtext uppercase font-bold">
                Prize Pool
              </p>

              <p className="text-lg font-bold text-emerald-500">
                ₹{prizePool.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <IndianRupee className="w-4 h-4 text-indigo-400 mb-2" />

              <p className="text-[10px] theme-subtext uppercase font-bold">
                Entry Fee
              </p>

              <p className="text-lg font-bold theme-text">
                {entryFee > 0 ? `₹${entryFee.toLocaleString("en-IN")}` : "Free"}
              </p>
            </div>

            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <Users className="w-4 h-4 text-cyan-400 mb-2" />

              <p className="text-[10px] theme-subtext uppercase font-bold">
                Participants
              </p>

              <p className="text-lg font-bold theme-text">
                {currentParticipants}/{maxParticipants}
              </p>
            </div>

            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <Gamepad2 className="w-4 h-4 text-indigo-400 mb-2" />

              <p className="text-[10px] theme-subtext uppercase font-bold">
                Type
              </p>

              <p className="text-lg font-bold theme-text capitalize">
                {tournament.tournamentType || "Solo"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-indigo-400" />

                <span className="text-xs font-bold uppercase theme-subtext">
                  Tournament Start
                </span>
              </div>

              <p className="text-sm font-bold theme-text">
                {formatDateTime(tournament.startDate)}
              </p>
            </div>

            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-indigo-400" />

                <span className="text-xs font-bold uppercase theme-subtext">
                  Tournament End
                </span>
              </div>

              <p className="text-sm font-bold theme-text">
                {formatDateTime(tournament.endDate)}
              </p>
            </div>

            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-rose-400" />

                <span className="text-xs font-bold uppercase theme-subtext">
                  Registration Deadline
                </span>
              </div>

              <p className="text-sm font-bold theme-text">
                {formatDateTime(tournament.registrationDeadline)}
              </p>
            </div>

            <div className="theme-icon-box border theme-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-400" />

                <span className="text-xs font-bold uppercase theme-subtext">
                  Venue
                </span>
              </div>

              <p className="text-sm font-bold theme-text">
                {tournament.venue || "Online Tournament"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold theme-subtext">
                Tournament Capacity
              </span>

              <span className="text-xs font-bold theme-text">
                {currentParticipants}/{maxParticipants}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-500/20 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{
                  width: `${capacityPercentage}%`,
                }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold theme-text mb-3">
              Prize Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.isArray(tournament.prizes) &&
              tournament.prizes.length > 0 ? (
                tournament.prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="theme-icon-box border theme-border rounded-xl p-3 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold theme-text">
                      Rank {prize.position || index + 1}
                    </span>

                    <span className="text-sm font-bold text-emerald-500">
                      ₹{Number(prize.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs theme-subtext">
                  No prize breakdown available.
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold theme-text mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              Tournament Rules
            </h2>

            <div className="theme-icon-box border theme-border rounded-xl p-4">
              {typeof tournament.rules === "string" ? (
                tournament.rules
                  .split(/\r?\n/)
                  .filter((rule) => rule.trim())
                  .map((rule, index) => (
                    <p key={index} className="text-xs theme-subtext mb-2">
                      • {rule.trim()}
                    </p>
                  ))
              ) : (
                <p className="text-xs theme-subtext">
                  Standard tournament rules apply.
                </p>
              )}
            </div>
          </div>

          <div className="border-t theme-border pt-5">
            {isRegistered ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 font-bold text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
                Already Registered
              </div>
            ) : registrationState.allowed ? (
              <button
                type="button"
                onClick={handleRegister}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white transition hover:bg-indigo-500 cursor-pointer"
              >
                Register Now
              </button>
            ) : (
              <div className="theme-icon-box border theme-border rounded-xl px-5 py-3.5 text-center">
                <p className="text-sm font-bold theme-subtext">
                  {registrationState.label}
                </p>

                <p className="text-xs theme-subtext mt-1">
                  {registrationState.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ParticipantRegistrationModal
          tournament={tournament}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchTournament();
            fetchMyRegistrations();
          }}
        />
      )}
    </div>
  );
};

export default ParticipantTournamentDetailPage;
