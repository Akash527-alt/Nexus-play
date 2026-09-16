import api from "./api";

const STORAGE_KEY_SPONSOR_PROFILE = "nexus_sponsor_profile";
const STORAGE_KEY_SPONSORSHIPS = "nexus_sponsorship_deals";

const DEFAULT_SPONSOR_PROFILE = {
  id: "spn_001",
  companyName: "Razer Gaming Tech",
  brandName: "Razer",
  industry: "Hardware & Peripherals",
  email: "partnerships@razer.com",
  phone: "+1 (415) 555-0199",
  website: "https://razer.com",
  description: "Global leading lifestyle brand for gamers. Empowering esports athletes and grassroot competitions worldwide.",
  budgetRange: "$25,000 - $50,000",
  preferredGames: ["Valorant", "CS:GO", "Apex Legends", "BGMI"],
  preferredLocations: ["North America", "South Asia", "Europe"],
  logoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
  status: "verified",
  createdAt: "2026-01-15T00:00:00Z",
};

const DEFAULT_SPONSORSHIPS = [
  {
    id: "deal_101",
    tournamentId: "t_01",
    tournamentTitle: "Nexus Invitational: Valorant Masters Season 1",
    game: "Valorant",
    tier: "Title Sponsor",
    amount: 5000,
    status: "active",
    organizerName: "Apex Gaming Club",
    organizerEmail: "apex@nexusplay.gg",
    date: "2026-08-10",
    deliverables: [
      "Stream overlay logo banner",
      "Main stage branding during finals",
      "Peripherals gear booth on venue",
      "3x daily social media shoutouts",
    ],
    audienceReach: "65,000+ Viewers",
    roiScore: "94%",
  },
  {
    id: "deal_102",
    tournamentId: "t_02",
    tournamentTitle: "BGMI Champions Series India 2026",
    game: "BGMI",
    tier: "Gold Partner",
    amount: 3000,
    status: "approved",
    organizerName: "Krypton Esports",
    organizerEmail: "contact@kryptonesports.in",
    date: "2026-09-01",
    deliverables: [
      "Logo in broadcast ticker",
      "Prize presentation co-naming",
      "Official hardware partner endorsement",
    ],
    audienceReach: "120,000+ Viewers",
    roiScore: "89%",
  },
  {
    id: "deal_103",
    tournamentId: "t_03",
    tournamentTitle: "CS2 Summer Showdown Pro League",
    game: "Counter-Strike 2",
    tier: "Silver Partner",
    amount: 1500,
    status: "pending",
    organizerName: "Vanguard Leagues",
    organizerEmail: "league@vanguard.io",
    date: "2026-09-05",
    deliverables: [
      "Logo on tournament landing page",
      "Discord announcement tag",
    ],
    audienceReach: "35,000+ Viewers",
    roiScore: "Pending",
  },
  {
    id: "deal_104",
    tournamentId: "t_04",
    tournamentTitle: "Free Fire Battle Royale Rush",
    game: "Free Fire",
    tier: "Community Booster",
    amount: 750,
    status: "completed",
    organizerName: "Firestorm Guild",
    organizerEmail: "admin@firestorm.gg",
    date: "2026-07-20",
    deliverables: [
      "Community prize pool top-up shoutout",
      "Logo on bracket stream",
    ],
    audienceReach: "28,000+ Viewers",
    roiScore: "91%",
  },
];

// Helper to get local data
const getLocalProfile = () => {
  const stored = localStorage.getItem(STORAGE_KEY_SPONSOR_PROFILE);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_SPONSOR_PROFILE, JSON.stringify(DEFAULT_SPONSOR_PROFILE));
    return DEFAULT_SPONSOR_PROFILE;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SPONSOR_PROFILE;
  }
};

const getLocalSponsorships = () => {
  const stored = localStorage.getItem(STORAGE_KEY_SPONSORSHIPS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_SPONSORSHIPS, JSON.stringify(DEFAULT_SPONSORSHIPS));
    return DEFAULT_SPONSORSHIPS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SPONSORSHIPS;
  }
};

const setLocalSponsorships = (data) => {
  localStorage.setItem(STORAGE_KEY_SPONSORSHIPS, JSON.stringify(data));
};

export const sponsorService = {
  // Get current sponsor profile
  getProfile: async () => {
    try {
      const res = await api.get("/sponsors/me");
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    return getLocalProfile();
  },

  // Update sponsor profile
  updateProfile: async (updatedData) => {
    try {
      const res = await api.put("/sponsors/me", updatedData);
      if (res.data?.success) {
        localStorage.setItem(STORAGE_KEY_SPONSOR_PROFILE, JSON.stringify(res.data.data));
        return res.data;
      }
    } catch {
      // Fallback
    }
    const current = getLocalProfile();
    const merged = { ...current, ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY_SPONSOR_PROFILE, JSON.stringify(merged));
    return { success: true, data: merged };
  },

  // Get list of sponsorships submitted by this sponsor
  getMySponsorships: async () => {
    try {
      const res = await api.get("/sponsors/sponsorships");
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    return getLocalSponsorships();
  },

  // Submit sponsorship offer for a tournament
  sponsorTournament: async (payload) => {
    try {
      const res = await api.post(`/tournaments/${payload.tournamentId}/sponsors`, payload);
      if (res.data?.success) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    const current = getLocalSponsorships();
    const newDeal = {
      id: "deal_" + Date.now(),
      tournamentId: payload.tournamentId,
      tournamentTitle: payload.tournamentTitle || "Championship Event",
      game: payload.game || "Esports",
      tier: payload.tier || "Gold Partner",
      amount: Number(payload.amount) || 1000,
      status: "pending",
      organizerName: payload.organizerName || "Tournament Host",
      organizerEmail: payload.organizerEmail || "organizer@nexusplay.gg",
      date: new Date().toISOString().split("T")[0],
      deliverables: payload.deliverables || [
        "Broadcast logo presence",
        "Stream banner advertisement",
        "Social media tags",
      ],
      audienceReach: payload.audienceReach || "45,000+ Viewers",
      roiScore: "Calculating",
      message: payload.message || "",
    };
    const updated = [newDeal, ...current];
    setLocalSponsorships(updated);
    return { success: true, data: newDeal };
  },

  // Get aggregated stats for sponsor dashboard
  getStats: async () => {
    const deals = getLocalSponsorships();
    const totalInvested = deals
      .filter((d) => d.status === "active" || d.status === "approved" || d.status === "completed")
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const activeCampaigns = deals.filter((d) => d.status === "active" || d.status === "approved").length;
    const completedCount = deals.filter((d) => d.status === "completed").length;
    const pendingProposals = deals.filter((d) => d.status === "pending").length;

    return {
      totalInvested,
      activeCampaigns,
      completedCount,
      pendingProposals,
      totalReach: "248,000+",
      averageRoi: "91.3%",
    };
  },

  // For Tournament Organizers: Get all incoming sponsor bids
  getOrganizerSponsorships: async () => {
    try {
      const res = await api.get("/organizer/sponsors");
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    return getLocalSponsorships();
  },

  // For Tournament Organizers: Approve or reject sponsor bid
  updateSponsorshipStatus: async (dealId, status) => {
    try {
      const res = await api.patch(`/organizer/sponsors/${dealId}/status`, { status });
      if (res.data?.success) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    const current = getLocalSponsorships();
    const updated = current.map((d) => (d.id === dealId ? { ...d, status } : d));
    setLocalSponsorships(updated);
    return { success: true, status };
  },
};

export default sponsorService;
