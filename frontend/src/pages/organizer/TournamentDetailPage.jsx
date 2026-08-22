import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tournamentService } from '../../services/tournamentService';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Clock, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const data = await tournamentService.getById(id);
      setTournament(data);
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      await tournamentService.delete(id);
      toast.success('Tournament deleted successfully');
      navigate('/organizer/tournaments');
    }
  };

  if (loading) {
    return (
      <div className="theme-card p-12 text-center rounded-2xl border">
        <p className="text-sm theme-subtext">Loading tournament details...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="theme-card p-12 text-center rounded-2xl border space-y-3">
        <h2 className="text-lg font-bold theme-text">Tournament Not Found</h2>
        <button onClick={() => navigate('/organizer/tournaments')} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">
          Back to Tournaments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/organizer/tournaments')}
          className="theme-hover theme-text flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg cursor-pointer transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Delete Event
        </button>
      </div>

      {/* Main Info Card */}
      <div className="theme-card p-6 rounded-2xl border shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
                {tournament.game}
              </span>
              <span className="text-xs theme-subtext">• {tournament.format || tournament.type}</span>
            </div>
            <h1 className="text-2xl font-extrabold theme-text mt-1">{tournament.title || tournament.name}</h1>
            <p className="text-xs theme-subtext mt-1">{tournament.description || 'No description provided.'}</p>
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
            tournament.status?.toLowerCase() === 'upcoming'
              ? 'bg-amber-500/10 text-amber-500'
              : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            {tournament.status || 'Upcoming'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border bg-indigo-500/5" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Prize Pool
            </span>
            <p className="text-lg font-bold text-indigo-500 mt-1">₹{(Number(tournament.totalPrizePool) || 0).toLocaleString('en-IN')}</p>
          </div>

          <div className="p-3.5 rounded-xl border bg-indigo-500/5" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Slots / Teams
            </span>
            <p className="text-lg font-bold theme-text mt-1">0 / {tournament.maxParticipants || 16}</p>
          </div>

          <div className="p-3.5 rounded-xl border bg-indigo-500/5" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Venue
            </span>
            <p className="text-sm font-bold theme-text mt-1 line-clamp-1">{tournament.venue || 'Online'}</p>
          </div>

          <div className="p-3.5 rounded-xl border bg-indigo-500/5" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-[10px] font-bold uppercase theme-subtext flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-500" /> Reg. Fee
            </span>
            <p className="text-sm font-bold theme-text mt-1">
              {Number(tournament.entryFee || tournament.registrationFee) > 0 ? `₹${tournament.entryFee}` : 'Free Entry'}
            </p>
          </div>
        </div>

        {/* Schedule & Dates Section */}
        <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider theme-subtext flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" /> Tournament Timeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg border bg-zinc-500/5" style={{ borderColor: 'var(--border-color)' }}>
              <span className="theme-subtext block text-[10px] uppercase font-bold">Registration Deadline</span>
              <span className="theme-text font-bold text-rose-500">{tournament.registrationDeadline || 'Not Set'}</span>
            </div>

            <div className="p-2.5 rounded-lg border bg-zinc-500/5" style={{ borderColor: 'var(--border-color)' }}>
              <span className="theme-subtext block text-[10px] uppercase font-bold">Start Date</span>
              <span className="theme-text font-bold">{tournament.startDate || 'Not Set'}</span>
            </div>

            <div className="p-2.5 rounded-lg border bg-zinc-500/5" style={{ borderColor: 'var(--border-color)' }}>
              <span className="theme-subtext block text-[10px] uppercase font-bold">End Date</span>
              <span className="theme-text font-bold">{tournament.endDate || 'Not Set'}</span>
            </div>
          </div>
        </div>

        {/* Prize Pool Breakdown */}
        <div>
          <h3 className="text-sm font-bold theme-text mb-3">Prize Distribution</h3>
          {tournament.prizes && tournament.prizes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tournament.prizes.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg border text-xs" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="font-semibold theme-text">{p.position}</span>
                  <span className="font-bold text-emerald-500">₹{(Number(p.amount) || 0).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs theme-subtext">No breakdown configured.</p>
          )}
        </div>

        {/* Rules */}
        <div>
          <h3 className="text-sm font-bold theme-text mb-2 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-indigo-500" /> Rules & Regulations
          </h3>
          <div className="p-3.5 rounded-xl border text-xs theme-subtext space-y-1.5" style={{ borderColor: 'var(--border-color)' }}>
            {typeof tournament.rules === 'string'
              ? tournament.rules.split('\n').map((r, i) => <p key={i}>• {r}</p>)
              : Array.isArray(tournament.rules)
              ? tournament.rules.map((r, i) => <p key={i}>• {r}</p>)
              : <p>Standard fair play rules apply.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}