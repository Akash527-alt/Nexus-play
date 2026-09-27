import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Users,
  User,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { tournamentService } from "../../services/tournamentService";

export const PrizeDistributionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(null);

  const [tournament, setTournament] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [distributions, setDistributions] = useState([]);

  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  useEffect(() => {
    fetchPrizeDistribution();
  }, [id]);

  const fetchPrizeDistribution = async () => {
    try {
      setLoading(true);

      const response = await tournamentService.getPrizeDistribution(id);

      setTournament(response?.tournament || null);
      setPrizes(response?.prizes || []);
      setRegistrations(response?.registrations || []);
      setDistributions(response?.distributions || []);
    } catch (error) {
      console.error("Failed to load prize distribution:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load prize distribution",
      );
    } finally {
      setLoading(false);
    }
  };

  const getPositionLabel = (position) => {
    if (position === 1) return "1st";
    if (position === 2) return "2nd";
    if (position === 3) return "3rd";

    return `${position}th`;
  };

  const getRegistrationName = (registration) => {
    if (!registration) return "Unknown";

    if (registration.teamName) {
      return registration.teamName;
    }

    return registration.user?.name || "Player";
  };

  const getCaptainName = (registration) => {
    return registration?.user?.name || "N/A";
  };

  const isPositionAssigned = (position) => {
    return distributions.some(
      (distribution) => Number(distribution.position) === Number(position),
    );
  };

  const isRegistrationAssigned = (registrationId) => {
    return distributions.some(
      (distribution) => distribution.registration?._id === registrationId,
    );
  };

  const handleConfirmWinner = async () => {
    if (!selectedRegistration) {
      toast.error("Please select a player or team");
      return;
    }

    if (!selectedPosition) {
      toast.error("Please select a prize position");
      return;
    }

    try {
      setConfirming(true);

      const response = await tournamentService.confirmPrizeWinner(id, {
        registrationId: selectedRegistration,
        position: Number(selectedPosition),
      });

      toast.success(
        response?.message || "Prize position confirmed successfully",
      );

      setSelectedRegistration("");
      setSelectedPosition("");

      await fetchPrizeDistribution();
    } catch (error) {
      console.error("Failed to confirm prize winner:", error);

      toast.error(
        error?.response?.data?.message || "Failed to confirm prize winner",
      );
    } finally {
      setConfirming(false);
    }
  };

  const handleRemoveWinner = async (distributionId) => {
    try {
      setRemoving(distributionId);

      const response = await tournamentService.removePrizeWinner(
        id,
        distributionId,
      );

      toast.success(response?.message || "Prize winner removed successfully");

      await fetchPrizeDistribution();
    } catch (error) {
      console.error("Failed to remove prize winner:", error);

      toast.error(
        error?.response?.data?.message || "Failed to remove prize winner",
      );
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 theme-subtext text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading prize distribution...
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="w-full">
        <div className="theme-card border theme-border rounded-2xl p-8 text-center">
          <Trophy className="w-10 h-10 text-indigo-500 mx-auto mb-3" />

          <h2 className="theme-text font-bold">Tournament not found</h2>

          <button
            onClick={() => navigate("/organizer/tournaments")}
            className="mt-5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/organizer/tournaments/${id}`)}
          className="w-9 h-9 rounded-xl border theme-border theme-icon-box flex items-center justify-center theme-hover transition"
        >
          <ArrowLeft className="w-4 h-4 theme-text" />
        </button>

        <div>
          <h1 className="text-xl md:text-2xl font-bold theme-text">
            Prize Distribution
          </h1>

          <p className="text-xs theme-subtext mt-1">{tournament.title}</p>
        </div>
      </div>

      <div className="theme-card border theme-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">
              Completed Tournament
            </p>

            <h2 className="text-lg font-bold theme-text mt-1">
              {tournament.title}
            </h2>

            <p className="text-xs theme-subtext mt-1">
              Select the registered player or team for each prize position.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase">
            Completed
          </div>
        </div>
      </div>

      <div className="theme-card border theme-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-indigo-500" />
          </div>

          <div>
            <h2 className="text-sm font-bold theme-text">
              Confirm Prize Winner
            </h2>

            <p className="text-[11px] theme-subtext mt-1">
              Assign a registered participant to a prize position.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold theme-text mb-2">
              Prize Position
            </label>

            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="theme-input w-full rounded-xl px-3 py-3 text-xs outline-none"
            >
              <option value="">Select position</option>

              {prizes.map((prize) => (
                <option
                  key={prize.position}
                  value={prize.position}
                  disabled={isPositionAssigned(prize.position)}
                >
                  {getPositionLabel(prize.position)} Place - ₹
                  {Number(prize.amount).toLocaleString("en-IN")}
                  {isPositionAssigned(prize.position) ? " - Confirmed" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold theme-text mb-2">
              Player / Team
            </label>

            <select
              value={selectedRegistration}
              onChange={(e) => setSelectedRegistration(e.target.value)}
              className="theme-input w-full rounded-xl px-3 py-3 text-xs outline-none"
            >
              <option value="">Select player or team</option>

              {registrations.map((registration) => {
                const assigned = isRegistrationAssigned(registration._id);

                return (
                  <option
                    key={registration._id}
                    value={registration._id}
                    disabled={assigned}
                  >
                    {getRegistrationName(registration)}
                    {" - Captain: "}
                    {getCaptainName(registration)}
                    {assigned ? " - Already Assigned" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <button
          onClick={handleConfirmWinner}
          disabled={confirming}
          className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition"
        >
          {confirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Confirm Winner
            </>
          )}
        </button>
      </div>

      <div className="theme-card border theme-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b theme-border">
          <h2 className="text-sm font-bold theme-text">
            Confirmed Prize Winners
          </h2>

          <p className="text-[11px] theme-subtext mt-1">
            Official prize positions confirmed for this tournament.
          </p>
        </div>

        {distributions.length === 0 ? (
          <div className="p-10 text-center">
            <Trophy className="w-8 h-8 theme-subtext mx-auto mb-3" />

            <p className="text-xs theme-subtext">
              No prize winners have been confirmed yet.
            </p>
          </div>
        ) : (
          <div className="divide-y theme-border">
            {distributions.map((distribution) => {
              const registration = distribution.registration;

              return (
                <div
                  key={distribution._id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-indigo-500">
                          {getPositionLabel(distribution.position)}
                        </span>

                        <span className="text-xs font-bold theme-text">
                          {getRegistrationName(registration)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-[10px] theme-subtext flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {distribution.captain?.name || "N/A"}
                        </span>

                        <span className="text-[10px] theme-subtext flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {registration?.players?.length || 1} Players
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-[10px] theme-subtext">Prize Amount</p>

                      <p className="text-sm font-bold text-emerald-500">
                        ₹
                        {Number(distribution.prizeAmount).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveWinner(distribution._id)}
                      disabled={removing === distribution._id}
                      className="w-9 h-9 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 disabled:opacity-50 transition"
                      title="Remove winner"
                    >
                      {removing === distribution._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

