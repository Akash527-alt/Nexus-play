import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentService } from '../../services/tournamentService';
import { Plus, Calendar, Trophy, Users, Trash2 } from 'lucide-react';

export function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tournamentService.getAll().then((data) => {
      setTournaments(data || []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      await tournamentService.delete(id);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Loading tournaments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Tournaments</h1>
          <p className="text-xs text-slate-500 mt-1">View, track and create new esports events.</p>
        </div>
        <button
          onClick={() => navigate('/organizer/tournaments/create')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
            <div className="h-40 bg-slate-100 relative">
              <img
                src={item.bannerUrl}
                alt={item.title || item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://picsum.photos/600/300?gaming';
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                {item.status || 'Upcoming'}
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {item.game}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{item.title || item.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>₹{(item.totalPrizePool || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>{item.currentParticipants || 0}/{item.maxParticipants || item.maxTeams || 0} Slots</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.startDate ? String(item.startDate).split('T')[0] : 'TBA'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">
                  {item.entryFee ? `₹${item.entryFee}` : 'Free'}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}