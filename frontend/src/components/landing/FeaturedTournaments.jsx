import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import valorantImage from "../../assets/landing/tournament-valorant.png";
import bgmiImage from "../../assets/landing/tournament-bgmi.png";
import cs2Image from "../../assets/landing/tournament-cs2.png";
import freeFireImage from "../../assets/landing/tournament-free-fire.png";

const tournaments = [
  {
    title: "NexusPlay Valorant Open",
    game: "VALORANT",
    venue: "Mumbai, MH",
    date: "28 Sep 2026",
    prize: "₹50,000",
    image: valorantImage,
  },
  {
    title: "NexusPlay BGMI Cup",
    game: "BGMI",
    venue: "Online",
    date: "30 Sep 2026",
    prize: "₹1,00,000",
    image: bgmiImage,
  },
  {
    title: "NexusPlay CS2 Invitational",
    game: "CS2",
    venue: "Bangalore, KA",
    date: "05 Oct 2026",
    prize: "₹75,000",
    image: cs2Image,
  },
  {
    title: "NexusPlay Free Fire Cup",
    game: "FREE FIRE",
    venue: "Online",
    date: "12 Oct 2026",
    prize: "₹25,000",
    image: freeFireImage,
  },
];

export default function FeaturedTournaments() {
  return (
    <section
      id="tournaments"
      className="border-b border-white/10 bg-[#050A18] py-10 sm:py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
              Featured Tournaments
            </h2>

            <p className="mt-1 text-[10px] text-slate-400 sm:text-xs lg:text-sm">
              Join upcoming tournaments and showcase your skills.
            </p>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 sm:text-xs lg:text-sm"
          >
            View All
            <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5">
          {tournaments.map((tournament) => (
            <div
              key={tournament.title}
              className="overflow-hidden rounded-xl border border-indigo-500/20 bg-[#091122] transition hover:-translate-y-1 hover:border-indigo-500/50"
            >
              <div className="relative h-36 overflow-hidden sm:h-40 lg:h-44">
                <img
                  src={tournament.image}
                  alt={tournament.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-transparent to-transparent" />
              </div>

              <div className="p-3 lg:p-4">
                <p className="text-[9px] font-semibold text-indigo-400 lg:text-[10px]">
                  {tournament.game}
                </p>

                <h3 className="mt-1 text-xs font-bold lg:text-sm">
                  {tournament.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-[9px] text-slate-400 lg:text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-indigo-400 lg:h-3.5 lg:w-3.5" />
                    {tournament.venue}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3 text-purple-400 lg:h-3.5 lg:w-3.5" />
                    {tournament.date}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                  <div>
                    <p className="text-[8px] text-slate-500 lg:text-[9px]">
                      Prize Pool
                    </p>

                    <p className="text-xs font-bold text-yellow-400 lg:text-sm">
                      {tournament.prize}
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="rounded-md border border-indigo-500/40 px-2.5 py-1.5 text-[9px] font-semibold text-indigo-300 transition hover:bg-indigo-500/10 lg:px-3 lg:py-2 lg:text-[10px]"
                  >
                    View Tournament
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
