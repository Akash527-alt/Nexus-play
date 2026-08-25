import React, { createContext, useContext, useState, useEffect } from "react";

const TournamentContext = createContext();

const INITIAL_TOURNAMENTS = [
  {
    id: "1",
    title: "Valorant Collegiate Showdown",
    game: "Valorant",
    type: "Single Elimination",
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    venue: "Online (Mumbai)",
    entryFee: 0,
    maxParticipants: 16,
    registeredCount: 8,
    status: "Upcoming",
    bannerUrl: "https://picsum.photos/1200/400?valorant",
    totalPrizePool: 75000,
    rules: "Players must check in 30 minutes before match start."
  },
  {
    id: "2",
    title: "BGMI Campus Warfare",
    game: "BGMI",
    type: "Battle Royale Points",
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    venue: "Online (Delhi)",
    entryFee: 100,
    maxParticipants: 32,
    registeredCount: 32,
    status: "Upcoming",
    bannerUrl: "https://picsum.photos/1200/400?bgmi",
    totalPrizePool: 50000,
    rules: "No emulator players allowed."
  }
];

export function TournamentProvider({ children }) {
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem("nexus_tournaments");
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  useEffect(() => {
    localStorage.setItem("nexus_tournaments", JSON.stringify(tournaments));
  }, [tournaments]);

  const addTournament = (newTournament) => {
    const tournamentWithId = {
      ...newTournament,
      id: Date.now().toString(),
      registeredCount: 0,
      createdAt: new Date().toISOString()
    };
    setTournaments((prev) => [tournamentWithId, ...prev]);
  };

  return (
    <TournamentContext.Provider value={{ tournaments, addTournament }}>
      {children}
    </TournamentContext.Provider>
  );
}

export const useTournaments = () => useContext(TournamentContext);