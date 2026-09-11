import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Handshake,
  BarChart3,
  Building2,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { authService } from "../../services/authService";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export function SponsorSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Dashboard", path: "/sponsor/dashboard", icon: LayoutDashboard, end: true },
    { label: "Browse Tournaments", path: "/sponsor/tournaments", icon: Trophy },
    { label: "My Sponsorships", path: "/sponsor/sponsorships", icon: Handshake },
    { label: "ROI & Reach", path: "/sponsor/analytics", icon: BarChart3 },
  ];

  const bottomItems = [
    { label: "Company Profile", path: "/sponsor/profile", icon: Building2 },
  ];

  return (
    <aside className="w-64 theme-card theme-text min-h-screen flex flex-col justify-between border-r theme-border sticky top-0 h-screen transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b theme-border flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/25">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold theme-text tracking-wide text-base leading-tight">
              Nexus<span className="text-indigo-500">Play</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] theme-subtext font-semibold uppercase tracking-wider">
                Sponsor Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider theme-subtext mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/40"
                      : "theme-subtext hover:theme-text theme-hover hover:text-indigo-400"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Account / Profile Footer */}
      <div className="p-4 border-t theme-border space-y-1.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider theme-subtext mb-2">
          Brand Account
        </p>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/40"
                    : "theme-subtext hover:theme-text theme-hover hover:text-indigo-400"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer mt-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default SponsorSidebar;
