import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentService } from '../../services/tournamentService';
import { Plus, Search, Calendar, Users, Trophy, Filter } from 'lucide-react';

export function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const data = await tournamentService.getAll();
      setTournaments(data);
    } catch (err) {
      console.error('Failed to load tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter((t) => {
    const titleMatch = (t.title || t.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const gameMatch = (t.game || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || gameMatch;

    if (filterStatus === 'All') return matchesSearch;
    return matchesSearch && (t.status || '').toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">All Tournaments</h1>
          <p className="text-sm theme-subtext">Manage, monitor, and create competitive events.</p>
        </div>
        <button
          onClick={() => navigate('/organizer/tournaments/create')}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 theme-subtext" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tournament name or game..."
            className="theme-input w-full pl-10 pr-4 py-2 text-sm border rounded-xl outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 theme-subtext hidden sm:block" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="theme-input px-3 py-2 text-sm border rounded-xl outline-none w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tournaments List */}
      {loading ? (
        <div className="theme-card p-8 text-center rounded-2xl border">
          <p className="text-sm theme-subtext">Loading tournaments...</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="theme-card p-12 text-center rounded-2xl border flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="theme-text font-bold text-base">No Tournaments Found</h3>
          <p className="theme-subtext text-xs max-w-sm">No events match your criteria or none have been created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTournaments.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate(`/organizer/tournaments/${t.id}`)}
              className="theme-card p-5 rounded-2xl border shadow-xs hover:border-indigo-500/50 cursor-pointer transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                    {t.game}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                    t.status?.toLowerCase() === 'upcoming'
                      ? 'bg-amber-500/10 text-amber-500'
                      : t.status?.toLowerCase() === 'draft'
                      ? 'bg-zinc-500/10 text-zinc-400'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {t.status || 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold theme-text line-clamp-1">{t.title || t.name}</h3>
                  <p className="text-xs theme-subtext line-clamp-2 mt-1">{t.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between text-xs theme-subtext">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start: {t.startDate || 'TBA'}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Max: {t.maxParticipants || 16}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold theme-text pt-1">
                  <span>Prize Pool</span>
                  <span className="text-indigo-500">₹{(Number(t.totalPrizePool) || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}