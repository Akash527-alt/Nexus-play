import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentService } from '../../services/tournamentService.js';
import { useTournaments } from '../../context/TournamentContext.jsx';
import { Trophy, Users, Calendar, Plus, ChevronRight, Zap } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  
  const context = useTournaments ? useTournaments() : null;
  const contextTournaments = context?.tournaments;

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let apiData = [];

        if (tournamentService) {
          // Fetch organizer-specific tournaments strictly from backend API
          const fetchFn = tournamentService.getMy || tournamentService.getOrganizerTournaments || tournamentService.getAll;
          const response = await fetchFn();

          if (Array.isArray(response)) {
            apiData = response;
          } else if (Array.isArray(response?.data)) {
            apiData = response.data;
          } else if (Array.isArray(response?.tournaments)) {
            apiData = response.tournaments;
          } else if (Array.isArray(response?.data?.tournaments)) {
            apiData = response.data.tournaments;
          }
        }

        setTournaments(apiData);
      } catch (err) {
        console.error('Failed to load tournaments:', err);
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sourceList = (Array.isArray(contextTournaments) && contextTournaments.length > 0)
    ? contextTournaments
    : tournaments;

  const sortedTournaments = [...sourceList].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.startDate || 0);
    const dateB = new Date(b.createdAt || b.startDate || 0);
    return dateB - dateA;
  });

  const totalPrize = sortedTournaments.reduce((acc, curr) => {
    const pool = Number(curr.prizePool) || Number(curr.totalPrizePool) || Number(curr.entryFee) || 0;
    return acc + pool;
  }, 0);

  const activeCount = sortedTournaments.filter(t => {
    const status = (t.status || 'published').toLowerCase();
    return status === 'published' || status === 'ongoing' || status === 'upcoming';
  }).length;

  const formatDate = (tournament) => {
    const dateVal = tournament?.startDate || tournament?.startTime || tournament?.createdAt;
    if (!dateVal) return 'TBA';
    try {
      const parsed = new Date(dateVal);
      return isNaN(parsed.getTime()) ? 'TBA' : parsed.toLocaleDateString();
    } catch {
      return 'TBA';
    }
  };

  const handleCardClick = (tournamentId) => {
    if (tournamentId) {
      navigate(`/organizer/tournaments/${tournamentId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">Organizer Dashboard</h1>
          <p className="text-sm theme-subtext">Manage active events, track registrations, and monitor prize pools.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/organizer/tournaments/create')}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card p-5 rounded-2xl border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs font-bold uppercase tracking-wider theme-subtext">Total Tournaments</span>
            <Trophy className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold theme-text">{sortedTournaments.length}</p>
        </div>

        <div className="theme-card p-5 rounded-2xl border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-bold uppercase tracking-wider theme-subtext">Active / Published</span>
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold theme-text">{activeCount}</p>
        </div>

        <div className="theme-card p-5 rounded-2xl border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold uppercase tracking-wider theme-subtext">Total Prize Pool</span>
            <span className="font-bold text-sm">₹</span>
          </div>
          <p className="text-2xl font-extrabold theme-text">₹{totalPrize.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold theme-text">Recent Tournaments</h2>
          <button
            type="button"
            onClick={() => navigate('/organizer/tournaments')}
            className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="theme-card p-8 text-center rounded-2xl border">
            <p className="text-sm theme-subtext">Loading dashboard events...</p>
          </div>
        ) : sortedTournaments.length === 0 ? (
          <div className="theme-card p-12 text-center rounded-2xl border flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="theme-text font-bold text-base">No Tournaments Created Yet</h3>
            <p className="theme-subtext text-xs max-w-sm">Get started by creating your first esports tournament to manage matches and prize distribution.</p>
            <button
              type="button"
              onClick={() => navigate('/organizer/tournaments/create')}
              className="mt-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Create Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedTournaments.slice(0, 4).map((t) => {
              const tournamentId = t._id || t.id;
              const status = (t.status || 'published').toLowerCase();
              
              return (
                <div
                  key={tournamentId}
                  onClick={() => handleCardClick(tournamentId)}
                  className="theme-card p-5 rounded-2xl border shadow-xs hover:border-indigo-500/50 cursor-pointer transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {t.game || 'Esports'}
                      </span>
                      <h3 className="text-base font-bold theme-text mt-1.5">{t.title || t.name || 'Untitled Tournament'}</h3>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize bg-emerald-500/10 text-emerald-500">
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs theme-subtext pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(t)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Users className="w-3.5 h-3.5" />
                      <span>{t.maxParticipants ? `${t.maxParticipants} Teams` : 'Open'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}