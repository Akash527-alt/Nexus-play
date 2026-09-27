import api from "./api";

export const participantService = {
  getDashboardStats: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  getTournaments: async () => {
    const response = await api.get("/tournaments");
    return response.data;
  },

  createPaymentOrder: async (tournamentId, registrationData) => {
    const response = await api.post(
      "/payments/create-order",
      {
        tournamentId,
        ...registrationData,
      }
    );

    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post(
      "/payments/verify",
      paymentData
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