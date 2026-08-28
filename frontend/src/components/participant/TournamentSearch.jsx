import React from 'react';

export const TournamentSearch = ({ search, setSearch, mode, setMode, pricing, setPricing }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center text-white shadow-lg">
      <input
        type="text"
        placeholder="Search tournaments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
      />

      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        {/* Mode Filter (Online / Offline) */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs border border-slate-700/50">
          {['all', 'online', 'offline'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition ${
                mode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Pricing Filter (Free / Paid) */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs border border-slate-700/50">
          {['all', 'free', 'paid'].map((p) => (
            <button
              key={p}
              onClick={() => setPricing(p)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition ${
                pricing === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};