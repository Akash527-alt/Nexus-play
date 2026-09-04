// src/pages/participant/PublicTournamentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RegisterModal } from '../../components/tournaments/RegisterModal';
import { CheckCircle2 } from 'lucide-react';

export function PublicTournamentDetails() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const allTournaments = JSON.parse(localStorage.getItem('nexus_tournaments') || '[]');
    const current = allTournaments.find(t => String(t._id || t.id) === String(id));
    setTournament(current);

    const myRegs = JSON.parse(localStorage.getItem('my_registrations') || '[]');
    const registered = myRegs.some(r => String(r.tournamentId) === String(id));
    setIsRegistered(registered);
  }, [id]);

  if (!tournament) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-xl text-white">
        <div>
          <h1 className="text-2xl font-bold">{tournament.title || tournament.name}</h1>
          <p className="text-xs text-zinc-400">{tournament.game} • {tournament.venue}</p>
        </div>

        {/* Participant Action */}
        {isRegistered ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg font-bold text-xs border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" /> Already Registered
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700"
          >
            Register Now
          </button>
        )}
      </div>

      {/* Participant Registration Modal */}
      <RegisterModal 
        tournament={tournament}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => setIsRegistered(true)}
      />
    </div>
  );
}