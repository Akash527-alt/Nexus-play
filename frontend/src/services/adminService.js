import api from "./api";

const STORAGE_KEY_ADMIN_USERS = "nexus_admin_users";
const STORAGE_KEY_ADMIN_ORGANIZERS = "nexus_admin_organizers";
const STORAGE_KEY_ADMIN_TOURNAMENTS = "nexus_admin_tournaments";
const STORAGE_KEY_ADMIN_PAYMENTS = "nexus_admin_payments";
const STORAGE_KEY_ADMIN_SETTINGS = "nexus_admin_settings";

const INITIAL_USERS = [
  {
    id: "usr_101",
    name: "Alex Mercer",
    email: "alex.player@nexusplay.gg",
    role: "user",
    status: "active",
    joinedDate: "2026-02-10",
    tournamentsJoined: 14,
    avatar: "AM",
  },
  {
    id: "usr_102",
    name: "Sarah Jenkins",
    email: "sarah@apexorganizers.com",
    role: "organizer",
    status: "active",
    joinedDate: "2026-01-18",
    tournamentsJoined: 0,
    avatar: "SJ",
  },
  {
    id: "usr_103",
    name: "Razer Sponsorship Lead",
    email: "partnerships@razer.com",
    role: "sponsor",
    status: "active",
    joinedDate: "2026-01-15",
    tournamentsJoined: 0,
    avatar: "RZ",
  },
  {
    id: "usr_104",
    name: "Vikram Malhotra",
    email: "vikram.gaming@gmail.com",
    role: "user",
    status: "suspended",
    joinedDate: "2026-03-02",
    tournamentsJoined: 3,
    avatar: "VM",
  },
  {
    id: "usr_105",
    name: "Super Administrator",
    email: "root@nexusplay.gg",
    role: "superadmin",
    status: "active",
    joinedDate: "2025-12-01",
    tournamentsJoined: 0,
    avatar: "SA",
  },
  {
    id: "usr_106",
    name: "Krypton Events Official",
    email: "contact@kryptonesports.in",
    role: "organizer",
    status: "active",
    joinedDate: "2026-02-22",
    tournamentsJoined: 0,
    avatar: "KE",
  },
  {
    id: "usr_107",
    name: "Marcus Cole",
    email: "marcus.c@gmail.com",
    role: "user",
    status: "active",
    joinedDate: "2026-04-11",
    tournamentsJoined: 9,
    avatar: "MC",
  },
];

const INITIAL_ORGANIZERS = [
  {
    id: "org_201",
    organizationName: "Apex Gaming Club",
    contactName: "Sarah Jenkins",
    email: "sarah@apexorganizers.com",
    phone: "+1 415-982-1200",
    organizationType: "Esports Club",
    status: "verified",
    tournamentsHosted: 8,
    createdAt: "2026-01-18",
  },
  {
    id: "org_202",
    organizationName: "Krypton Esports India",
    contactName: "Aarav Sharma",
    email: "contact@kryptonesports.in",
    phone: "+91 98765 43210",
    organizationType: "Tournament Organizer",
    status: "verified",
    tournamentsHosted: 5,
    createdAt: "2026-02-22",
  },
  {
    id: "org_203",
    organizationName: "Vanguard Collegiate League",
    contactName: "Elena Rostova",
    email: "league@vanguard.io",
    phone: "+44 20 7946 0912",
    organizationType: "University League",
    status: "pending",
    tournamentsHosted: 2,
    createdAt: "2026-03-14",
  },
  {
    id: "org_204",
    organizationName: "Shadow Rogue Arena",
    contactName: "Dave Chen",
    email: "admin@shadowrogue.gg",
    phone: "+1 650-333-8877",
    organizationType: "Community Host",
    status: "suspended",
    tournamentsHosted: 1,
    createdAt: "2026-04-01",
  },
];

const INITIAL_TOURNAMENTS = [
  {
    id: "t_01",
    title: "Nexus Invitational: Valorant Masters Season 1",
    game: "Valorant",
    organizer: "Apex Gaming Club",
    prizePool: 15000,
    teamsCount: 32,
    maxTeams: 32,
    status: "ongoing",
    featured: true,
    startDate: "2026-09-15",
  },
  {
    id: "t_02",
    title: "BGMI Champions Series India 2026",
    game: "BGMI",
    organizer: "Krypton Esports India",
    prizePool: 25000,
    teamsCount: 64,
    maxTeams: 128,
    status: "published",
    featured: true,
    startDate: "2026-10-01",
  },
  {
    id: "t_03",
    title: "CS2 Summer Showdown Pro League",
    game: "Counter-Strike 2",
    organizer: "Vanguard Collegiate League",
    prizePool: 10000,
    teamsCount: 16,
    maxTeams: 16,
    status: "published",
    featured: false,
    startDate: "2026-09-28",
  },
  {
    id: "t_04",
    title: "Free Fire Battle Royale Rush",
    game: "Free Fire",
    organizer: "Firestorm Guild",
    prizePool: 5000,
    teamsCount: 48,
    maxTeams: 48,
    status: "completed",
    featured: false,
    startDate: "2026-07-20",
  },
  {
    id: "t_05",
    title: "Overwatch 2 Campus Clash Weekend",
    game: "Overwatch 2",
    organizer: "Shadow Rogue Arena",
    prizePool: 3000,
    teamsCount: 8,
    maxTeams: 16,
    status: "pending",
    featured: false,
    startDate: "2026-10-10",
  },
];

