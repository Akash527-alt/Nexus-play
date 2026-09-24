import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  Trophy,
  Handshake,
  ShieldCheck,
  ArrowRight,
  Clock,
  UserPlus,
  CalendarPlus,
  FileCheck,
} from "lucide-react";
import { adminService } from "../../services/adminService";

export function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentData, setRecentData] = useState({
    users: [],
    organizers: [],
    sponsors: [],
    tournaments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const response = await adminService.getDashboardStats();

        setStats(response.stats);

        setRecentData({
          users: response.recentUsers || [],
          organizers: response.recentOrganizers || [],
          sponsors: response.recentSponsors || [],
          tournaments: response.recentTournaments || [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs theme-subtext">
        Loading administration dashboard...
      </div>
    );
  }

  const recentActivities = [
    ...recentData.organizers.map((item) => ({
      id: `organizer-${item._id}`,
      title: "Organizer activity",
      description: item.organizationName,
      status: item.verificationStatus,
      date: item.createdAt,
      icon: Building2,
    })),
    ...recentData.sponsors.map((item) => ({
      id: `sponsor-${item._id}`,
      title: "Sponsor activity",
      description: item.companyName,
      status: item.status,
      date: item.createdAt,
      icon: Handshake,
    })),
    ...recentData.tournaments.map((item) => ({
      id: `tournament-${item._id}`,
      title: "Tournament activity",
      description: item.title,
      status: item.status,
      date: item.createdAt,
      icon: Trophy,
    })),
    ...recentData.users.map((item) => ({
      id: `user-${item._id}`,
      title: "User registered",
      description: item.name,
      status: item.role,
      date: item.createdAt,
      icon: UserPlus,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900/60 via-indigo-950/70 to-slate-900/80 border theme-border p-6 md:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Admin
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight theme-text">
            NexusPlay Administration
          </h1>

          <p className="text-xs md:text-sm theme-subtext mt-2 leading-relaxed">
            Manage platform users, review organizer and sponsor verification,
            monitor tournaments, and oversee NexusPlay governance.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => navigate("/superadmin/organizers")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
            >
              <span>Review Organizers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/superadmin/sponsors")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl theme-card border theme-border theme-text hover:bg-rose-500/10 font-bold text-xs transition cursor-pointer"
            >
              <span>Review Sponsors</span>
            </button>

            <button
              onClick={() => navigate("/superadmin/tournaments")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl theme-card border theme-border theme-text hover:bg-rose-500/10 font-bold text-xs transition cursor-pointer"
            >
              <span>View Tournaments</span>
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">
              Total Users
            </p>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-2">
            {stats?.totalUsers || 0}
          </p>

          <p className="text-[10px] theme-subtext mt-1">
            Registered platform users
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">
              Organizers
            </p>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-2">
            {stats?.totalOrganizers || 0}
          </p>

          <p className="text-[10px] text-purple-400 font-semibold mt-1">
            {stats?.pendingOrganizers || 0} pending verification
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">
              Sponsors
            </p>
            <Handshake className="w-4 h-4 text-cyan-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-2">
            {stats?.totalSponsors || 0}
          </p>

          <p className="text-[10px] text-cyan-400 font-semibold mt-1">
            {stats?.pendingSponsors || 0} pending verification
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">
              Tournaments
            </p>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-2">
            {stats?.totalTournaments || 0}
          </p>

          <p className="text-[10px] text-amber-400 font-semibold mt-1">
            {stats?.activeTournaments || 0} ongoing
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">
              Pending Actions
            </p>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>

          <p className="text-2xl font-black theme-text mt-2">
            {stats?.pendingApprovals || 0}
          </p>

          <p className="text-[10px] text-rose-400 font-semibold mt-1">
            Require review
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 theme-card border theme-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold theme-text">
                Pending Actions
              </h2>
              <p className="text-xs theme-subtext mt-1">
                Items requiring Superadmin attention
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border theme-border theme-icon-box">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                  <Building2 className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-sm font-bold theme-text">
                    Organizer Verification
                  </p>
                  <p className="text-[11px] theme-subtext">
                    {stats?.pendingOrganizers || 0} organizer
                    {stats?.pendingOrganizers === 1 ? "" : "s"} waiting for
                    review
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/superadmin/organizers")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer"
              >
                Review
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border theme-border theme-icon-box">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400">
                  <Handshake className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-sm font-bold theme-text">
                    Sponsor Verification
                  </p>
                  <p className="text-[11px] theme-subtext">
                    {stats?.pendingSponsors || 0} sponsor
                    {stats?.pendingSponsors === 1 ? "" : "s"} waiting for review
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/superadmin/sponsors")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer"
              >
                Review
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border theme-border theme-icon-box">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                  <Trophy className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-sm font-bold theme-text">
                    Tournament Review
                  </p>
                  <p className="text-[11px] theme-subtext">
                    {stats?.pendingTournaments || 0} tournament
                    {stats?.pendingTournaments === 1 ? "" : "s"} currently in
                    draft
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/superadmin/tournaments")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer"
              >
                Review
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold theme-text">
                Recent Activity
              </h2>
              <p className="text-xs theme-subtext mt-1">
                Latest platform records
              </p>
            </div>

            <Clock className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-xs theme-subtext text-center py-8">
                No recent activity found.
              </p>
            ) : (
              recentActivities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg theme-icon-box border theme-border shrink-0">
                      <Icon className="w-3.5 h-3.5 text-indigo-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold theme-text">
                        {activity.title}
                      </p>

                      <p className="text-[11px] theme-subtext truncate">
                        {activity.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] theme-subtext">
                          {activity.status}
                        </span>

                        <span className="text-[10px] theme-subtext">
                          {formatDate(activity.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="theme-card border theme-border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold theme-text">
              Platform Overview
            </h2>

            <p className="text-xs theme-subtext mt-1">
              Current distribution of NexusPlay platform activity
            </p>
          </div>

          <FileCheck className="w-5 h-5 text-rose-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl border theme-border theme-icon-box">
            <p className="text-[11px] uppercase font-bold tracking-wider theme-subtext">
              Verified Organizers
            </p>

            <p className="text-xl font-black theme-text mt-2">
              {stats?.verifiedOrganizers || 0}
            </p>
          </div>

          <div className="p-4 rounded-xl border theme-border theme-icon-box">
            <p className="text-[11px] uppercase font-bold tracking-wider theme-subtext">
              Verified Sponsors
            </p>

            <p className="text-xl font-black theme-text mt-2">
              {stats?.verifiedSponsors || 0}
            </p>
          </div>

          <div className="p-4 rounded-xl border theme-border theme-icon-box">
            <p className="text-[11px] uppercase font-bold tracking-wider theme-subtext">
              Completed Tournaments
            </p>

            <p className="text-xl font-black theme-text mt-2">
              {stats?.completedTournaments || 0}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SuperAdminDashboard;
