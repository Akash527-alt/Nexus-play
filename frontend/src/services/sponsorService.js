import api from "./api";

export const sponsorService = {
  getProfile: async () => {
    const res = await api.get("/sponsors/me");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put("/sponsors/me", data);
    return res.data;
  },

  getMySponsorships: async () => {
    const res = await api.get("/sponsors/sponsorships");
    return res.data;
  },

  sponsorTournament: async (tournamentId, data) => {
    const res = await api.post(
      `/sponsors/tournaments/${tournamentId}/sponsors`,
      data,
    );
    return res.data;
  },

  getTournamentSponsors: async (tournamentId) => {
    const res = await api.get(
      `/sponsors/tournaments/${tournamentId}/sponsors`,
    );
    return res.data;
  },

  getOrganizerSponsorships: async () => {
    const res = await api.get("/sponsors/organizer/sponsors");
    return res.data;
  },

  updateSponsorshipStatus: async (
    id,
    status,
    rejectionReason = "",
  ) => {
    const res = await api.patch(
      `/sponsors/organizer/sponsors/${id}/status`,
      {
        status,
        rejectionReason,
      },
    );
    return res.data;
  },

  createSponsorshipPaymentOrder: async (sponsorshipId) => {
    const res = await api.post(
      "/sponsorship-payments/create-order",
      {
        sponsorshipId,
      },
    );
    return res.data;
  },

  verifySponsorshipPayment: async (paymentData) => {
    const res = await api.post(
      "/sponsorship-payments/verify",
      paymentData,
    );
    return res.data;
  },
};

export default sponsorService;