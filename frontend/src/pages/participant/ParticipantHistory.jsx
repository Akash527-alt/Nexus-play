import React from "react";

export const ParticipantHistory = () => {
  const history = [
    { id: "101", title: "Overwatch Cyber Cup", date: "2026-08-10", mode: "online", status: "Won", prize: "₹2,000", position: "1st Place" },
    { id: "102", title: "EA FC 26 FIFA Night", date: "2026-07-20", mode: "offline", status: "Lost", prize: "Runner Up", position: "2nd Place" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-800 font-bold text-sm text-slate-200">
        Match History Ledger
      </div>
      <div className="divide-y divide-slate-800">
        {history.map((h) => (
          <div key={h.id} className="p-5 flex justify-between items-center hover:bg-slate-800/30 transition">
            <div>
              <h4 className="font-bold text-xs text-slate-200">{h.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1">{h.date} • {h.mode.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${h.status === "Won" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {h.position}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Reward: {h.prize}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};