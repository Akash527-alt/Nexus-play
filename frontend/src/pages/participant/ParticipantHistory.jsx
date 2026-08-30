import React, { useEffect, useState } from "react";
import { participantService } from "../../services/participantService";

export const ParticipantHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await participantService.getHistory();
      const list = Array.isArray(res) ? res : res?.data || res?.history || [];
      setHistoryData(list);
    } catch (err) {
      console.error("Failed to load history:", err);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="theme-card border theme-border p-6 rounded-2xl shadow-xs w-full">
        <h1 className="text-xl font-bold theme-text">Match History Ledger</h1>
        <p className="text-xs theme-subtext mt-1">Review your completed tournaments and earned prize amounts.</p>
      </div>

      <div className="theme-card border theme-border rounded-2xl overflow-hidden shadow-xs w-full">
        {loading ? (
          <div className="p-12 text-center text-xs theme-subtext">Fetching history records...</div>
        ) : historyData.length === 0 ? (
          <div className="p-12 text-center text-xs theme-subtext">
            No completed matches or tournament history found.
          </div>
        ) : (
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
                  <tr key={item._id || item.id} className="theme-hover transition">
                    <td className="p-4 font-bold">{item.tournamentTitle || item.tournament}</td>
                    <td className="p-4 theme-subtext">
                      {item.date ? new Date(item.date).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                    <td className="p-4 font-semibold text-indigo-500">{item.position || item.placement || "Participant"}</td>
                    <td className="p-4 text-right font-bold text-emerald-500">
                      ₹{(Number(item.prize) || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};