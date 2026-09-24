import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturedTournaments from "../components/landing/FeaturedTournaments";
import FinalCTA from "../components/landing/FinalCTA";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050A18] text-white">
      <LandingNavbar />

      <main>
        <HeroSection />

        <FeaturedTournaments />

        <section
          id="about"
          className="border-b border-white/10 bg-[#07101F] py-14 lg:py-20"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 sm:text-xs lg:text-sm">
                About NexusPlay
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
                One platform for the esports ecosystem.
              </h2>

              <p className="mt-3 text-xs leading-6 text-slate-400 sm:text-sm sm:leading-6 lg:text-base lg:leading-7">
                NexusPlay is an esports tournament management platform
                connecting players, tournament organizers and sponsors in one
                unified ecosystem.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-5">
              <div className="rounded-xl border border-indigo-500/20 bg-[#091122] p-5 lg:p-6">
                <div className="mb-4 text-2xl lg:text-3xl">🎮</div>

                <h3 className="text-sm font-bold lg:text-lg">Players</h3>

                <p className="mt-2 text-[10px] leading-5 text-slate-400 lg:text-sm lg:leading-6">
                  Discover tournaments, register and compete in games you love.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-[#091122] p-5 lg:p-6">
                <div className="mb-4 text-2xl lg:text-3xl">🏆</div>

                <h3 className="text-sm font-bold lg:text-lg">Organizers</h3>

                <p className="mt-2 text-[10px] leading-5 text-slate-400 lg:text-sm lg:leading-6">
                  Create tournaments, manage registrations and organize esports
                  events.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-[#091122] p-5 lg:p-6">
                <div className="mb-4 text-2xl lg:text-3xl">🤝</div>

                <h3 className="text-sm font-bold lg:text-lg">Sponsors</h3>

                <p className="mt-2 text-[10px] leading-5 text-slate-400 lg:text-sm lg:leading-6">
                  Connect your brand with tournaments and support the esports
                  ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-b border-white/10 bg-[#050A18] py-14 lg:py-20"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 sm:text-xs lg:text-sm">
              Simple Process
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
              How NexusPlay Works
            </h2>

            <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-400 sm:text-xs lg:text-sm lg:leading-6">
              A simple and seamless experience for everyone in the esports
              ecosystem.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-5">
              <div className="rounded-xl border border-white/10 bg-[#091122] p-5 lg:p-6">
                <span className="text-2xl font-black text-indigo-500/30 lg:text-3xl">
                  01
                </span>

                <h3 className="mt-4 text-sm font-bold lg:text-lg">
                  Create Account
                </h3>

                <p className="mt-2 text-[10px] leading-5 text-slate-400 lg:text-sm lg:leading-6">
                  Join NexusPlay as a player, organizer or sponsor.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#091122] p-5 lg:p-6">
                <span className="text-2xl font-black text-indigo-500/30 lg:text-3xl">
                  02
                </span>

                <h3 className="mt-4 text-sm font-bold lg:text-lg">
                  Find Your Opportunity
                </h3>

                <p className="mt-2 text-[10px] leading-5 text-slate-400 lg:text-sm lg:leading-6">
                  Discover tournaments, players and esports opportunities.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#091122] p-5 lg:p-6">
                <span className="text-2xl font-black text-indigo-500/30 lg:text-3xl">
                  03
                </span>

                <h3 className="mt-4 text-sm font-bold lg:text-lg">
                  Compete & Connect
                </h3>

                <p className="mt-2 text-[10px] leading-5 text-slate-400 lg:text-sm lg:leading-6">
                  Register, compete, organize or support the esports community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#07101F] py-10 lg:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
              {[
                "🎮 Multiple Games",
                "🔎 Tournament Discovery",
                "📝 Easy Registration",
                "🛡️ Verified Organizers",
                "🤝 Sponsor Opportunities",
                "⚡ Centralized Management",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-[#091122] px-3 py-3 text-center text-[9px] font-semibold text-slate-300 lg:px-4 lg:py-4 lg:text-xs"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>

      <footer className="border-t border-white/10 bg-[#030711]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-base font-bold sm:text-lg">
                Nexus<span className="text-indigo-500">Play</span>
              </p>

              <p className="mt-1 text-[9px] text-slate-500 sm:text-[10px]">
                Compete. Connect. Conquer.
              </p>

              <p className="mt-4 max-w-xs text-[9px] leading-5 text-slate-600 sm:text-[10px]">
                A unified esports platform connecting players, organizers and
                sponsors.
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold text-white sm:text-xs lg:text-sm">
                Platform
              </h3>

              <div className="mt-3 space-y-2.5">
                <a
                  href="#tournaments"
                  className="block text-[9px] text-slate-500 transition hover:text-slate-300 sm:text-[10px] lg:text-xs"
                >
                  Tournaments
                </a>

                <a
                  href="#about"
                  className="block text-[9px] text-slate-500 transition hover:text-slate-300 sm:text-[10px] lg:text-xs"
                >
                  About
                </a>

                <a
                  href="#how-it-works"
                  className="block text-[9px] text-slate-500 transition hover:text-slate-300 sm:text-[10px] lg:text-xs"
                >
                  How It Works
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold text-white sm:text-xs lg:text-sm">
                Support
              </h3>

              <div className="mt-3 space-y-2.5">
                <Link
                  to="/help-center"
                  className="block text-[9px] text-slate-500 transition hover:text-slate-300 sm:text-[10px] lg:text-xs"
                >
                  Help Center
                </Link>

                <Link
                  to="/contact-us"
                  className="block text-[9px] text-slate-500 transition hover:text-slate-300 sm:text-[10px] lg:text-xs"
                >
                  Contact Us
                </Link>

                <Link
                  to="/privacy-policy"
                  className="block text-[9px] text-slate-500 transition hover:text-slate-300 sm:text-[10px] lg:text-xs"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold text-white sm:text-xs lg:text-sm">
                Follow Us
              </h3>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="#"
                  aria-label="Discord"
                  className="text-sm text-slate-500 transition hover:text-indigo-400 lg:text-base"
                >
                  🎮
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-sm text-slate-500 transition hover:text-pink-400 lg:text-base"
                >
                  📷
                </a>

                <a
                  href="#"
                  aria-label="X"
                  className="text-sm text-slate-500 transition hover:text-sky-400 lg:text-base"
                >
                  𝕏
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-sm text-slate-500 transition hover:text-red-400 lg:text-base"
                >
                  ▶
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-[9px] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:text-[10px] lg:text-xs">
            <p>© {new Date().getFullYear()} NexusPlay. All rights reserved.</p>

            <p>Built for the Esports Community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


