import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tournamentService } from '../../services/tournamentService';
import { ArrowLeft, Trophy, Calendar, MapPin, Users, IndianRupee, ShieldCheck } from 'lucide-react';

export function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await tournamentService.getById(id);
        setTournament(data);
      } catch (err) {
        console.error('Failed to fetch tournament:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading details...</div>;
  if (!tournament) return <div className="p-6 text-sm text-rose-500">Tournament not found!</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {tournament.game}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{tournament.title}</h1>
            <p className="text-xs text-slate-500 mt-1">{tournament.format} • {tournament.tournamentType}</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
            {tournament.status}
          </span>
        </div>

        <p className="text-sm text-slate-600">{tournament.description || 'No description provided.'}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase">Prize Pool</p>
          <p className="text-lg font-bold text-slate-900 flex items-center gap-1 mt-1">
            <IndianRupee className="w-4 h-4 text-amber-500" /> ₹{(tournament.totalPrizePool || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase">Slots / Teams</p>
          <p className="text-lg font-bold text-slate-900 flex items-center gap-1 mt-1">
            <Users className="w-4 h-4 text-emerald-500" /> {tournament.currentParticipants || 0} / {tournament.maxParticipants}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase">Dates</p>
          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-2">
            <Calendar className="w-3.5 h-3.5 text-blue-500" /> {tournament.startDate || 'TBD'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase">Venue</p>
          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-2">
            <MapPin className="w-3.5 h-3.5 text-purple-500" /> {tournament.venue || 'Online'}
          </p>
        </div>
      </div>

      {/* Rules & Prizes breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-500" /> Prize Distribution
          </h3>
          <ul className="space-y-2">
            {tournament.prizes?.map((p, i) => (
              <li key={i} className="flex justify-between text-xs border-b pb-1.5 text-slate-700">
                <span>{p.position}</span>
                <span className="font-bold">₹{Number(p.amount).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Rules
          </h3>
          <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
            {tournament.rules || 'No custom rules set.'}
          </p>
        </div>
      </div>
    </div>
  );
}