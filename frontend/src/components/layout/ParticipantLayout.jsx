import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../context/ThemeContext";

export const ParticipantLayout = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Initial state set to false so sidebar opens closed by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/participant/dashboard", icon: "🎮" },
    { label: "Tournaments", path: "/participant/tournaments", icon: "🏆" },
    { label: "Match History", path: "/participant/history", icon: "📜" },
    { label: "Profile", path: "/participant/profile", icon: "👤" },
    { label: "Settings", path: "/participant/settings", icon: "⚙️" },
  ];

  const getPageTitle = () => {
    const segment = location.pathname.split("/")[2];
    switch (segment) {
      case "tournaments":
        return "Explore Tournaments";
      case "history":
        return "Match History Ledger";
      case "profile":
        return "Player Profile";
      case "settings":
        return "Account Settings";
      default:
        return "Player Arena Dashboard";
    }
  };

  return (
    <div className="min-h-screen theme-bg theme-text flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 theme-card border-b theme-border w-full sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 theme-icon-box border theme-border rounded-xl text-base font-bold theme-text hover:bg-indigo-500/10 transition cursor-pointer"
            title="Toggle Menu"
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>
          <span className="font-extrabold text-indigo-500 text-sm tracking-wider">NEXUS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl theme-icon-box border theme-border text-sm"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation (Collapsible) */}
      {isSidebarOpen && (
        <aside className="w-full md:w-64 theme-card border-r theme-border p-6 flex flex-col justify-between shrink-0 transition-all duration-300">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md">
                  N
                </div>
                <div>
                  <h2 className="font-extrabold text-sm tracking-wider theme-text">NEXUS PLAY</h2>
                  <p className="text-[10px] theme-subtext font-semibold uppercase tracking-widest">
                    Student Arena
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "theme-subtext theme-hover hover:text-indigo-500"
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Info Bottom Box */}
          <div className="pt-6 border-t theme-border flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 theme-icon-box border theme-border rounded-full flex items-center justify-center text-xs font-bold text-indigo-500">
                AS
              </div>
              <div>
                <p className="text-xs font-bold theme-text">Alex Student</p>
                <p className="text-[10px] text-emerald-500 font-semibold">● Online</p>
              </div>
            </div>
            <button
              onClick={() => toast.success("Logged out successfully")}
              className="theme-subtext hover:text-red-500 text-xs transition cursor-pointer"
            >
              ➔
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 theme-bg">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 theme-card border-b theme-border">
          <div className="flex items-center gap-4">
            {/* Desktop Hamburger Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 theme-icon-box border theme-border rounded-xl text-sm font-bold theme-text hover:bg-indigo-500/10 transition cursor-pointer"
              title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            >
              ☰
            </button>
            <h2 className="text-sm font-bold theme-text tracking-wide">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl theme-border border text-sm theme-icon-box hover:opacity-80 transition cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="theme-border border rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs theme-card">
              <span className="text-amber-500 font-bold">⚡ 450</span>
              <span className="theme-subtext">XP</span>
            </div>
            <Link
              to="/participant/profile"
              className="h-8 w-8 theme-icon-box border theme-border rounded-lg flex items-center justify-center text-indigo-500 text-xs font-bold hover:bg-indigo-600 hover:text-white transition"
            >
              👤
            </Link>
          </div>
        </header>

        {/* Dynamic Page Box */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto w-full">{children}</div>

        {/* Footer */}
        <footer className="px-8 py-4 theme-card border-t theme-border text-center md:flex md:justify-between text-[11px] theme-subtext">
          <p>© 2026 Nexus Play Esports Engine.</p>
          <p className="mt-1 md:mt-0">Student Participant Portal</p>
        </footer>
      </main>
    </div>
  );
};