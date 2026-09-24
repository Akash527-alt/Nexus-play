import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Gamepad2,
  Loader2,
  Trophy,
  Users,
  Swords,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext.jsx";
import loginBg from "../../assets/landing/login-bg.png";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await login(formData);

      if (!data?.success) {
        toast.error(data?.message || "Login failed");
        return;
      }

      toast.success("Login successful");

      const role = data.user?.role;

      if (role === "organizer") {
        navigate("/organizer/dashboard", { replace: true });
      } else if (role === "superadmin" || role === "admin") {
        navigate("/superadmin/dashboard", { replace: true });
      } else if (role === "sponsor") {
        navigate("/sponsor/dashboard", { replace: true });
      } else {
        navigate("/participant/dashboard", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to login. Please check your credentials.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A18] px-4 py-6 text-white sm:px-6 lg:flex lg:items-center lg:justify-center lg:px-8 lg:py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700/70 bg-[#080F20] shadow-2xl shadow-black/40 lg:min-h-[600px]">
        <div className="grid min-h-[600px] lg:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="relative min-h-[420px] overflow-hidden sm:min-h-[460px] lg:min-h-full">
            <img
              src={loginBg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/20 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080F20]/10 lg:to-[#080F20]/20" />

            <div className="relative flex h-full flex-col items-center justify-end px-6 pb-8 text-center sm:px-10 sm:pb-10 lg:px-12 lg:pb-12">
              <div className="w-full max-w-lg">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-xl shadow-indigo-600/30 sm:h-14 sm:w-14">
                    <Gamepad2 className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                  </div>

                  <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                    Nexus<span className="text-indigo-500">Play</span>
                  </h1>

                  <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                    Welcome Back
                  </h2>

                  <p className="mt-2 text-sm text-slate-300 sm:text-base">
                    Sign in to continue to your account.
                  </p>
                </div>

                <div className="mx-auto mt-12 max-w-md space-y-4 text-left sm:mt-34">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 sm:h-11 sm:w-11">
                      <Trophy className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white sm:text-base">
                        Discover tournaments
                      </p>

                      <p className="text-xs text-slate-400 sm:text-sm">
                        Explore exciting esports events.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400 sm:h-11 sm:w-11">
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white sm:text-base">
                        Compete with players
                      </p>

                      <p className="text-xs text-slate-400 sm:text-sm">
                        Join a growing esports community.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 sm:h-11 sm:w-11">
                      <Swords className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white sm:text-base">
                        Build your esports journey
                      </p>

                      <p className="text-xs text-slate-400 sm:text-sm">
                        Track your progress and achievements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — FORM */}
          <div className="flex items-center bg-[#080F20] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-7 text-center lg:text-left">
                <h2 className="text-3xl font-bold">Sign In</h2>

                <p className="mt-1.5 text-sm text-slate-400">
                  Enter your credentials to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-lg border border-slate-700 bg-[#050A18] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-slate-700 bg-[#050A18] py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 transition hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-indigo-400 transition hover:text-indigo-300"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3.5 text-sm font-bold shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-7 border-t border-white/5 pt-5 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="ml-1 font-semibold text-indigo-400 transition hover:text-indigo-300"
                  >
                    Create Account
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

export default LoginPage;
