import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const participantService = {
  getDashboardStats: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  getTournaments: async () => {
    const response = await api.get("/tournaments");
    return response.data;
  },

  registerTournament: async (tournamentId, registrationData) => {
    const response = await api.post(
      `/tournaments/${tournamentId}/register`,
      registrationData
    );

    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get("/registrations/me");
    return response.data;
  },

  getMyRegistration: async (tournamentId) => {
    const response = await api.get(
      `/tournaments/${tournamentId}/registration`
    );

    return response.data;
  },

  cancelRegistration: async (tournamentId) => {
    const response = await api.delete(
      `/tournaments/${tournamentId}/registration`
    );

    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/participant/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put(
      "/participant/profile",
      data
    );

    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/participant/history");
    return response.data;
  },
};

export default participantService;