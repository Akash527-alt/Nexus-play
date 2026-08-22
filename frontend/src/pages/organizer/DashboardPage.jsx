import React, { useEffect, useState } from 'react';
import { tournamentService } from '../../services/tournamentService';
import { Badge } from '../../components/ui/Badge';
import { Trophy, Users, IndianRupee, Calendar } from 'lucide-react';

export function DashboardPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API ya mock service se live data fetch ho raha hai
    tournamentService.getAll().then((data) => {
      setTournaments(data || []);
      setLoading(false);
    });
  }, []);

  // Dynamic calculations direct tournaments state array se
  const totalTournaments = tournaments.length;

  const totalTeams = tournaments.reduce((acc, curr) => {
    const teamsCount = Number(curr.registeredTeams) || 0;
    return acc + teamsCount;
  }, 0);

  const totalPrize = tournaments.reduce((acc, curr) => {
    const prize = Number(curr.totalPrizePool) || 0;
    return acc + prize;
  }, 0);

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Dashboard loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organizer Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Overview of your active gaming events.
        </p>
      </div>

      {/* Dynamic Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Active Tournaments</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{totalTournaments}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Teams Registered</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{totalTeams}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Prize Pools</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              ₹{totalPrize ? totalPrize.toLocaleString('en-IN') : 0}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Dynamic Recent Tournaments List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">Recent Tournaments</h2>
          <span className="text-xs text-slate-400 font-medium">Total: {totalTournaments}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {tournaments.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No tournaments found.</p>
          ) : (
            tournaments.map((item) => (
              <div key={item.id || item._id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img 
                      src={item.bannerUrl || 'https://via.placeholder.com/150'} 
                      alt={item.name || 'Tournament Banner'} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.name || 'Unnamed Event'}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{item.game || 'N/A'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.startDate || 'TBA'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-700">
                      {item.registeredTeams || 0}/{item.maxTeams || 0} Teams
                    </p>
                    <p className="text-[10px] text-slate-400">
                      ₹{item.totalPrizePool ? Number(item.totalPrizePool).toLocaleString('en-IN') : 0} Pool
                    </p>
                  </div>
                  <Badge status={item.status || 'Upcoming'} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}