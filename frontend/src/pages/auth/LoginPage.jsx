import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Gamepad2, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext.jsx";

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
    <div className="min-h-screen bg-[#070B1A] text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-600/20">
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Nexus<span className="text-indigo-500">Play</span>
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Tournament management & esports platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D1326] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-1">
              Sign in with your email and password
            </p>
          </div>

      

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-300"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-11 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Registration Links */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Need an account? Choose your profile:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <Link
                to="/register"
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
              >
                Player
              </Link>
              <Link
                to="/register/organizer"
                className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/50 transition"
              >
                 Organizer
              </Link>
              <Link
                to="/register/sponsor"
                className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400 hover:bg-purple-900/50 transition"
              >
                Sponsor (Make Sponsor ID)
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © {new Date().getFullYear()} NexusPlay Esports
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
