import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Trophy,
  Handshake,
  CreditCard,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  Cpu,
} from "lucide-react";
import { authService } from "../../services/authService";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export function SuperAdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Super admin logged out");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Dashboard", path: "/superadmin/dashboard", icon: LayoutDashboard, end: true },
    { label: "Users Directory", path: "/superadmin/users", icon: Users },
    { label: "Organizers KYC", path: "/superadmin/organizers", icon: Building2 },
    { label: "Tournaments", path: "/superadmin/tournaments", icon: Trophy },
    { label: "Corporate Sponsors", path: "/superadmin/sponsors", icon: Handshake },
    { label: "Payments & Escrow", path: "/superadmin/payments", icon: CreditCard },
    { label: "Platform Reports", path: "/superadmin/reports", icon: BarChart3 },
    { label: "System Settings", path: "/superadmin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 theme-card theme-text min-h-screen flex flex-col justify-between border-r theme-border sticky top-0 h-screen transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b theme-border flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-rose-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-rose-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold theme-text tracking-wider text-base leading-tight">
              Nexus<span className="text-rose-500">Admin</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                Root Access
              </p>
            </div>
          </div>
        </div>

        {/* System Navigation */}
        <nav className="p-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider theme-subtext mb-2">
            Governance Suite
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-rose-600 text-white shadow-sm shadow-rose-600/40"
                      : "theme-subtext hover:theme-text theme-hover hover:text-rose-400"
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

      {/* Footer System Status & Logout */}
      <div className="p-4 border-t theme-border space-y-2">
        <div className="p-2.5 rounded-xl theme-icon-box border theme-border flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-semibold theme-text">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Node v20 · 99.98%</span>
          </span>
          <span className="text-emerald-400 font-bold">LIVE</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;
