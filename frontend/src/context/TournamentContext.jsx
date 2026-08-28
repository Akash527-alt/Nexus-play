// import React, { createContext, useContext, useState, useEffect } from "react";

// const TournamentContext = createContext();

// const INITIAL_TOURNAMENTS = [
//   {
//     id: "1",
//     title: "Valorant Collegiate Showdown",
//     game: "Valorant",
//     type: "Single Elimination",
//     startDate: "2026-09-01",
//     endDate: "2026-09-05",
//     venue: "Online (Mumbai)",
//     entryFee: 0,
//     maxParticipants: 16,
//     registeredCount: 8,
//     status: "Upcoming",
//     bannerUrl: "https://picsum.photos/1200/400?valorant",
//     totalPrizePool: 75000,
//     rules: "Players must check in 30 minutes before match start."
//   },
//   {
//     id: "2",
//     title: "BGMI Campus Warfare",
//     game: "BGMI",
//     type: "Battle Royale Points",
//     startDate: "2026-09-10",
//     endDate: "2026-09-12",
//     venue: "Online (Delhi)",
//     entryFee: 100,
//     maxParticipants: 32,
//     registeredCount: 32,
//     status: "Upcoming",
//     bannerUrl: "https://picsum.photos/1200/400?bgmi",
//     totalPrizePool: 50000,
//     rules: "No emulator players allowed."
//   }
// ];

// export function TournamentProvider({ children }) {
//   const [tournaments, setTournaments] = useState(() => {
//     const saved = localStorage.getItem("nexus_tournaments");
//     return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
//   });

//   useEffect(() => {
//     localStorage.setItem("nexus_tournaments", JSON.stringify(tournaments));
//   }, [tournaments]);

//   const addTournament = (newTournament) => {
//     const tournamentWithId = {
//       ...newTournament,
//       id: Date.now().toString(),
//       registeredCount: 0,
//       createdAt: new Date().toISOString()
//     };
//     setTournaments((prev) => [tournamentWithId, ...prev]);
//   };

//   return (
//     <TournamentContext.Provider value={{ tournaments, addTournament }}>
//       {children}
//     </TournamentContext.Provider>
//   );
// }

// export const useTournaments = () => useContext(TournamentContext);

import React, { createContext, useContext, useState } from "react";

import { tournamentService } from "../services/tournamentService";
const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Get all tournaments
  const fetchAllTournaments = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await tournamentService.getAll();

      if (data.success) {
        setTournaments(data.tournaments);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  // Get logged-in organizer's tournaments
  const fetchMyTournaments = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyTournaments();

      if (data.success) {
        setTournaments(data.tournaments);
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || "Failed to load your tournaments",
      );
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tournaments,
    loading,
    error,
    fetchAllTournaments,
    fetchMyTournaments,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

export const useTournaments = () => useContext(TournamentContext);
