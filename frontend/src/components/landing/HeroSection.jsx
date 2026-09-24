import { ArrowRight, Trophy, Users, Building2, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "../../assets/landing/hero.png";

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Active Players",
  },
  {
    icon: Trophy,
    value: "500+",
    label: "Tournaments",
  },
  {
    icon: Building2,
    value: "100+",
    label: "Organizers",
  },
  {
    icon: Handshake,
    value: "50+",
    label: "Sponsors",
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[650px] overflow-hidden border-b border-white/10 bg-[#050A18] lg:min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050A18] via-[#050A18]/75 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-transparent to-[#050A18]/30" />
      </div>

      <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-end px-5 pb-8 pt-24 sm:px-8 lg:min-h-[720px] lg:px-10 lg:pb-12 lg:pt-28">
        <div className="w-full">
          <div className="max-w-xl lg:max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 sm:text-xs lg:text-sm">
              India's Esports Tournament Platform
            </p>

            <h1 className="mt-3 text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              Compete.
              <br />
              Connect.
              <br />
              <span className="text-indigo-500">Conquer.</span>
            </h1>

            <p className="mt-5 max-w-lg text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6 lg:max-w-xl lg:text-base lg:leading-7">
              Discover and participate in exciting esports tournaments. Connect
              with players, organizers and sponsors — all in one platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#tournaments"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 sm:px-6 sm:py-3 lg:px-7 lg:py-3.5 lg:text-sm"
              >
                Explore Tournaments
                <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </a>

              <Link
                to="/register"
                className="rounded-lg border border-white/20 bg-black/20 px-4 py-2.5 text-xs font-semibold backdrop-blur-sm transition hover:bg-white/10 sm:px-6 sm:py-3 lg:px-7 lg:py-3.5 lg:text-sm"
              >
                Create an Account
              </Link>
            </div>
          </div>

          <div className="mt-9 grid max-w-3xl grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-4 lg:mt-12 lg:max-w-4xl lg:gap-8 lg:pt-6">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-2.5 lg:gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 lg:h-10 lg:w-10">
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold lg:text-lg">{stat.value}</p>

                    <p className="text-[9px] text-slate-500 sm:text-[10px] lg:text-xs">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
