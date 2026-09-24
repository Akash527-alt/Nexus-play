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
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export function SuperAdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Super admin logged out");
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/superadmin/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Players",
      path: "/superadmin/users",
      icon: Users,
    },
    {
      label: "Organizers KYC",
      path: "/superadmin/organizers",
      icon: Building2,
    },
    {
      label: "Tournaments",
      path: "/superadmin/tournaments",
      icon: Trophy,
    },
    {
      label: "Corporate Sponsors",
      path: "/superadmin/sponsors",
      icon: Handshake,
    },
    {
      label: "Sponsorships",
      path: "/superadmin/sponsorships",
      icon: Handshake,
    },
    {
      label: "Payments & Escrow",
      path: "/superadmin/payments",
      icon: CreditCard,
    },
    // {
    //   label: "Platform Reports",
    //   path: "/superadmin/reports",
    //   icon: BarChart3,
    // },
    // {
    //   label: "System Settings",
    //   path: "/superadmin/settings",
    //   icon: Settings,
    // },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`theme-card theme-text fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col justify-between border-r theme-border transition-transform duration-300 lg:sticky lg:z-40 lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between border-b theme-border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 font-black text-white shadow-md shadow-rose-600/30">
                <ShieldAlert className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-extrabold leading-tight tracking-wider theme-text">
                  Nexus<span className="text-rose-500">Admin</span>
                </h2>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />

                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    Root Access
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 theme-subtext transition hover:bg-rose-500/10 hover:text-rose-400 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1 p-4">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider theme-subtext">
              Governance Suite
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-rose-600 text-white shadow-sm shadow-rose-600/40"
                        : "theme-subtext hover:bg-rose-500/10 hover:text-rose-400"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t theme-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Exit Admin Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SuperAdminSidebar;
