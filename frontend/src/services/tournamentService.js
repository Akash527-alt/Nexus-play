let mockTournaments = [
  {
    id: '1',
    title: 'Nexus Invitational Season 1',
    game: 'Valorant',
    tournamentType: 'team',
    format: 'Single Elimination',
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    venue: 'Online (Mumbai)',
    entryFee: 500,
    registrationDeadline: '2026-09-08',
    maxParticipants: 16,
    teamSize: 5,
    currentParticipants: 8,
    description: 'Premier Valorant tournament for Indian teams.',
    bannerUrl: 'https://picsum.photos/1200/400?gaming',
    prizes: [
      { position: '1st Place', amount: 50000 },
      { position: '2nd Place', amount: 25000 }
    ],
    rules: '1. Players must check in 30 minutes before match start.',
    status: 'upcoming',
    totalPrizePool: 75000
  }
];

export const tournamentService = {
  getAll: async () => {
    return mockTournaments;
  },

  getById: async (id) => {
    return mockTournaments.find((t) => t.id === id);
  },

  create: async (data) => {
    const newTournament = {
      id: Date.now().toString(),
      currentParticipants: 0,
      ...data
    };
    mockTournaments = [newTournament, ...mockTournaments];
    return newTournament;
  },

  delete: async (id) => {
    mockTournaments = mockTournaments.filter((t) => t.id !== id);
    return true;
  }
};