export const tournamentService = {
  getAll: async () => {
    return [
      {
        id: '1',
        title: 'BGMI Championship Series',
        game: 'BGMI',
        tournamentType: 'team',
        description: 'Pro level esports tournament.',
        rules: 'Standard BGMI Esports rules apply.',
        venue: 'Online Custom Room',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        registrationDeadline: '2026-08-30',
        entryFee: 500,
        maxParticipants: 32,
        teamSize: 4,
        currentParticipants: 16,
        status: 'published',
        bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80'
      }
    ];
  }
};