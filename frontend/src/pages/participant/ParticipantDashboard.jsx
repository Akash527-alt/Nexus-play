import React from "react";
import { Link } from "react-router-dom";

export const ParticipantDashboard = () => {
  const upcomingMatches = [
    { id: 1, game: "Valorant", tournament: "Inter-College Showdown", time: "Today, 7:00 PM", opponent: "Team Alpha" },
    { id: 2, game: "BGMI", tournament: "Campus Cup 2026", time: "Tomorrow, 4:00 PM", opponent: "Squad X" },
  ];

  const recentStats = [
    { label: "Tournaments Joined", value: "12", icon: "🏆" },
    { label: "Matches Won", value: "28", icon: "⚔️" },
    { label: "Total Earnings", value: "₹4,500", icon: "💰" },
    { label: "XP Rank", value: "#14", icon: "⚡" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Welcome Banner */}
      <div className="theme-card border theme-border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm w-full">
        <div>
          <h1 className="text-2xl font-black theme-text tracking-wide">
            Welcome Back, <span className="text-indigo-500">Alex</span> 🎮
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

      {/* Stats Cards Row (Stretches Full Width) */}
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

      {/* Two Column Layout (Full Width Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Upcoming Schedule (2 Cols) */}
        <div className="lg:col-span-2 theme-card border theme-border p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b theme-border pb-3">
            <h2 className="text-sm font-bold theme-text">Upcoming Scheduled Matches</h2>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-md">Live Sync</span>
          </div>

          <div className="space-y-3">
            {upcomingMatches.map((m) => (
              <div key={m.id} className="theme-icon-box border theme-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                      {m.game}
                    </span>
                    <h3 className="text-xs font-bold theme-text">{m.tournament}</h3>
                  </div>
                  <p className="text-[11px] theme-subtext">vs <span className="theme-text font-semibold">{m.opponent}</span></p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-amber-500">{m.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Notice Card (1 Col) */}
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