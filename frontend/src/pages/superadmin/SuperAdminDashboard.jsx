import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  Trophy,
  Handshake,
  DollarSign,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  Sparkles,
} from "lucide-react";
import { adminService } from "../../services/adminService";

export function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs theme-subtext">Loading admin telemetry...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900/60 via-indigo-950/70 to-slate-900/80 border theme-border p-6 md:p-8 backdrop-blur-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Authority Core
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight theme-text">
            NexusPlay Esports Infrastructure Control
          </h1>
          <p className="text-xs md:text-sm theme-subtext mt-2 leading-relaxed">
            Monitor platform health, audit player/organizer KYC, oversee tournament integrity, and regulate commercial sponsorship disbursements across the entire ecosystem.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => navigate("/superadmin/tournaments")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              <span>Moderate Tournaments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/superadmin/organizers")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl theme-card theme-border border theme-text hover:bg-rose-500/10 font-bold text-xs transition cursor-pointer"
            >
              <span>Review Pending KYC ({stats?.pendingApprovals || 0})</span>
            </button>
          </div>
        </div>

        {/* Background Ambience */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">Total Users</p>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black theme-text mt-2">{stats?.totalUsers || 0}</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Players & Managers</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">Organizers</p>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black theme-text mt-2">{stats?.totalOrganizers || 0}</p>
          <p className="text-[10px] text-purple-400 font-semibold mt-0.5">Verified Hosts</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">Tournaments</p>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black theme-text mt-2">{stats?.totalTournaments || 0}</p>
          <p className="text-[10px] text-amber-400 font-semibold mt-0.5">
            {stats?.activeTournaments || 0} active now
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">Sponsors</p>
            <Handshake className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black theme-text mt-2">{stats?.totalSponsors || 0}</p>
          <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">Commercial Brands</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">Gross Volume</p>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            ${stats?.totalVolume?.toLocaleString() || 0}
          </p>
          <p className="text-[10px] theme-subtext mt-0.5">Total Escrow Volume</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">Uptime</p>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{stats?.serverUptime || "99.98%"}</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Cluster Healthy</p>
        </div>
      </div>

      {/* Moderation Queue & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Actions Box */}
        <div className="lg:col-span-2 theme-card border theme-border rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold theme-text">Pending Moderation Queue</h2>
              <p className="text-xs theme-subtext">
                Items requiring Super Admin verification or compliance approval
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              {stats?.pendingApprovals || 3} Urgent
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border theme-border theme-hover flex items-center justify-between gap-3 text-xs transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold theme-text">Vanguard Collegiate League</p>
                  <p className="text-[11px] theme-subtext">Organizer verification documents uploaded</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/superadmin/organizers")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer"
              >
                Audit KYC
              </button>
            </div>

            <div className="p-3.5 rounded-xl border theme-border theme-hover flex items-center justify-between gap-3 text-xs transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold theme-text">Overwatch 2 Campus Clash Weekend</p>
                  <p className="text-[11px] theme-subtext">New tournament pending platform approval</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/superadmin/tournaments")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer"
              >
                Review Event
              </button>
            </div>

            <div className="p-3.5 rounded-xl border theme-border theme-hover flex items-center justify-between gap-3 text-xs transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold theme-text">Account Flagged: Vikram Malhotra</p>
                  <p className="text-[11px] theme-subtext">Multiple match disqualification reports</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/superadmin/users")}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] cursor-pointer"
              >
                Inspect User
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Platform Activity Stream */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold theme-text">Live Platform Telemetry</h2>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3.5">
            {stats?.recentActivities?.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold theme-text leading-tight">{act.action}</p>
                  <p className="text-[11px] theme-subtext mt-0.5">
                    Target: <span className="font-semibold">{act.user}</span>
                  </p>
                  <span className="text-[10px] theme-subtext opacity-75">{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t theme-border">
            <button
              onClick={() => navigate("/superadmin/reports")}
              className="w-full py-2 rounded-xl border theme-border theme-hover text-xs font-semibold theme-text transition cursor-pointer"
            >
              Export System Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
