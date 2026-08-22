export const tournamentService = {
  getAll: async () => {
    // Dynamic data structure array format
    return [
      {
        id: '1',
        name: 'PUBG Mobile Open Championship',
        game: 'BGMI',
        startDate: '2026-09-01',
        status: 'Live',
        registeredTeams: 16,
        maxTeams: 32,
        totalPrizePool: 50000,
        bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80'
      },
      {
        id: '2',
        name: 'Valorant Community Clash',
        game: 'Valorant',
        startDate: '2026-09-10',
        status: 'Upcoming',
        registeredTeams: 8,
        maxTeams: 16,
        totalPrizePool: 25000,
        bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&q=80'
      }
    ];
  }
};