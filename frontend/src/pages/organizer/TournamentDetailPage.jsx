import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tournamentService } from "../../services/tournamentService";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ShieldAlert,
  UserCheck,
  Gamepad2,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

const FALLBACK_IMAGE = "/images/tournament-placeholder.png";

export function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);

  const [loading, setLoading] = useState(true);

  const formatDateTime = (dateValue, timeValue) => {
    if (!dateValue) {
      return "Not Set";
    }

    try {
      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return "Not Set";
      }

      const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (timeValue) {
        const [hours, minutes] = timeValue.split(":");

        const hourNumber = Number(hours);

        if (Number.isInteger(hourNumber) && minutes !== undefined) {
          const ampm = hourNumber >= 12 ? "PM" : "AM";

          const formattedHours = hourNumber % 12 || 12;

          return `${formattedDate} at ${formattedHours}:${minutes} ${ampm}`;
        }
      }

      const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
      console.error("Date formatting error:", error);

      return "Not Set";
    }
  };

  const getTournamentStatus = () => {
    const status = (tournament?.status || "published").toLowerCase();

    if (["draft", "cancelled", "completed", "ongoing"].includes(status)) {
      return status;
    }

    if (!tournament?.startDate) {
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

  const getStatusLabel = () => {
    const status = getTournamentStatus();

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

  const getStatusClasses = () => {
    const status = getTournamentStatus();

    if (status === "upcoming") {
      return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    }

    if (status === "ongoing") {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    }

    if (status === "completed") {
      return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    }

    if (status === "cancelled") {
      return "bg-rose-500/15 text-rose-400 border-rose-500/20";
    }

    if (status === "draft") {
      return "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
    }

    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  };

  const fetchDetail = useCallback(async () => {
    try {
      let data = null;

      try {
        const response = await tournamentService.getById(id);

        data =
          response?.tournament ||
          response?.data?.tournament ||
          response?.data ||
          response;
      } catch (apiError) {
        console.warn("Backend API fetch failed:", apiError);
      }

      if (!data || (!data._id && !data.id)) {
        const local1 = JSON.parse(
          localStorage.getItem("nexus_tournaments") || "[]",
        );

        const local2 = JSON.parse(
          localStorage.getItem("my_tournaments") || "[]",
        );

        data = [...local1, ...local2].find(
          (tournament) =>
            String(tournament._id || tournament.id) === String(id),
        );
      }

      if (data) {
        setTournament(data);
      } else {
        toast.error("Failed to load tournament details");
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);

      toast.error("Failed to load tournament details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <div className="theme-card p-12 text-center rounded-2xl border">
        <p className="text-sm theme-subtext">Loading tournament details...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="theme-card p-12 text-center rounded-2xl border space-y-3">
        <h2 className="text-lg font-bold theme-text">Tournament Not Found</h2>

        <button
          type="button"
          onClick={() => navigate("/organizer/tournaments")}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  const registeredSlots = Number(tournament.currentParticipants) || 0;

  const maxSlots =
    Number(tournament.maxParticipants) || Number(tournament.maxSlots) || 16;

  const prizePoolAmount =
    Number(tournament.prizePool) || Number(tournament.totalPrizePool) || 0;

  const tournamentType =
    tournament.tournamentType ||
    (Number(tournament.teamSize) > 1 ? "team" : "solo");

  const imageSource = tournament.tournamentImage || FALLBACK_IMAGE;

  const registrationPercentage =
    maxSlots > 0 ? Math.min((registeredSlots / maxSlots) * 100, 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/organizer/tournaments")}
          className="theme-hover theme-text flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer"
          style={{
            borderColor: "var(--border-color)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </button>

        <button
          type="button"
          onClick={() => navigate(`/organizer/tournaments/${id}/participants`)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors"
        >
          <UserCheck className="w-4 h-4" />
          Registered Teams
        </button>
      </div>

      <div className="theme-card rounded-2xl border overflow-hidden shadow-sm">
        <div className="relative h-[300px] sm:h-[380px] overflow-hidden">
          <img
            src={imageSource}
            alt={tournament.title || "Tournament"}
            className="w-full h-full object-cover"
            onError={(event) => {
              if (event.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
                return;
              }

              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-black/45 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                <Gamepad2 className="w-3.5 h-3.5" />
                {tournament.game || "Esports"}
              </span>

              <span
                className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border backdrop-blur-sm ${getStatusClasses()}`}
              >
                {getStatusLabel()}
              </span>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 text-right">
              <p className="text-[10px] font-bold uppercase text-white/60">
                Prize Pool
              </p>

              <p className="text-xl font-extrabold text-amber-400">
                ₹{prizePoolAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 left-5 right-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">
                  {tournamentType === "team"
                    ? `Team Tournament${
                        tournament.teamSize
                          ? ` • ${tournament.teamSize} Players`
                          : ""
                      }`
                    : "Solo Tournament"}
                </p>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {tournament.title || tournament.name || "Untitled Tournament"}
                </h1>

                <p className="text-sm text-white/70 mt-2 max-w-3xl line-clamp-2">
                  {tournament.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs theme-subtext">Organized by</p>

              <p className="text-sm font-bold theme-text">
                {tournament.organizer?.organizationName ||
                  tournament.organizerName ||
                  "You"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(`/organizer/tournaments/${id}/participants`)
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              View Registered Teams ({registeredSlots})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              className="p-4 rounded-xl border bg-indigo-500/5"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Prize Pool
              </span>

              <p className="text-lg font-bold text-indigo-500 mt-1">
                ₹{prizePoolAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div
              className="p-4 rounded-xl border bg-indigo-500/5"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Total Slots
              </span>

              <p className="text-lg font-bold theme-text mt-1">
                {registeredSlots} / {maxSlots}
              </p>
            </div>

            <div
              className="p-4 rounded-xl border bg-indigo-500/5"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Venue
              </span>

              <p className="text-sm font-bold theme-text mt-1 line-clamp-2">
                {tournament.venue || "Online Tournament"}
              </p>
            </div>

            <div
              className="p-4 rounded-xl border bg-indigo-500/5"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Entry Fee
              </span>

              <p className="text-sm font-bold theme-text mt-1">
                {Number(tournament.entryFee || tournament.registrationFee) > 0
                  ? `₹${Number(
                      tournament.entryFee || tournament.registrationFee,
                    ).toLocaleString("en-IN")}`
                  : "Free Entry"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold theme-subtext">
                Tournament Capacity
              </span>

              <span className="text-xs font-bold theme-text">
                {registeredSlots} / {maxSlots}
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
            className="p-4 rounded-xl border space-y-3"
            style={{
              borderColor: "var(--border-color)",
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider theme-subtext flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Event Schedule & Timelines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div
                className="p-3 rounded-lg border bg-zinc-500/5"
                style={{
                  borderColor: "var(--border-color)",
                }}
              >
                <span className="theme-subtext block text-[10px] uppercase font-bold">
                  Registration Deadline
                </span>

                <span className="theme-text font-bold text-rose-500">
                  {formatDateTime(
                    tournament.registrationDeadline,
                    tournament.registrationDeadlineTime,
                  )}
                </span>
              </div>

              <div
                className="p-3 rounded-lg border bg-zinc-500/5"
                style={{
                  borderColor: "var(--border-color)",
                }}
              >
                <span className="theme-subtext block text-[10px] uppercase font-bold">
                  Event Start
                </span>

                <span className="theme-text font-bold">
                  {formatDateTime(tournament.startDate, tournament.startTime)}
                </span>
              </div>

              <div
                className="p-3 rounded-lg border bg-zinc-500/5"
                style={{
                  borderColor: "var(--border-color)",
                }}
              >
                <span className="theme-subtext block text-[10px] uppercase font-bold">
                  Event End
                </span>

                <span className="theme-text font-bold">
                  {formatDateTime(tournament.endDate, tournament.endTime)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold theme-text mb-3">
              Configured Prize Breakdown
            </h3>

            {Array.isArray(tournament.prizes) &&
            tournament.prizes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tournament.prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg border text-xs"
                    style={{
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <span className="font-semibold theme-text">
                      Rank {prize.position || index + 1}
                    </span>

                    <span className="font-bold text-emerald-500">
                      ₹{(Number(prize.amount) || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs theme-subtext">
                No prize breakdown configured.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold theme-text mb-2 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-indigo-500" />
              Event Rules & Regulations
            </h3>

            <div
              className="p-4 rounded-xl border text-xs theme-subtext space-y-2"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              {typeof tournament.rules === "string" ? (
                tournament.rules
                  .split(/\r?\n/)
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0)
                  .map((rule, index) => (
                    <p key={index} className="flex items-start gap-1.5">
                      <span>•</span>

                      <span>{rule.replace(/^[•\-\*\d+\.]\s*/, "")}</span>
                    </p>
                  ))
              ) : Array.isArray(tournament.rules) ? (
                tournament.rules.map((rule, index) => (
                  <p key={index} className="flex items-start gap-1.5">
                    <span>•</span>

                    <span>{String(rule).replace(/^[•\-\*\d+\.]\s*/, "")}</span>
                  </p>
                ))
              ) : (
                <p>Standard fair play rules apply.</p>
              )}
            </div>
          </div>

          <div className="sm:hidden">
            <button
              type="button"
              onClick={() =>
                navigate(`/organizer/tournaments/${id}/participants`)
              }
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              View Registered Teams ({registeredSlots})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
