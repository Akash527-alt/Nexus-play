import React, { createContext, useContext, useState, useEffect } from "react";
import { tournamentService } from "../services/tournamentService";

const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch organizer tournaments
  const fetchMyTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentService.getMy();
      const list = response?.tournaments || response?.data || (Array.isArray(response) ? response : []);
      setTournaments(list);
    } catch (err) {
      console.error("Context fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  // Add tournament state helper
  const addTournament = (newItem) => {
    setTournaments((prev) => [newItem, ...prev]);
  };

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  const value = {
    tournaments,
    loading,
    error,
    addTournament,
    fetchMyTournaments,
    setTournaments
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

export const useTournaments = () => useContext(TournamentContext);