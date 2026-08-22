import React from 'react';
import { Trophy, Users, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Tournaments', value: '1', icon: Trophy, color: 'text-indigo-500' },
    { title: 'Total Players', value: '8', icon: Users, color: 'text-emerald-500' },
    { title: 'Prize Pool Managed', value: '₹75,000', icon: DollarSign, color: 'text-amber-500' },
    { title: 'Active Events', value: '1', icon: Calendar, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">Organizer Dashboard</h1>
        <p className="text-sm theme-subtext">Welcome back! Here is an overview of your active esports events.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="theme-card p-5 rounded-2xl border shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase theme-subtext">{stat.title}</p>
                <h3 className="text-2xl font-bold theme-text mt-1">{stat.value}</h3>
              </div>
              <div className="theme-icon-box p-3 rounded-xl border">
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="theme-card rounded-2xl border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-base font-bold theme-text">Recent Tournaments</h2>
          <button 
            onClick={() => navigate('/organizer/tournaments')}
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <div 
            onClick={() => navigate('/organizer/tournaments/1')}
            className="theme-hover py-3 px-3 flex items-center justify-between rounded-xl transition-colors cursor-pointer"
          >
            <div>
              <h3 className="text-sm font-bold theme-text">Nexus Invitational Season 1</h3>
              <p className="text-xs theme-subtext">Valorant • Single Elimination • Prize: ₹75,000</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Upcoming
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}