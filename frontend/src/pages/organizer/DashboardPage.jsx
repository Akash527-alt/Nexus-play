import React, { useEffect, useState } from 'react';
import { tournamentService } from '../../services/tournamentService';
import { CreateTournamentModal } from '../../components/organizer/CreateTournamentModal';
import { Trophy, Users, IndianRupee, Calendar, Plus } from 'lucide-react';

export function DashboardPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    tournamentService.getAll().then((data) => {
      setTournaments(data || []);
      setLoading(false);
    });
  }, []);

  const handleAddTournament = (newTournament) => {
    setTournaments((prev) => [newTournament, ...prev]);
  };

  const totalTournaments = tournaments.length;
  const totalParticipants = tournaments.reduce((acc, curr) => acc + (Number(curr.currentParticipants) || 0), 0);
  const totalEntryFees = tournaments.reduce((acc, curr) => acc + (Number(curr.entryFee) || 0), 0);

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Dashboard loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of active events based on Backend Schema.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Events</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{totalTournaments}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Joined Participants</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{totalParticipants}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Revenue (₹)</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              ₹{totalEntryFees.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tournament List Table/Card view */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">Tournaments Overview</h2>
          <span className="text-xs text-slate-400 font-medium">Count: {totalTournaments}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {tournaments.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No events registered yet.</p>
          ) : (
            tournaments.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img 
                      src={item.bannerUrl || 'https://via.placeholder.com/150'} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-600">{item.game}</span>
                      <span>•</span>
                      <span className="capitalize">{item.tournamentType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.startDate ? String(item.startDate).split('T')[0] : 'TBA'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-700">
                      {item.currentParticipants || 0}/{item.maxParticipants || 0} Slots
                    </p>
                    <p className="text-[10px] text-slate-400">
                      ₹{item.entryFee ? Number(item.entryFee).toLocaleString('en-IN') : 0} Fee
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    item.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status || 'draft'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateTournamentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTournament}
      />
    </div>
  );
}