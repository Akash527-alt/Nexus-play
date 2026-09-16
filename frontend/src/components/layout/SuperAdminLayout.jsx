import React, { useState, useEffect, useRef } from "react";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  X,
  ShieldCheck,
  AlertTriangle,
  Info,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function SuperAdminLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const searchRef = useRef(null);
  const bellRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "KYC Verification Needed",
      desc: "Vanguard Collegiate League submitted official organization papers.",
      time: "15m ago",
      type: "alert",
      unread: true,
    },
    {
      id: 2,
      title: "Escrow Deposit Confirmed",
      desc: "$5,000 received from Razer Gaming Tech for Valorant Masters.",
      time: "1h ago",
      type: "success",
      unread: true,
    },
    {
      id: 3,
      title: "New Flagged Report",
      desc: "User Vikram Malhotra flagged for multi-account abuse.",
      time: "3h ago",
      type: "alert",
      unread: false,
    },
  ]);

  const searchableItems = [
    { type: "Module", name: "Users Directory", link: "/superadmin/users" },
    { type: "Module", name: "Organizers KYC", link: "/superadmin/organizers" },
    { type: "Module", name: "Tournaments Moderation", link: "/superadmin/tournaments" },
    { type: "Module", name: "Corporate Sponsors", link: "/superadmin/sponsors" },
    { type: "Module", name: "Payments & Escrow", link: "/superadmin/payments" },
    { type: "Module", name: "Platform Reports", link: "/superadmin/reports" },
    { type: "Module", name: "Platform Settings", link: "/superadmin/settings" },
  ];

  const filteredSearch =
    searchQuery.trim() === ""
      ? []
      : searchableItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasUnread = notifications.some((n) => n.unread);

  return (
    <div className="flex min-h-screen w-full transition-colors duration-200 theme-bg theme-text">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="shrink-0 transition-all duration-300 z-40">
          <SuperAdminSidebar />
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header className="theme-header h-16 border-b theme-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 theme-icon-box border theme-border rounded-lg text-sm theme-text hover:bg-rose-500/10 transition cursor-pointer"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Quick Command Search */}
            <div className="relative w-48 md:w-72" ref={searchRef}>
              <Search className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Global command & module search..."
                className="theme-input w-full pl-9 pr-8 py-1.5 text-xs border theme-border rounded-lg outline-none focus:ring-2 focus:ring-rose-500/20 bg-transparent"
              />
              {searchQuery && (
                <X
                  onClick={() => setSearchQuery("")}
                  className="w-3.5 h-3.5 theme-subtext hover:opacity-100 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                />
              )}

              {/* Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="theme-card absolute top-full left-0 mt-2 w-80 border theme-border rounded-xl shadow-xl p-2 z-50">
                  <p className="text-[10px] font-bold theme-subtext uppercase px-2 py-1">
                    Direct Navigation
                  </p>
                  {filteredSearch.length > 0 ? (
                    <div className="space-y-1">
                      {filteredSearch.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            navigate(item.link);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="theme-hover p-2 rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <span className="text-xs font-semibold theme-text">
                            {item.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-600 text-white font-bold">
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs theme-subtext p-2 text-center">
                      No matching modules found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-hover p-2 theme-subtext hover:theme-text rounded-lg transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setIsBellOpen(!isBellOpen)}
                className="theme-hover p-2 theme-subtext hover:theme-text rounded-lg relative cursor-pointer transition-colors"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="w-2 h-2 bg-rose-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {isBellOpen && (
                <div className="theme-card absolute right-0 mt-2 w-80 border theme-border rounded-2xl shadow-xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b theme-border pb-2">
                    <h3 className="text-xs font-bold theme-text">System Alerts</h3>
                    <button
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                      className="text-[10px] text-rose-400 font-semibold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl border theme-border text-xs flex gap-2.5"
                      >
                        {n.type === "alert" ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold theme-text leading-tight">{n.title}</p>
                          <p className="text-[11px] theme-subtext mt-0.5">{n.desc}</p>
                          <span className="text-[9px] theme-subtext mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

            {/* Root Admin Pill */}
            <div
              onClick={() => navigate("/superadmin/dashboard")}
              className="theme-hover flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl transition-colors border theme-border"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold theme-text leading-tight">
                  {user?.name || "Root Admin"}
                </p>
                <p className="text-[10px] text-rose-400 font-bold">SUPERADMIN</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 w-full max-w-full">{children}</main>

        {/* Footer */}
        <footer className="theme-header border-t theme-border py-4 px-8 text-xs theme-subtext flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <p>© {new Date().getFullYear()} NexusPlay Esports System · Super Admin Core Engine</p>
          <div className="flex items-center gap-4 font-medium">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> All Services Operational
            </span>
            <span className="theme-subtext">Security Level: Strict</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
