import {
  Gamepad2,
  CalendarDays,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import loginBg from "../../assets/landing/login-bg.png";

const roles = [
  {
    title: "Player",
    description: "Compete in tournaments and showcase your skills.",
    icon: Gamepad2,
    path: "/register/player",
    iconClass: "bg-indigo-500/15 text-indigo-400",
  },
  {
    title: "Organizer",
    description: "Host and manage esports tournaments.",
    icon: CalendarDays,
    path: "/register/organizer",
    iconClass: "bg-cyan-500/15 text-cyan-400",
  },
  {
    title: "Sponsor",
    description: "Support tournaments and connect with the community.",
    icon: Handshake,
    path: "/register/sponsor",
    iconClass: "bg-purple-500/15 text-purple-400",
  },
];

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#171C22] text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#050A18] shadow-2xl">
        <div className="grid min-h-[520px] md:grid-cols-[34%_66%]">
          <div className="relative min-h-[250px] overflow-hidden md:min-h-[520px]">
            <img
              src={loginBg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/35 to-transparent" />

            <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                  <Gamepad2 className="h-4 w-4 text-white" />
                </div>

                <span className="text-sm font-bold">
                  Nexus<span className="text-indigo-400">Play</span>
                </span>
              </div>

              <h1 className="text-2xl font-black sm:text-3xl">
                Join NexusPlay
              </h1>

              <p className="mt-2 text-[11px] leading-5 text-slate-300 sm:text-xs">
                How do you want to participate?
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-8 md:p-10">
            <div className="mx-auto w-full max-w-2xl md:max-w-3xl">
              <div className="grid gap-3 sm:grid-cols-3 md:gap-5">
                {roles.map((role) => {
                  const Icon = role.icon;

                  return (
                    <div
                      key={role.title}
                      className="group rounded-xl border border-white/10 bg-[#091122] p-4 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 sm:p-5 md:p-7"
                    >
                      <div
                        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${role.iconClass} md:h-14 md:w-14`}
                      >
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>

                      <h2 className="mt-4 text-center text-sm font-bold sm:text-base md:mt-5 md:text-lg">
                        {role.title}
                      </h2>

                      <p className="mt-2 min-h-[42px] text-center text-[9px] leading-4 text-slate-400 sm:text-[10px] md:min-h-[48px] md:text-sm md:leading-5">
                        {role.description}
                      </p>

                      <Link
                        to={role.path}
                        className="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-indigo-500 sm:text-[10px] md:mt-5 md:py-2.5 md:text-sm"
                      >
                        Register as {role.title}
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <p className="text-[10px] text-slate-500 sm:text-xs">
                  Already have an account?
                  <Link
                    to="/login"
                    className="ml-1 font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;