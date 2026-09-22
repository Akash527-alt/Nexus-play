import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Users,
  Trophy,
  Clock,
  UserPlus,
  CheckCircle,
  Calendar,
  Shield,
  Gamepad2,
} from "lucide-react";
import { toast } from "sonner";

// Exact Relative Path for: src/components/tournaments/RegisterModal.jsx
import { RegisterModal } from "../../components/tournaments/RegisterModal";

export function ParticipantTournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  // Load tournament and registration status
  const fetchDetail = useCallback(() => {
    try {
      // Fetch tournaments from local storage or context mock data
      const local1 = JSON.parse(
        localStorage.getItem("nexus_tournaments") || "[]",
      );
      const local2 = JSON.parse(localStorage.getItem("my_tournaments") || "[]");
      const allTournaments = [...local1, ...local2];

      const found = allTournaments.find(
        (t) => String(t._id || t.id) === String(id),
      );

      if (found) {
        setTournament(found);

        // Check if current user is already registered for this tournament
        const myRegs = JSON.parse(
          localStorage.getItem("my_registrations") || "[]",
        );
        const registered = myRegs.some(
          (r) => String(r.tournamentId) === String(id),
        );
        setIsAlreadyRegistered(registered);
      } else {
        toast.error("Tournament details not found");
      }
    } catch (err) {
      console.error("Error loading tournament details:", err);
      toast.error("Failed to load tournament information");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const tournamentId = tournament?._id || tournament?.id;

        if (!tournamentId) return;

        await participantService.getMyRegistration(tournamentId);

        setIsRegistered(true);
      } catch (error) {
        const status = error?.response?.status;

        if (status === 404) {
          setIsRegistered(false);
        } else {
          console.error("Failed to check registration status:", error);
        }
      } finally {
        setCheckingRegistration(false);
      }
    };

    if (tournament) {
      checkRegistration();
    }
  }, [tournament]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">
            Loading Tournament Details...
          </span>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-white">Tournament Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested tournament may have been removed or does not exist.
        </p>
        <button
          onClick={() => navigate("/participant/tournaments")}
          className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Return to Tournaments
        </button>
      </div>
    );
  }

  const teamSize = Number(tournament.teamSize) || 1;
  const entryFee = Number(
    tournament.entryFee || tournament.registrationFee || 0,
  );
  const prizePool = Number(
    tournament.totalPrizePool || tournament.prizePool || 0,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-white">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/participant/tournaments")}
        className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tournaments
      </button>

      {/* Main Card Header */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md">
                {tournament.game || "Esports"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-md">
                {tournament.status || "Upcoming"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {tournament.title || tournament.name || "Untitled Tournament"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {tournament.description ||
                "Official tournament hosted on Nexus Play. Join with your team and compete for top positions."}
            </p>
          </div>

          {/* Action Registration Button */}
          <div className="w-full md:w-auto flex-shrink-0">
            {isAlreadyRegistered ? (
              <div className="flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-full">
                <CheckCircle className="w-4 h-4" /> Registered
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto px-6 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <UserPlus className="w-4 h-4" /> Register Squad
              </button>
            )}
          </div>
        </div>

        {/* Tournament Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
            <span className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Prize Pool
            </span>
            <p className="text-xl font-black text-indigo-400">
              ₹{prizePool.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
            <span className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" /> Roster Format
            </span>
            <p className="text-sm font-bold text-zinc-200">
              {teamSize > 1 ? `Squad (${teamSize} Players)` : "Solo (1v1)"}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
            <span className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" /> Entry Fee
            </span>
            <p className="text-sm font-bold text-emerald-400">
              {entryFee > 0 ? `₹${entryFee}` : "FREE ENTRY"}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
            <span className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" /> Venue / Room
            </span>
            <p className="text-sm font-bold text-zinc-200 truncate">
              {tournament.venue || "Custom Room / Online"}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Details & Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm uppercase text-indigo-400 tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" /> Tournament Schedule & Rules
          </h3>
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>
              1. All team members must enter their verified Game UIDs and
              In-Game Names (IGNs).
            </p>
            <p>
              2. Room credentials will be provided 15 minutes prior to the start
              time in your dashboard.
            </p>
            <p>
              3. Emulators, hacks, or third-party tools are strictly prohibited
              and will result in an immediate ban.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm uppercase text-emerald-400 tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" /> Organizer Support
          </h3>
          <div className="text-xs space-y-2 text-zinc-400">
            <p>
              <strong className="text-white">Organizer:</strong>{" "}
              {tournament.organizer || "Official Arena"}
            </p>
            <p>
              <strong className="text-white">Date:</strong>{" "}
              {tournament.date || "TBA"}
            </p>
            <p>
              <strong className="text-white">Fair Play:</strong> Guaranteed
              Anti-Cheat Protocol
            </p>
          </div>
        </div>
      </div>

      {/* Registration Modal Component */}
      <RegisterModal
        tournament={tournament}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setIsAlreadyRegistered(true);
          fetchDetail();
        }}
      />
    </div>
  );
}
