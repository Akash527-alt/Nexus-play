import axios from "axios";

// Update base URL as per your API setup
const API_URL = "http://localhost:5000/api/participant"; 

export const participantService = {
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  },

  getTournaments: async () => {
    const response = await axios.get(`${API_URL}/tournaments`);
    return response.data;
  },

  registerTournament: async (tournamentId) => {
    const response = await axios.post(`${API_URL}/tournaments/${tournamentId}/register`);
    return response.data;
  },

  getHistory: async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  },
};