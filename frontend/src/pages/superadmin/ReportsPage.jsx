import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Users,
  Trophy,
  DollarSign,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/adminService";

export function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await adminService.getReports();
        setReports(data);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `nexusplay_executive_report_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Executive report exported in JSON format");
  };

  if (loading) {
    return <div className="p-12 text-center text-xs theme-subtext">Generating analytics report...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">Platform Reports & Strategic Analytics</h1>
          <p className="text-xs md:text-sm theme-subtext">
            Comprehensive breakdown of user growth trajectory, game category distribution, and revenue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold theme-card border theme-border theme-hover rounded-xl cursor-pointer transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Revenue Growth & Commission */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Monthly Gross Volume (Run Rate)
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-2">$56,400</p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +15.3% MoM growth
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Platform Commission Earned (5%)
          </p>
          <p className="text-2xl font-black text-indigo-400 mt-2">
            ${reports?.totalCommissionEarned?.toLocaleString() || "2,820"}
          </p>
          <p className="text-[11px] theme-subtext mt-1">Net platform revenue</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Total Player Registrations
          </p>
          <p className="text-2xl font-black theme-text mt-2">3,820</p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 8.4x increase since May
          </p>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Distribution */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold theme-text">Tournament Category Share</h2>
              <p className="text-xs theme-subtext">Distribution of tournaments hosted by title</p>
            </div>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-3 pt-2">
            {reports?.gameBreakdown?.map((g) => (
              <div key={g.game} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="theme-text">{g.game}</span>
                  <span className="theme-subtext">
                    {g.count} tournaments ({g.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500"
                    style={{ width: `${g.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Trajectory */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold theme-text">Active User Expansion</h2>
              <p className="text-xs theme-subtext">Cumulative registered players by month</p>
            </div>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="grid grid-cols-5 gap-2 pt-6 items-end h-48">
            {reports?.userGrowth?.map((m) => {
              const maxUsers = 4000;
              const heightPercent = Math.round((m.users / maxUsers) * 100);
              return (
                <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold theme-subtext">{m.users}</span>
                  <div
                    className="w-full bg-indigo-600 rounded-t-lg transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-bold theme-text mt-1">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
