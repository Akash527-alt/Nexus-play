import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tournamentService } from "../../services/tournamentService";
import { Trophy, Users, IndianRupee, Calendar, Plus, ChevronRight } from "lucide-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await tournamentService.getAll();
      setTournaments(data || []);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPrize = tournaments.reduce((acc, t) => acc + (t.totalPrizePool || 0), 0);
  const totalParticipants = tournaments.reduce((acc, t) => acc + (t.currentParticipants || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizer Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your tournaments and platform metrics.</p>
        </div>
        <button
          onClick={() => navigate('/organizer/tournaments/create')}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tournaments</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{tournaments.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Players</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalParticipants}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prize Pool Managed</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalPrize.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Events</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {tournaments.filter(t => t.status === 'ongoing' || t.status === 'upcoming').length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Tournaments List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Recent Tournaments</h2>
          <button 
            onClick={() => navigate('/organizer/tournaments')} 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500 py-4">Loading tournaments...</p>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No tournaments created yet.</p>
            <button
              onClick={() => navigate('/organizer/tournaments/create')}
              className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              + Create your first tournament
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tournaments.slice(0, 5).map((t) => (
              <div 
                key={t.id} 
                onClick={() => navigate(`/organizer/tournaments/${t.id}`)}
                className="py-3.5 px-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.game} • {t.format} • Prize: ₹{(t.totalPrizePool || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                    {t.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}