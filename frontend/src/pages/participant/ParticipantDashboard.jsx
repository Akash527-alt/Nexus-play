import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Users,
  Wallet,
  ArrowRight,
  CalendarDays,
  Gamepad2,
  UserCheck,
} from "lucide-react";

import { participantService } from "../../services/participantService";
import { useAuth } from "../../context/AuthContext";

export const ParticipantDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);

  // ---------------------------------------------------------
  // Fetch user's registrations
  // ---------------------------------------------------------
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const response =
        await participantService.getMyRegistrations();

      const data =
        response?.registrations ||
        [];

      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to fetch participant registrations:",
        error
      );

      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------

  const getTournament = (registration) => {
    if (!registration?.tournament) {
      return null;
    }

    // If tournament is populated
    if (typeof registration.tournament === "object") {
      return registration.tournament;
    }

    return null;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTournamentId = (registration) => {
    if (!registration?.tournament) {
      return null;
    }

    if (typeof registration.tournament === "object") {
      return (
        registration.tournament._id ||
        registration.tournament.id
      );
    }

    return registration.tournament;
  };

  // ---------------------------------------------------------
  // Dashboard statistics
  // ---------------------------------------------------------

  const tournamentsJoined = registrations.length;

  const activeRegistrations = registrations.filter(
    (registration) => {
      const status =
        registration?.status?.toLowerCase();

      return (
        status !== "cancelled" &&
        status !== "rejected"
      );
    }
  ).length;

  // Earnings will remain 0 until tournament
  // results / prize distribution are implemented.
  const totalEarnings = 0;

  // Show only a few registrations on dashboard.
  const recentRegistrations = registrations.slice(0, 3);

  return (
    <div className="w-full space-y-6">

      {/* =====================================================
          WELCOME
      ====================================================== */}
      <div className="theme-card border theme-border rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-500">
              Participant Dashboard
            </p>

            <h1 className="text-2xl md:text-3xl font-black theme-text mt-1">
              Welcome back,{" "}
              <span className="text-indigo-500">
                {user?.fullName ||
                  user?.name ||
                  "Player"}
              </span>
            </h1>

            <p className="text-xs md:text-sm theme-subtext mt-2">
              Manage your tournament registrations and
              explore upcoming competitions.
            </p>
          </div>

          <Link
            to="/participant/tournaments"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md whitespace-nowrap"
          >
            Explore Tournaments
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Tournaments Joined */}
        <div className="theme-card border theme-border rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold theme-subtext">
                Tournaments Joined
              </p>

              <p className="text-2xl font-black theme-text mt-2">
                {loading ? "..." : tournamentsJoined}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl theme-icon-box border theme-border flex items-center justify-center">
              <Trophy className="w-5 h-5 text-indigo-500" />
            </div>

          </div>

          <p className="text-[11px] theme-subtext mt-3">
            Total tournament registrations
          </p>
        </div>

        {/* Active Registrations */}
        <div className="theme-card border theme-border rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold theme-subtext">
                Active Registrations
              </p>

              <p className="text-2xl font-black theme-text mt-2">
                {loading ? "..." : activeRegistrations}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl theme-icon-box border theme-border flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-500" />
            </div>

          </div>

          <p className="text-[11px] theme-subtext mt-3">
            Current active tournament entries
          </p>
        </div>

        {/* Earnings */}
        <div className="theme-card border theme-border rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold theme-subtext">
                Total Earnings
              </p>

              <p className="text-2xl font-black theme-text mt-2">
                ₹{totalEarnings.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl theme-icon-box border theme-border flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>

          </div>

          <p className="text-[11px] theme-subtext mt-3">
            Prize earnings from completed tournaments
          </p>
        </div>

      </div>

      {/* =====================================================
          REGISTERED TOURNAMENTS
      ====================================================== */}
      <div className="theme-card border theme-border rounded-2xl p-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b theme-border pb-4">

          <div>
            <h2 className="text-base font-bold theme-text">
              My Registered Tournaments
            </h2>

            <p className="text-xs theme-subtext mt-1">
              Tournaments you have registered for.
            </p>
          </div>

          <Link
            to="/participant/tournaments"
            className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-12 text-center text-xs theme-subtext">
            Loading your registrations...
          </div>
        ) : recentRegistrations.length === 0 ? (

          /* Empty State */
          <div className="py-12 text-center">

            <div className="w-12 h-12 rounded-xl theme-icon-box border theme-border flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 theme-subtext" />
            </div>

            <h3 className="text-sm font-bold theme-text">
              No Tournament Registrations
            </h3>

            <p className="text-xs theme-subtext mt-1 max-w-sm mx-auto">
              You haven't registered for any tournament
              yet. Explore available tournaments and join
              one to get started.
            </p>

            <Link
              to="/participant/tournaments"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
            >
              Explore Tournaments
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

        ) : (

          /* Registration List */
          <div className="space-y-3 mt-4">

            {recentRegistrations.map(
              (registration, index) => {

                const tournament =
                  getTournament(registration);

                const tournamentId =
                  getTournamentId(registration);

                const tournamentTitle =
                  tournament?.title ||
                  registration?.tournamentTitle ||
                  "Tournament";

                const game =
                  tournament?.game ||
                  registration?.game ||
                  "Esports";

                const tournamentType =
                  tournament?.tournamentType ||
                  registration?.registrationType ||
                  "solo";

                const teamName =
                  registration?.teamName;

                return (
                  <div
                    key={
                      registration?._id ||
                      registration?.id ||
                      index
                    }
                    className="theme-icon-box border theme-border rounded-xl p-4"
                  >

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      {/* Tournament Info */}
                      <div className="min-w-0">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                            {game}
                          </span>

                          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md theme-icon-box border theme-border theme-subtext">
                            {tournamentType}
                          </span>

                        </div>

                        <h3 className="text-sm font-bold theme-text mt-2 truncate">
                          {tournamentTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">

                          {teamName && (
                            <p className="text-[11px] theme-subtext flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-indigo-500" />
                              {teamName}
                            </p>
                          )}

                          <p className="text-[11px] theme-subtext flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
                            Registered{" "}
                            {formatDate(
                              registration?.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      {/* Status + Action */}
                      <div className="flex items-center gap-3 shrink-0">

                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Registered
                        </span>

                        {tournamentId && (
                          <Link
                            to={`/participant/tournaments/${tournamentId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border theme-border theme-text text-[11px] font-bold theme-hover transition"
                          >
                            View
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Link
          to="/participant/tournaments"
          className="theme-card border theme-border rounded-2xl p-5 theme-hover transition group"
        >
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-indigo-500" />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold theme-text">
                Explore Tournaments
              </h3>

              <p className="text-[11px] theme-subtext mt-1">
                Find tournaments and register your team.
              </p>
            </div>

            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />

          </div>
        </Link>

        <Link
          to="/participant/profile"
          className="theme-card border theme-border rounded-2xl p-5 theme-hover transition group"
        >
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold theme-text">
                Manage Profile
              </h3>

              <p className="text-[11px] theme-subtext mt-1">
                Update your player information.
              </p>
            </div>

            <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />

          </div>
        </Link>

      </div>

    </div>
  );
};