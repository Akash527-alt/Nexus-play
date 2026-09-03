import api from './api';

export const tournamentService = {
  // Public/Participant List
  getAll: async () => {
    const res = await api.get('/tournaments');
    return res.data;
  },

  // Organizer List
  getMy: async () => {
    const res = await api.get('/organizer/tournaments');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/tournaments/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/organizer/tournaments', data);
    return res.data;
  }
};