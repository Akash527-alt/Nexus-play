import api from "./api";

export const tournamentService = {
  getAll: async () => {
    const res = await api.get("/tournaments");
    return res.data;
  },

  getMy: async () => {
    const res = await api.get("/tournaments/me");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/tournaments/${id}`);
    return res.data;
  },

  create: async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (key === "prizes") {
        formData.append(key, JSON.stringify(value));
        return;
      }

      if (key === "tournamentImage") {
        if (value instanceof File) {
          formData.append(key, value);
        }
        return;
      }

      formData.append(key, value);
    });

    const res = await api.post("/tournaments", formData);

    return res.data;
  },

  getRegisteredTeams: async (tournamentId) => {
    const response = await api.get(
      `/tournaments/${tournamentId}/registrations`
    );

    return response.data;
  },

  getPrizeDistribution: async (tournamentId) => {
    const response = await api.get(
      `/prize-distributions/tournaments/${tournamentId}`
    );

    return response.data;
  },

  confirmPrizeWinner: async (tournamentId, data) => {
    const response = await api.post(
      `/prize-distributions/tournaments/${tournamentId}`,
      data
    );

    return response.data;
  },

  removePrizeWinner: async (tournamentId, distributionId) => {
    const response = await api.delete(
      `/prize-distributions/tournaments/${tournamentId}/${distributionId}`
    );

    return response.data;
  },
};

export default tournamentService;