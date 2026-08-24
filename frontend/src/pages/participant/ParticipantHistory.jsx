import React from "react";

export const ParticipantHistory = () => {
  const historyData = [
    { id: "1", tournament: "BGMI Campus Cup", date: "2026-08-10", position: "1st Place 🏆", prize: "₹2,500" },
    { id: "2", tournament: "Valorant Masters", date: "2026-07-28", position: "3rd Place 🥉", prize: "₹500" },
    { id: "3", tournament: "Tekken 8 Clash", date: "2026-07-15", position: "Runner Up 🥈", prize: "₹1,500" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="theme-card border theme-border p-6 rounded-2xl shadow-xs w-full">
        <h1 className="text-xl font-bold theme-text">Match History Ledger</h1>
        <p className="text-xs theme-subtext mt-1">Review your completed tournaments and earned prize amounts.</p>
      </div>

      <div className="theme-card border theme-border rounded-2xl overflow-hidden shadow-xs w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b theme-border theme-icon-box text-[11px] font-bold theme-subtext uppercase">
                <th className="p-4">Tournament</th>
                <th className="p-4">Date</th>
                <th className="p-4">Result</th>
                <th className="p-4 text-right">Prize Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border text-xs theme-text">
              {historyData.map((item) => (
                <tr key={item.id} className="theme-hover transition">
                  <td className="p-4 font-bold">{item.tournament}</td>
                  <td className="p-4 theme-subtext">{item.date}</td>
                  <td className="p-4 font-semibold text-indigo-500">{item.position}</td>
                  <td className="p-4 text-right font-bold text-emerald-500">{item.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};