const INITIAL_PAYMENTS = [
  {
    id: "pay_901",
    transactionId: "TXN_78493021",
    type: "Sponsorship Payout",
    entity: "Razer Gaming Tech",
    tournament: "Nexus Invitational: Valorant Masters",
    amount: 5000,
    method: "Wire / Bank Transfer",
    status: "success",
    date: "2026-08-10 14:32",
  },
  {
    id: "pay_902",
    transactionId: "TXN_88192043",
    type: "Registration Fee Pool",
    entity: "32 Competing Teams",
    tournament: "Nexus Invitational: Valorant Masters",
    amount: 3200,
    method: "Stripe Escrow",
    status: "success",
    date: "2026-08-15 09:12",
  },
  {
    id: "pay_903",
    transactionId: "TXN_99182312",
    type: "Sponsorship Payout",
    entity: "Red Bull Energy India",
    tournament: "BGMI Champions Series India 2026",
    amount: 3000,
    method: "Razorpay Corporate",
    status: "success",
    date: "2026-09-01 11:20",
  },
  {
    id: "pay_904",
    transactionId: "TXN_66372819",
    type: "Registration Refund",
    entity: "Team Phantom Wolves",
    tournament: "CS2 Summer Showdown Pro League",
    amount: 100,
    method: "Stripe Escrow",
    status: "refunded",
    date: "2026-09-04 18:45",
  },
  {
    id: "pay_905",
    transactionId: "TXN_44291039",
    type: "Prize Pool Payout",
    entity: "Firestorm Champions",
    tournament: "Free Fire Battle Royale Rush",
    amount: 5000,
    method: "Instant Escrow Release",
    status: "success",
    date: "2026-07-25 16:00",
  },
  {
    id: "pay_906",
    transactionId: "TXN_11092837",
    type: "Sponsorship Deposit",
    entity: "Logitech G Series",
    tournament: "CS2 Summer Showdown Pro League",
    amount: 1500,
    method: "Bank Transfer",
    status: "pending",
    date: "2026-09-05 10:15",
  },
];

const INITIAL_SETTINGS = {
  platformName: "NexusPlay Esports Engine",
  maintenanceMode: false,
  allowRegistrations: true,
  allowOrganizerApplications: true,
  platformCommissionPercent: 5,
  payoutHoldDays: 3,
  emailNotifications: true,
  smsGatewayActive: false,
  minPrizePoolAmount: 500,
  maxTournamentTeams: 256,
};

