const mockTournaments = [
  {
    id: '1',
    name: 'Nexus Valorant Championship S1',
    game: 'Valorant',
    type: 'Single Elimination',
    status: 'Upcoming',
    startDate: '2026-09-10',
    venue: 'Online',
    city: 'Mumbai',
    registeredTeams: 12,
    maxTeams: 16,
    totalPrizePool: 75000,
    registrationFee: 500,
    registrationDeadline: '2026-09-08',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    description: 'Premier competitive Valorant tournament for amateur teams.',
    rules: ['Check-in 30 mins prior to match.', 'Anti-cheat required.']
  },
  {
    id: '2',
    name: 'BGMI Masters Showdown',
    game: 'BGMI',
    type: 'Battle Royale Points',
    status: 'Live',
    startDate: '2026-08-20',
    venue: 'Phoenix Arena',
    city: 'Pune',
    registeredTeams: 24,
    maxTeams: 24,
    totalPrizePool: 150000,
    registrationFee: 1000,
    registrationDeadline: '2026-08-18',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    description: 'LAN finals for top BGMI squads across Maharashtra.',
    rules: ['Must use mobile devices only.', 'No emulators permitted.']
  }
];

export const tournamentService = {
  getAll: async () => mockTournaments,
  getById: async (id) => mockTournaments.find(t => t.id === id) || mockTournaments[0],
  create: async (data) => {
    const newTournament = { id: String(Date.now()), ...data, registeredTeams: 0 };
    mockTournaments.push(newTournament);
    return newTournament;
  }
};