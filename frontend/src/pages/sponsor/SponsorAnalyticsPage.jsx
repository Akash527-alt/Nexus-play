import React from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  CheckCircle2,
  DollarSign,
  Users,
  Award,
  ArrowUpRight,
} from "lucide-react";

export function SponsorAnalyticsPage() {
  const channelBreakdown = [
    { channel: "Twitch Broadcasts", views: "142,000", share: 58, color: "bg-purple-500" },
    { channel: "YouTube Gaming Live", views: "74,500", share: 30, color: "bg-red-500" },
    { channel: "Social Media & Reels", views: "22,100", share: 9, color: "bg-indigo-500" },
    { channel: "In-Venue & Physical", views: "8,400", share: 3, color: "bg-amber-500" },
  ];

  const gameBreakdown = [
    { game: "Valorant", impressions: "115K", cpm: "$3.80", engagement: "8.4%" },
    { game: "BGMI Mobile", impressions: "92K", cpm: "$2.90", engagement: "9.2%" },
    { game: "Counter-Strike 2", impressions: "41K", cpm: "$4.10", engagement: "7.1%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">Sponsorship ROI & Audience Analytics</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Quantify your brand exposure, live broadcast metrics, and deliverable verification scores.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Total Impressions
            </p>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">248,000</p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% over last quarter
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">Effective CPM</p>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">$3.42</p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1">
            68% lower than standard ads
          </p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Deliverable Success
            </p>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">98.2%</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">Verified on escrow</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
              Brand Recall Rate
            </p>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black theme-text mt-3">76.4%</p>
          <p className="text-[11px] text-purple-400 font-semibold mt-1">Post-event survey score</p>
        </div>
      </div>

      {/* Broadcast Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channels */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-5 shadow-xs">
          <div>
            <h2 className="text-base font-bold theme-text">Audience Reach By Channel</h2>
            <p className="text-xs theme-subtext">
              Breakdown of impressions captured across live streaming and digital touchpoints
            </p>
          </div>

          <div className="space-y-4">
            {channelBreakdown.map((c) => (
              <div key={c.channel} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="theme-text">{c.channel}</span>
                  <span className="theme-subtext">
                    {c.views} views ({c.share}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game ROI Performance */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-5 shadow-xs">
          <div>
            <h2 className="text-base font-bold theme-text">Game Title Performance</h2>
            <p className="text-xs theme-subtext">
              Efficiency comparison per tournament category
            </p>
          </div>

          <div className="space-y-3">
            {gameBreakdown.map((g) => (
              <div
                key={g.game}
                className="p-3.5 rounded-xl border theme-border theme-icon-box flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold theme-text">{g.game}</p>
                  <p className="text-[11px] theme-subtext mt-0.5">
                    Impressions: <span className="font-semibold theme-text">{g.impressions}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-indigo-400">CPM {g.cpm}</p>
                  <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">
                    {g.engagement} CTR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SponsorAnalyticsPage;
