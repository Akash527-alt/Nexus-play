import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { participantService } from "../../services/participantService";
import { RegisterModal } from "../../components/tournaments/RegisterModal";

export const ParticipantTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Controls the Register Form Modal
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      let list = [];

      // 1. Try fetching from Backend API
      try {
        if (participantService && typeof participantService.getTournaments === "function") {
          const res = await participantService.getTournaments();
          if (Array.isArray(res)) {
            list = res;
          } else if (Array.isArray(res?.tournaments)) {
            list = res.tournaments;
          } else if (Array.isArray(res?.data)) {
            list = res.data;
          } else if (Array.isArray(res?.data?.tournaments)) {
            list = res.data.tournaments;
          }
        }
      } catch (backendErr) {
        console.warn("Backend fetch bypassed, retrieving local storage sync tournaments:", backendErr);
      }

      // 2. Read local sync arrays across organizer/participant keys
      const readArray = (key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || "[]");
        } catch (e) {
          return [];
        }
      };

      const local1 = readArray("nexus_tournaments");
      const local2 = readArray("my_tournaments");
      const localRegs = readArray("participant_registrations");
      const myRegs = readArray("my_registrations");

      // Combine registration records
      const allRegisteredIds = [
        ...localRegs,
        ...myRegs.map((r) => r.tournamentId || r.id || r._id)
      ].map(String);

      // 3. Deduplicate and normalize objects safely
      const combinedMap = new Map();
      [...list, ...local1, ...local2].forEach((item) => {
        const key = String(item._id || item.id || item.title || item.name);
        if (key) {
          const isReg =
            allRegisteredIds.includes(key) ||
            item.isRegistered ||
            item.status === "registered" ||
            false;

          combinedMap.set(key, {
            ...item,
            _id: key,
            id: key,
            title: item.title || item.name || "Untitled Tournament",
            game: item.game || "Esports",
            prizePool: item.prizePool || item.totalPrizePool || 0,
            maxSlots: item.maxSlots || item.maxParticipants || item.maxTeams || 16,
            filledSlots: item.filledSlots || item.currentParticipants || (isReg ? 1 : 0),
            isRegistered: isReg,
            status: item.status || "published"
          });
        }
      });

      setTournaments(Array.from(combinedMap.values()));
    } catch (err) {
      console.error("Failed to process tournaments list:", err);
      toast.error("Failed to load tournaments list");
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegisterModal = (tournament) => {
    setSelectedTournament(tournament);
    setIsModalOpen(true);
  };

  const filteredTournaments = tournaments.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.game?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "registered") return item.isRegistered;
    if (filter === "live") return item.status?.toLowerCase() === "live";
    if (filter === "upcoming")
      return item.status?.toLowerCase() === "upcoming" || item.status?.toLowerCase() === "published";

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
          { id: "upcoming", label: "Upcoming / Open" },
          { id: "live", label: "Live Now 🔴" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
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
                    {t.game}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md capitalize ${
                      t.status === "live"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}
                  >
                    {t.status}
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
                      {t.filledSlots} / {t.maxSlots}
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
                  type="button"
                  onClick={() => handleOpenRegisterModal(t)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-sm text-center cursor-pointer"
                >
                  Register Now ➔
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FORM REGISTRATION MODAL */}
      {selectedTournament && (
        <RegisterModal
          tournament={selectedTournament}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTournament(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedTournament(null);
            fetchTournaments();
          }}
        />
      )}
    </div>
  );
};

export default ParticipantTournaments;