import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Trophy,
  Users,
  Handshake,
  Gamepad2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Monitor,
  Building2,
  ScrollText,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { tournamentService } from "../../services/tournamentService";
import { SponsorModal } from "../../components/sponsor/SponsorModal";
import { toast } from "sonner";

export function SponsorTournamentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTournament = async () => {
    try {
      setLoading(true);

      const response = await tournamentService.getById(id);

      const tournamentData = response?.data || response?.tournament || response;

      setTournament(tournamentData);
    } catch (error) {
      console.error("Failed to load tournament:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load tournament.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    loadTournament();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "TBA";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "TBA";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    if (value === 0) {
      return "Free";
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-xs theme-subtext">Loading tournament...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="theme-card border theme-border rounded-2xl p-10 text-center">
        <p className="text-sm font-bold theme-text">Tournament not found</p>

        <button
          onClick={() => navigate("/sponsor/tournaments")}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  const title = tournament.title || tournament.name || "Tournament";

  const prizePool = Number(tournament.prizePool || 0);

  const currentParticipants = Number(tournament.currentParticipants || 0);

  const maxParticipants = Number(tournament.maxParticipants || 0);

  const organizerName =
    tournament.organizer?.organizationName || "Verified Organizer";

  const organizerType =
    tournament.organizer?.organizationType || "Organization";

  const participationPercentage =
    maxParticipants > 0
      ? Math.min((currentParticipants / maxParticipants) * 100, 100)
      : 0;

  return (
    <div className="space-y-6 pb-8">
      <button
        onClick={() => navigate("/sponsor/tournaments")}
        className="flex items-center gap-2 text-xs font-semibold theme-subtext hover:theme-text transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tournaments
      </button>

      <div className="theme-card border theme-border rounded-3xl overflow-hidden">
        <div className="relative h-52 md:h-64 bg-gradient-to-br from-indigo-700/70 via-purple-700/50 to-slate-950">
          {tournament.banner?.url ||
          tournament.bannerImage?.url ||
          tournament.bannerImage ||
          tournament.bannerUrl ? (
            <img
              src={
                tournament.banner?.url ||
                tournament.bannerImage?.url ||
                tournament.bannerImage ||
                tournament.bannerUrl
              }
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="w-20 h-20 text-white/15" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute top-5 left-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              <Gamepad2 className="w-3 h-3" />
              {tournament.game || "Esports"}
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white">
                  {title}
                </h1>

                <p className="text-xs md:text-sm text-white/70 mt-2">
                  Organized by{" "}
                  <span className="text-white font-semibold">
                    {organizerName}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition"
              >
                <Handshake className="w-4 h-4" />
                Sponsor This Tournament
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5">
          <CalendarDays className="w-5 h-5 text-indigo-400" />

          <p className="text-[10px] theme-subtext uppercase tracking-wider mt-3">
            Start Date
          </p>

          <p className="text-sm font-bold theme-text mt-1">
            {formatDate(tournament.startDate)}
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <CalendarDays className="w-5 h-5 text-purple-400" />

          <p className="text-[10px] theme-subtext uppercase tracking-wider mt-3">
            End Date
          </p>

          <p className="text-sm font-bold theme-text mt-1">
            {formatDate(tournament.endDate)}
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <Users className="w-5 h-5 text-cyan-400" />

          <p className="text-[10px] theme-subtext uppercase tracking-wider mt-3">
            Participants
          </p>

          <p className="text-sm font-bold theme-text mt-1">
            {currentParticipants} / {maxParticipants || "Unlimited"}
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <Trophy className="w-5 h-5 text-amber-400" />

          <p className="text-[10px] theme-subtext uppercase tracking-wider mt-3">
            Prize Pool
          </p>

          <p className="text-sm font-bold text-amber-400 mt-1">
            {formatAmount(prizePool)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="theme-card border theme-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-indigo-400" />
              </div>

              <div>
                <h2 className="text-base font-bold theme-text">
                  Tournament Overview
                </h2>

                <p className="text-[11px] theme-subtext">
                  Important tournament information
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-[10px] theme-subtext uppercase tracking-wider font-bold">
                  Description
                </p>

                <p className="text-sm theme-text mt-2 leading-relaxed">
                  {tournament.description || "No description provided."}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-indigo-400" />

                  <p className="text-[10px] theme-subtext uppercase tracking-wider font-bold">
                    Tournament Rules
                  </p>
                </div>

                <div className="mt-2 p-4 rounded-xl theme-icon-box border theme-border">
                  <p className="text-sm theme-text leading-relaxed whitespace-pre-line">
                    {tournament.rules || "No specific rules provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="theme-card border theme-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-cyan-400" />
              </div>

              <div>
                <h2 className="text-base font-bold theme-text">Schedule</h2>

                <p className="text-[11px] theme-subtext">Tournament timeline</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <p className="text-[10px] theme-subtext uppercase font-bold">
                  Start
                </p>

                <p className="text-sm font-bold theme-text mt-2">
                  {formatDateTime(tournament.startDate)}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <p className="text-[10px] theme-subtext uppercase font-bold">
                  End
                </p>

                <p className="text-sm font-bold theme-text mt-2">
                  {formatDateTime(tournament.endDate)}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />

                  <p className="text-[10px] theme-subtext uppercase font-bold">
                    Registration Deadline
                  </p>
                </div>

                <p className="text-sm font-bold theme-text mt-2">
                  {formatDateTime(tournament.registrationDeadline)}
                </p>
              </div>
            </div>
          </div>

          <div className="theme-card border theme-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-base font-bold theme-text">
                  Prize & Registration
                </h2>

                <p className="text-[11px] theme-subtext">
                  Tournament financial details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <IndianRupee className="w-4 h-4 text-emerald-400" />

                <p className="text-[10px] theme-subtext uppercase font-bold mt-3">
                  Entry Fee
                </p>

                <p className="text-sm font-bold theme-text mt-1">
                  {formatAmount(tournament.entryFee)}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <Trophy className="w-4 h-4 text-amber-400" />

                <p className="text-[10px] theme-subtext uppercase font-bold mt-3">
                  Total Prize Pool
                </p>

                <p className="text-sm font-bold text-amber-400 mt-1">
                  {formatAmount(prizePool)}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <Users className="w-4 h-4 text-cyan-400" />

                <p className="text-[10px] theme-subtext uppercase font-bold mt-3">
                  Maximum Participants
                </p>

                <p className="text-sm font-bold theme-text mt-1">
                  {maxParticipants || "Unlimited"}
                </p>
              </div>
            </div>

            {Array.isArray(tournament.prizes) &&
              tournament.prizes.length > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] theme-subtext uppercase tracking-wider font-bold mb-3">
                    Prize Breakdown
                  </p>

                  <div className="space-y-2">
                    {tournament.prizes.map((prize, index) => (
                      <div
                        key={prize._id || `${prize.position}-${index}`}
                        className="flex items-center justify-between p-3 rounded-xl theme-icon-box border theme-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          </div>

                          <span className="text-xs font-semibold theme-text">
                            {prize.position === 1
                              ? "1st Place"
                              : prize.position === 2
                                ? "2nd Place"
                                : prize.position === 3
                                  ? "3rd Place"
                                  : `${prize.position}th Place`}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-amber-400">
                          {formatAmount(prize.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="theme-card border theme-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <MapPin className="w-5 h-5 text-cyan-400" />

              <h2 className="text-base font-bold theme-text">Location</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] theme-subtext uppercase font-bold">
                  Tournament Mode
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Monitor className="w-4 h-4 text-indigo-400" />

                  <p className="text-sm font-semibold theme-text">
                    {tournament.tournamentMode || "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] theme-subtext uppercase font-bold">
                  Venue
                </p>

                <p className="text-sm font-semibold theme-text mt-2">
                  {tournament.venue || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-[10px] theme-subtext uppercase font-bold">
                  City / Region
                </p>

                <p className="text-sm font-semibold theme-text mt-2">
                  {tournament.cityRegion || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="theme-card border theme-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <Building2 className="w-5 h-5 text-purple-400" />

              <h2 className="text-base font-bold theme-text">Organizer</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] theme-subtext uppercase font-bold">
                  Organization Name
                </p>

                <p className="text-sm font-bold theme-text mt-2">
                  {organizerName}
                </p>
              </div>

              <div>
                <p className="text-[10px] theme-subtext uppercase font-bold">
                  Organization Type
                </p>

                <p className="text-sm font-semibold theme-text mt-2 capitalize">
                  {organizerType}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Verified Organizer
              </div>
            </div>
          </div>

          <div className="theme-card border theme-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <Users className="w-5 h-5 text-indigo-400" />

              <h2 className="text-base font-bold theme-text">Participation</h2>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black theme-text">
                  {currentParticipants}
                </p>

                <p className="text-[10px] theme-subtext">Registered</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold theme-text">
                  {maxParticipants}
                </p>

                <p className="text-[10px] theme-subtext">Maximum</p>
              </div>
            </div>

            {maxParticipants > 0 && (
              <div className="mt-4">
                <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{
                      width: `${participationPercentage}%`,
                    }}
                  />
                </div>

                <p className="text-[10px] theme-subtext mt-2">
                  {Math.round(participationPercentage)}% capacity filled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="theme-card border theme-border rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Handshake className="w-5 h-5 text-indigo-400" />
          </div>

          <div>
            <h2 className="text-base font-bold theme-text">
              Sponsorship Opportunity
            </h2>

            <p className="text-xs theme-subtext mt-1 leading-relaxed">
              Every published tournament on NexusPlay can receive sponsorship
              proposals. Sponsors can propose an amount and specify the brand
              visibility or promotional requirements they expect from the
              organizer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
          <div className="theme-icon-box border theme-border rounded-xl p-4">
            <p className="text-xs font-bold theme-text">1. Submit Proposal</p>

            <p className="text-[11px] theme-subtext mt-1">
              Propose your sponsorship amount and requirements.
            </p>
          </div>

          <div className="theme-icon-box border theme-border rounded-xl p-4">
            <p className="text-xs font-bold theme-text">2. Organizer Review</p>

            <p className="text-[11px] theme-subtext mt-1">
              The tournament organizer reviews your proposal.
            </p>
          </div>

          <div className="theme-icon-box border theme-border rounded-xl p-4">
            <p className="text-xs font-bold theme-text">3. Payment</p>

            <p className="text-[11px] theme-subtext mt-1">
              Payment becomes available after the organizer approves the
              request.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition"
        >
          <Handshake className="w-4 h-4" />
          Submit Sponsorship Proposal
        </button>
      </div>

      <SponsorModal
        tournament={tournament}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default SponsorTournamentDetails;
