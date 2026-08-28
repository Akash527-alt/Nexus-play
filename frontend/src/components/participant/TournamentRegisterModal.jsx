import React, { useState } from 'react';
import { redirectToGPay } from '../../utils/payment';

export const TournamentRegisterModal = ({ tournament, onClose, onRegistrationSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFree = tournament.entryFee === 0;

  const handleFreeRegistration = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegistrationSuccess(`Registered for ${tournament.title}! Confirmation email triggered.`);
      onClose();
    }, 800);
  };

  const handlePaidRegistration = () => {
    setLoading(true);
    redirectToGPay({
      amount: tournament.entryFee,
      tournamentTitle: tournament.title,
      onSuccess: (data) => {
        setLoading(false);
        onRegistrationSuccess(`Payment Received (${data.paymentId})! Registered for ${tournament.title}. Email sent.`);
        onClose();
      },
      onFailure: (errMsg) => {
        setLoading(false);
        setError(errMsg);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl">
        <h3 className="text-xl font-bold mb-1">{tournament.title}</h3>
        <p className="text-slate-400 text-xs mb-4">
          Mode: <span className="uppercase text-indigo-400 font-bold">{tournament.mode}</span> | Type: <span className="capitalize text-emerald-400 font-bold">{tournament.type}</span>
        </p>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4">{error}</div>}

        <div className="bg-slate-800/80 p-4 rounded-xl mb-6 border border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300">Entry Fee:</span>
            <span className="text-xl font-extrabold text-emerald-400">
              {isFree ? 'FREE' : `₹${tournament.entryFee}`}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isFree 
              ? 'Instant registration. No payment required.' 
              : 'Clicking pay will redirect you directly to GPay/UPI.'}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition">
            Cancel
          </button>
          <button 
            onClick={isFree ? handleFreeRegistration : handlePaidRegistration}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2">
            {loading ? 'Processing...' : isFree ? 'Confirm Free Spot' : 'Pay via GPay'}
          </button>
        </div>
      </div>
    </div>
  );
};