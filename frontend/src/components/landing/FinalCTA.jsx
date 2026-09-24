import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import footerBanner from "../../assets/landing/footer-bg.png";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-y border-white/10">
      <img
        src={footerBanner}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-[#050A18]/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050A18]/80 via-transparent to-[#050A18]/80" />

      <div className="relative mx-auto flex min-h-[190px] max-w-7xl items-center justify-center px-5 py-10 text-center">
        <div>
          <h2 className="text-2xl font-black sm:text-4xl">
            Ready to enter the arena?
          </h2>

          <p className="mt-2 text-[10px] text-slate-300 sm:text-xs">
            Join thousands of players, organizers and sponsors on NexusPlay.
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <a
              href="#tournaments"
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-[10px] font-bold transition hover:bg-indigo-500 sm:px-5 sm:py-2.5 sm:text-xs"
            >
              Explore Tournaments
              <ArrowRight className="h-3 w-3" />
            </a>

            <Link
              to="/register"
              className="rounded-md border border-white/30 bg-black/20 px-4 py-2 text-[10px] font-semibold backdrop-blur-sm transition hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-xs"
            >
              Join NexusPlay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
