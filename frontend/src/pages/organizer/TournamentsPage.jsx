import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Users } from 'lucide-react';

export function TournamentsPage() {
  const navigate = useNavigate();

  const tournaments = [
    {
      id: '1',
      title: 'Nexus Invitational Season 1',
      game: 'Valorant',
      format: 'Single Elimination',
      prize: '₹75,000',
      teams: '8/16 Teams',
      status: 'Upcoming'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">Tournaments</h1>
          <p className="text-sm theme-subtext">Manage and host all your esports events from one place.</p>
        </div>
        <button 
          onClick={() => navigate('/organizer/tournaments/create')}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tournaments.map((t) => (
          <div 
            key={t.id}
            onClick={() => navigate(`/organizer/tournaments/${t.id}`)}
            className="theme-card rounded-2xl border p-5 shadow-xs theme-hover transition-all cursor-pointer flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-indigo-500/10 text-indigo-500">
                  {t.game}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {t.status}
                </span>
              </div>
              <h3 className="text-base font-bold theme-text">{t.title}</h3>
              <p className="text-xs theme-subtext mt-1">{t.format}</p>
            </div>

            <div className="border-t pt-3 flex items-center justify-between text-xs theme-text font-medium" style={{ borderColor: 'var(--border-color)' }}>
              <span className="flex items-center gap-1.5 theme-subtext"><Users className="w-3.5 h-3.5" /> {t.teams}</span>
              <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-500" /> {t.prize}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}