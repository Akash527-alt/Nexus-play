import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, Gamepad2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const data = await register({
        name,
        email,
        password,
      });

      if (!data?.success) {
        toast.error(data?.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully");

      navigate("/user/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Unable to create account";

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
            Join the tournament community
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-[#0D1326] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-7">
            <h2 className="text-xl font-bold">Create your account</h2>

            <p className="text-sm text-slate-400 mt-1">
              Register as a player on NexusPlay
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
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
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3 mt-2 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Organizer Registration */}
          <div className="mt-6 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <p className="text-sm font-semibold text-white">
              Want to organize tournaments?
            </p>

            <p className="text-xs text-slate-400 mt-1 mb-3">
              Create an organizer account and manage your own tournaments.
            </p>

            <Link
              to="/register/organizer"
              className="text-sm text-indigo-400 font-semibold hover:text-indigo-300 transition"
            >
              Create Organizer Account →
            </Link>
          </div>

          {/* Login */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 font-semibold hover:text-indigo-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © {new Date().getFullYear()} NexusPlay Esports
        </p>
      </div>
    </div>
  );
}
