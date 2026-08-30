import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { participantService } from "../../services/participantService";
import { useAuth } from "../../context/AuthContext";

export const ParticipantDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentStats, setRecentStats] = useState([
    { label: "Tournaments Joined", value: "0", icon: "🏆" },
    { label: "Matches Won", value: "0", icon: "⚔️" },
    { label: "Total Earnings", value: "₹0", icon: "💰" },
    { label: "XP Rank", value: "#--", icon: "⚡" },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await participantService.getDashboardStats();
      
      if (data?.stats) {
        setRecentStats([
          { label: "Tournaments Joined", value: data.stats.joined ?? "0", icon: "🏆" },
          { label: "Matches Won", value: data.stats.won ?? "0", icon: "⚔️" },
          { label: "Total Earnings", value: `₹${(data.stats.earnings ?? 0).toLocaleString("en-IN")}`, icon: "💰" },
          { label: "XP Rank", value: data.stats.rank ? `#${data.stats.rank}` : "#--", icon: "⚡" },
        ]);
      }

      setUpcomingMatches(data?.upcomingMatches || []);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Welcome Banner */}
      <div className="theme-card border theme-border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm w-full">
        <div>
          <h1 className="text-2xl font-black theme-text tracking-wide">
            Welcome Back, <span className="text-indigo-500">{user?.fullName || user?.name || "Player"}</span> 🎮
          </h1>
          <p className="text-xs theme-subtext mt-1">
            Ready for your next tournament? Check your active matches and registered slots below.
          </p>
        </div>
        <Link
          to="/participant/tournaments"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md whitespace-nowrap"
        >
          Explore Tournaments ➔
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {recentStats.map((stat, idx) => (
          <div key={idx} className="theme-card border theme-border p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[11px] theme-subtext font-semibold">{stat.label}</p>
              <p className="text-xl font-black theme-text mt-1">{stat.value}</p>
            </div>
            <div className="h-10 w-10 theme-icon-box border theme-border rounded-xl flex items-center justify-center text-lg">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Upcoming Schedule */}
        <div className="lg:col-span-2 theme-card border theme-border p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b theme-border pb-3">
            <h2 className="text-sm font-bold theme-text">Upcoming Scheduled Matches</h2>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-md">Live Sync</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs theme-subtext">Loading scheduled matches...</div>
          ) : upcomingMatches.length === 0 ? (
            <div className="p-8 text-center text-xs theme-subtext">
              No upcoming scheduled matches found. Register for a tournament to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.map((m) => (
                <div key={m._id || m.id} className="theme-icon-box border theme-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                        {m.game || "Esports"}
                      </span>
                      <h3 className="text-xs font-bold theme-text">{m.tournamentTitle || m.tournament}</h3>
                    </div>
                    <p className="text-[11px] theme-subtext">vs <span className="theme-text font-semibold">{m.opponent || "TBD"}</span></p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-amber-500">{m.time || "TBA"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arena Rules */}
        <div className="theme-card border theme-border p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold theme-text border-b theme-border pb-3">Arena Rules & Guidelines</h2>
            <ul className="text-xs theme-subtext space-y-3 mt-4">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Connect your GPay UPI ID in settings for instant prize payouts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Check in 15 minutes before match start time on Discord/Lobby.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Screenshot match results for disputed win submissions.</span>
              </li>
            </ul>
          </div>
          <Link
            to="/participant/settings"
            className="w-full text-center py-2.5 theme-icon-box border theme-border theme-text text-xs font-bold rounded-xl theme-hover transition block"
          >
            Update UPI Settings
          </Link>
        </div>
      </div>
    </div>
  );
};