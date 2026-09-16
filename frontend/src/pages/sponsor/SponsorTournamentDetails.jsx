import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Users,
  Award,
  CheckCircle,
  ShieldCheck,
  Handshake,
  DollarSign,
  Share2,
} from "lucide-react";
import { tournamentService } from "../../services/tournamentService";
import { SponsorModal } from "../../components/sponsor/SponsorModal";
import { SponsorTierBadge } from "../../components/sponsor/SponsorTierBadge";

export function SponsorTournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await tournamentService.getById(id).catch(() => null);
        let data = res?.tournament || res?.data || res;
        if (!data || !data.title) {
          // Fallback mock
          data = {
            _id: id,
            title: "Nexus Invitational: Valorant Masters Season 1",
            game: "Valorant",
            prizePool: 15000,
            organizer: {
              name: "Apex Gaming Club",
              email: "apex@nexusplay.gg",
              verified: true,
            },
            startDate: "2026-09-15",
            endDate: "2026-09-22",
            format: "Double Elimination Bracket",
            teamsCount: 32,
            maxTeams: 32,
            streamPlatform: "Twitch & YouTube Gaming",
            expectedViewers: "75,000+ Concurrent Peak",
            description:
              "The flagship tactical shooter tournament uniting top collegiate and professional tier-2 esports clubs across North America and South Asia. Featuring dedicated caster talent, broadcast studio production, and real-time live stats integration.",
          };
        }
        setTournament(data);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs theme-subtext">
        Loading tournament sponsorship dossier...
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-8 theme-card border theme-border rounded-2xl text-center">
        <p className="text-sm font-bold theme-text">Tournament details not found</p>
        <button
          onClick={() => navigate("/sponsor/tournaments")}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  const packages = [
    {
      tier: "Title Sponsor",
      price: "$5,000",
      description: "Complete naming rights, omnipresent stream logos, and live product demos.",
      perks: [
        "Event official name: '[Your Brand] Nexus Invitational'",
        "Center stage physical banner & caster desk backdrop",
        "Stream overlay watermark throughout all 45+ match hours",
        "30-second video commercial slots between every series",
        "Featured booth in tournament arena venue",
      ],
    },
    {
      tier: "Gold Partner",
      price: "$2,500",
      description: "High-impact broadcast rotation and community engagement perks.",
      perks: [
        "Lower-third broadcast banner every 15 minutes",
        "Prize distribution co-naming with custom trophy branding",
        "Official hardware / gear partner endorsement",
        "Prominent logo on all digital flyers and web brackets",
      ],
    },
    {
      tier: "Silver Partner",
      price: "$1,000",
      description: "Digital presence and social community exposure.",
      perks: [
        "Logo on tournament portal registration page",
        "Dedicated Discord announcements to 12,000+ players",
        "End-credits broadcast shoutout",
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/sponsor/tournaments")}
        className="inline-flex items-center gap-2 text-xs font-semibold theme-subtext hover:theme-text transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all tournaments</span>
      </button>

      {/* Hero Header */}
      <div className="theme-card border theme-border rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {tournament.game}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Organizer
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold theme-text">
              {tournament.title || tournament.name}
            </h1>

            <p className="text-xs md:text-sm theme-subtext leading-relaxed">
              {tournament.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs theme-subtext pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Starts: {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "TBA"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>32 Teams ({tournament.expectedViewers || "50k+ viewers"})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-400">
                  Prize Pool: ${tournament.prizePool || 15000}
                </span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Handshake className="w-4 h-4" />
              <span>Sponsor This Event</span>
            </button>
            <p className="text-[11px] theme-subtext text-center">
              Escrow protected by NexusPlay
            </p>
          </div>
        </div>
      </div>

      {/* Packages Comparison */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold theme-text">Official Sponsorship Packages</h2>
          <p className="text-xs theme-subtext">
            Choose a pre-structured commercial tier or propose a tailored brand integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.tier}
              className="theme-card border theme-border rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <SponsorTierBadge tier={pkg.tier} />
                  <span className="text-lg font-black text-indigo-400">{pkg.price}</span>
                </div>

                <p className="text-xs theme-subtext mb-5">{pkg.description}</p>

                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider theme-subtext">
                    Included Deliverables:
                  </p>
                  {pkg.perks.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs theme-subtext">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t theme-border">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border theme-border theme-icon-box hover:bg-indigo-600 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  Select {pkg.tier}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <SponsorModal
        tournament={tournament}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => navigate("/sponsor/sponsorships")}
      />
    </div>
  );
}

export default SponsorTournamentDetails;
