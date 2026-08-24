import React, { useState } from "react";
import { toast } from "sonner";

export const ParticipantTournaments = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [pricing, setPricing] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState(null);

  const tournaments = [
    { id: "1", title: "Valorant Collegiate Championship", mode: "online", entryFee: 200, date: "2026-09-02", organizer: "CyberArena", slotsLeft: 4 },
    { id: "2", title: "Inter-College BGMI Squads", mode: "offline", entryFee: 0, date: "2026-09-05", organizer: "Esports Club", slotsLeft: 12 },
    { id: "3", title: "Chess Masters Blitz Cup", mode: "online", entryFee: 0, date: "2026-09-10", organizer: "MindSports", slotsLeft: 8 },
    { id: "4", title: "Tekken 8 Open Invitational", mode: "offline", entryFee: 150, date: "2026-09-15", organizer: "Arcade Zone", slotsLeft: 2 }
  ];

  const filtered = tournaments.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesMode = mode === "all" || t.mode === mode;
    const matchesPricing = pricing === "all" || (pricing === "free" ? t.entryFee === 0 : t.entryFee > 0);
    return matchesSearch && matchesMode && matchesPricing;
  });

  const handleRegister = (t) => {
    if (t.entryFee === 0) {
      toast.success(`Registered for ${t.title}!`);
    } else {
      toast.success(`Redirecting to GPay for ₹${t.entryFee}...`);
    }
    setSelectedTournament(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
        <input
          type="text"
          placeholder="Search tournaments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-3">
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs border border-slate-700">
            {["all", "online", "offline"].map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`px-3 py-1 rounded-lg capitalize font-bold ${mode === m ? "bg-indigo-600 text-white" : "text-slate-400"}`}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs border border-slate-700">
            {["all", "free", "paid"].map((p) => (
              <button key={p} onClick={() => setPricing(p)} className={`px-3 py-1 rounded-lg capitalize font-bold ${pricing === p ? "bg-indigo-600 text-white" : "text-slate-400"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">{t.mode}</span>
                <span className="text-xs font-bold text-emerald-400">{t.entryFee === 0 ? "FREE" : `₹${t.entryFee}`}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">{t.title}</h3>
              <p className="text-xs text-slate-400">Date: {t.date}</p>
              <p className="text-xs text-amber-400 mt-1">{t.slotsLeft} Spots Left</p>
            </div>
            <button onClick={() => setSelectedTournament(t)} className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition">
              Register Slot
            </button>
          </div>
        ))}
      </div>

      {selectedTournament && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-100 mb-2">{selectedTournament.title}</h3>
            <p className="text-xs text-slate-400 mb-4">Entry Fee: <span className="text-emerald-400 font-bold">{selectedTournament.entryFee === 0 ? "FREE" : `₹${selectedTournament.entryFee}`}</span></p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedTournament(null)} className="px-4 py-2 bg-slate-800 text-xs rounded-xl">Cancel</button>
              <button onClick={() => handleRegister(selectedTournament)} className="px-4 py-2 bg-indigo-600 text-xs font-bold rounded-xl">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};