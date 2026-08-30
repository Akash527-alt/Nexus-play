import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { participantService } from "../../services/participantService";

export const ParticipantTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await participantService.getTournaments();
      const list = Array.isArray(res) ? res : res?.data || res?.tournaments || [];
      setTournaments(list);
    } catch (err) {
      console.error("Failed to load tournaments:", err);
      toast.error("Failed to load tournaments list");
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (tournamentId) => {
    try {
      setRegistering(true);
      await participantService.registerTournament(tournamentId);
      toast.success("Successfully registered for the tournament!");
      setSelectedTournament(null);
      fetchTournaments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to register for tournament");
    } finally {
      setRegistering(false);
    }
  };

  const filteredTournaments = tournaments.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.game?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "registered") return item.isRegistered || item.status === "registered";
    if (filter === "live") return item.status?.toLowerCase() === "live";
    if (filter === "upcoming") return item.status?.toLowerCase() === "upcoming";

    return true;
  });

  return (
    <div className="w-full space-y-6">
      <div className="theme-card border theme-border p-6 rounded-2xl shadow-xs w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold theme-text">Esports Arena Tournaments</h1>
          <p className="text-xs theme-subtext mt-1">
            Browse available tournaments, register your squad, and compete for prize pools.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search game or event..."
            className="w-full theme-card border theme-border rounded-xl px-3.5 py-2 text-xs theme-text focus:outline-none focus:border-indigo-500 pl-9"
          />
          <span className="absolute left-3 top-2.5 text-xs theme-subtext">🔍</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Tournaments" },
          { id: "registered", label: "My Registrations" },
          { id: "upcoming", label: "Upcoming" },
          { id: "live", label: "Live Now 🔴" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "theme-card border theme-border theme-subtext theme-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs theme-subtext theme-card border theme-border rounded-2xl">
          Fetching available tournaments...
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="p-12 text-center text-xs theme-subtext theme-card border theme-border rounded-2xl">
          No tournaments found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredTournaments.map((t) => (
            <div
              key={t._id || t.id}
              className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-indigo-500/50 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-indigo-600/10 text-indigo-500 border border-indigo-500/20 px-2.5 py-0.5 rounded-md uppercase">
                    {t.game || "Esports"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                      t.status === "live"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}
                  >
                    {t.status || "Open"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold theme-text line-clamp-1">{t.title}</h3>
                  <p className="text-[11px] theme-subtext mt-1">
                    Organizer: <span className="theme-text font-medium">{t.organizerName || "Official Arena"}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 theme-icon-box border theme-border p-3 rounded-xl text-xs">
                  <div>
                    <p className="text-[10px] theme-subtext font-medium">Prize Pool</p>
                    <p className="font-bold text-emerald-500 mt-0.5">
                      ₹{(Number(t.prizePool) || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] theme-subtext font-medium">Entry Fee</p>
                    <p className="font-bold theme-text mt-0.5">
                      {t.entryFee ? `₹${t.entryFee}` : "Free"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] theme-subtext font-medium">Date & Time</p>
                    <p className="font-bold theme-text mt-0.5 text-[11px]">
                      {t.startDate ? new Date(t.startDate).toLocaleDateString("en-IN") : "TBA"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] theme-subtext font-medium">Slots Filled</p>
                    <p className="font-bold theme-text mt-0.5 text-[11px]">
                      {t.filledSlots || 0} / {t.maxSlots || "∞"}
                    </p>
                  </div>
                </div>
              </div>

              {t.isRegistered ? (
                <button
                  disabled
                  className="w-full py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold rounded-xl cursor-default text-center"
                >
                  ✓ Registered
                </button>
              ) : (
                <button
                  onClick={() => setSelectedTournament(t)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-sm text-center"
                >
                  Register Now ➔
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTournament && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="theme-card border theme-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b theme-border pb-3">
              <h3 className="text-sm font-bold theme-text">Confirm Tournament Slot</h3>
              <button
                onClick={() => setSelectedTournament(null)}
                className="theme-subtext text-xs hover:theme-text"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="theme-text">
                You are about to register for <strong className="text-indigo-500">{selectedTournament.title}</strong>.
              </p>

              <div className="theme-icon-box border theme-border p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="theme-subtext">Game:</span>
                  <span className="font-bold theme-text">{selectedTournament.game}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-subtext">Entry Fee:</span>
                  <span className="font-bold text-emerald-500">
                    {selectedTournament.entryFee ? `₹${selectedTournament.entryFee}` : "Free"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-subtext">Date:</span>
                  <span className="font-bold theme-text">
                    {selectedTournament.startDate
                      ? new Date(selectedTournament.startDate).toLocaleDateString("en-IN")
                      : "TBA"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t theme-border">
              <button
                onClick={() => setSelectedTournament(null)}
                className="px-4 py-2 theme-border border rounded-xl theme-subtext text-xs theme-hover"
              >
                Cancel
              </button>
              <button
                disabled={registering}
                onClick={() => handleRegister(selectedTournament._id || selectedTournament.id)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
              >
                {registering ? "Confirming..." : "Confirm Registration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantTournaments;