const STORAGE_KEY = 'nexus_tournaments';

// Default mock data loaded if localStorage is empty
const defaultTournaments = [
  {
    id: '1',
    title: 'Nexus Valorant Championship',
    game: 'Valorant',
    format: 'Single Elimination',
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    venue: 'Online (Mumbai)',
    entryFee: 500,
    registrationDeadline: '2026-09-08',
    maxParticipants: 16,
    teamSize: 5,
    description: 'Premier regional Valorant tournament.',
    status: 'Upcoming',
    totalPrizePool: 75000,
    prizes: [
      { position: '1st Place', amount: 50000 },
      { position: '2nd Place', amount: 25000 }
    ],
    rules: 'Players must check in 30 minutes before match start.'
  }
];

const getStoredTournaments = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTournaments));
    return defaultTournaments;
  }
  return JSON.parse(data);
};

export const tournamentService = {
  getAll: async () => {
    return getStoredTournaments();
  },

  getById: async (id) => {
    const items = getStoredTournaments();
    return items.find(t => t.id === id) || null;
  },

  create: async (newTournament) => {
    const items = getStoredTournaments();
    const createdItem = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...newTournament
    };

    const updatedList = [createdItem, ...items];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return createdItem;
  },

  delete: async (id) => {
    const items = getStoredTournaments();
    const filtered = items.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};