// Storage helper functions
const getStored = (key, fallback) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const adminService = {
  // Get platform overview statistics
  getDashboardStats: async () => {
    try {
      const res = await api.get("/admin/stats");
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const users = getStored(STORAGE_KEY_ADMIN_USERS, INITIAL_USERS);
    const organizers = getStored(STORAGE_KEY_ADMIN_ORGANIZERS, INITIAL_ORGANIZERS);
    const tournaments = getStored(STORAGE_KEY_ADMIN_TOURNAMENTS, INITIAL_TOURNAMENTS);
    const payments = getStored(STORAGE_KEY_ADMIN_PAYMENTS, INITIAL_PAYMENTS);

    const totalVolume = payments
      .filter((p) => p.status === "success")
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalUsers: users.length,
      totalOrganizers: organizers.length,
      totalTournaments: tournaments.length,
      activeTournaments: tournaments.filter((t) => t.status === "ongoing" || t.status === "published").length,
      totalSponsors: 14,
      totalVolume,
      serverUptime: "99.98%",
      pendingApprovals: 3,
      recentActivities: [
        { id: 1, action: "New User Registered", user: "Marcus Cole", time: "12m ago", type: "user" },
        { id: 2, action: "Tournament Created", user: "Krypton Esports", time: "35m ago", type: "tournament" },
        { id: 3, action: "Sponsorship Paid ($5,000)", user: "Razer Gaming Tech", time: "2h ago", type: "payment" },
        { id: 4, action: "KYC Verification Submitted", user: "Vanguard League", time: "4h ago", type: "organizer" },
      ],
    };
  },

  // Users Management
  getUsers: async () => {
    try {
      const res = await api.get("/admin/users");
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEY_ADMIN_USERS, INITIAL_USERS);
  },

  updateUserStatus: async (userId, status) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, { status });
      if (res.data?.success) return res.data;
    } catch {
      // Fallback
    }
    const users = getStored(STORAGE_KEY_ADMIN_USERS, INITIAL_USERS);
    const updated = users.map((u) => (u.id === userId ? { ...u, status } : u));
    setStored(STORAGE_KEY_ADMIN_USERS, updated);
    return { success: true, status };
  },

  updateUserRole: async (userId, role) => {
    const users = getStored(STORAGE_KEY_ADMIN_USERS, INITIAL_USERS);
    const updated = users.map((u) => (u.id === userId ? { ...u, role } : u));
    setStored(STORAGE_KEY_ADMIN_USERS, updated);
    return { success: true, role };
  },

  // Organizers Oversight
  getOrganizers: async () => {
    try {
      const res = await api.get("/admin/organizers");
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEY_ADMIN_ORGANIZERS, INITIAL_ORGANIZERS);
  },

  updateOrganizerStatus: async (orgId, status) => {
    try {
      const res = await api.patch(`/admin/organizers/${orgId}/status`, { status });
      if (res.data?.success) return res.data;
    } catch {
      // Fallback
    }
    const orgs = getStored(STORAGE_KEY_ADMIN_ORGANIZERS, INITIAL_ORGANIZERS);
    const updated = orgs.map((o) => (o.id === orgId ? { ...o, status } : o));
    setStored(STORAGE_KEY_ADMIN_ORGANIZERS, updated);
    return { success: true, status };
  },

  // Tournaments Moderation
  getTournaments: async () => {
    try {
      const res = await api.get("/admin/tournaments");
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEY_ADMIN_TOURNAMENTS, INITIAL_TOURNAMENTS);
  },

  updateTournamentStatus: async (tId, status) => {
    try {
      const res = await api.patch(`/admin/tournaments/${tId}/status`, { status });
      if (res.data?.success) return res.data;
    } catch {
      // Fallback
    }
    const tournaments = getStored(STORAGE_KEY_ADMIN_TOURNAMENTS, INITIAL_TOURNAMENTS);
    const updated = tournaments.map((t) => (t.id === tId ? { ...t, status } : t));
    setStored(STORAGE_KEY_ADMIN_TOURNAMENTS, updated);
    return { success: true, status };
  },

  toggleTournamentFeatured: async (tId) => {
    const tournaments = getStored(STORAGE_KEY_ADMIN_TOURNAMENTS, INITIAL_TOURNAMENTS);
    const updated = tournaments.map((t) => (t.id === tId ? { ...t, featured: !t.featured } : t));
    setStored(STORAGE_KEY_ADMIN_TOURNAMENTS, updated);
    return { success: true };
  },

  deleteTournament: async (tId) => {
    const tournaments = getStored(STORAGE_KEY_ADMIN_TOURNAMENTS, INITIAL_TOURNAMENTS);
    const updated = tournaments.filter((t) => t.id !== tId);
    setStored(STORAGE_KEY_ADMIN_TOURNAMENTS, updated);
    return { success: true };
  },

  // Payments & Ledger
  getPayments: async () => {
    try {
      const res = await api.get("/admin/payments");
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEY_ADMIN_PAYMENTS, INITIAL_PAYMENTS);
  },

  // Platform Reports
  getReports: async () => {
    try {
      const res = await api.get("/admin/reports");
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }
    return {
      gameBreakdown: [
        { game: "Valorant", count: 28, percentage: 38 },
        { game: "BGMI", count: 22, percentage: 30 },
        { game: "Counter-Strike 2", count: 14, percentage: 19 },
        { game: "Free Fire", count: 6, percentage: 8 },
        { game: "Apex Legends", count: 4, percentage: 5 },
      ],
      monthlyRevenue: [
        { month: "May", amount: 18500 },
        { month: "Jun", amount: 24200 },
        { month: "Jul", amount: 31000 },
        { month: "Aug", amount: 48900 },
        { month: "Sep", amount: 56400 },
      ],
      userGrowth: [
        { month: "May", users: 450 },
        { month: "Jun", users: 890 },
        { month: "Jul", users: 1540 },
        { month: "Aug", users: 2450 },
        { month: "Sep", users: 3820 },
      ],
      totalCommissionEarned: 2820,
    };
  },

  // System Settings
  getSettings: async () => {
    return getStored(STORAGE_KEY_ADMIN_SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings: async (newSettings) => {
    const current = getStored(STORAGE_KEY_ADMIN_SETTINGS, INITIAL_SETTINGS);
    const updated = { ...current, ...newSettings };
    setStored(STORAGE_KEY_ADMIN_SETTINGS, updated);
    return { success: true, data: updated };
  },
};

export default adminService;
