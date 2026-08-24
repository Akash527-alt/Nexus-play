import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

export const ParticipantLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/participant/dashboard", icon: "🎮" },
    { label: "Tournaments", path: "/participant/tournaments", icon: "🏆" },
    { label: "Match History", path: "/participant/history", icon: "📜" },
    { label: "Profile", path: "/participant/profile", icon: "👤" },
    { label: "Settings", path: "/participant/settings", icon: "⚙️" },
  ];

  // Title formatter for header (hides raw routes)
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-indigo-500">NEXUS</span>
          <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full font-bold">STUDENT</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-slate-800 rounded-lg text-slate-300">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex-col justify-between ${
        isMobileMenuOpen ? "flex" : "hidden md:flex"
      }`}>
        <div>
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2 mb-8">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-600/30">
              N
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-wider text-slate-100">NEXUS PLAY</h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Player Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">
              AS
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Alex Student</p>
              <p className="text-[10px] text-emerald-400 font-semibold">● Online</p>
            </div>
          </div>
          <button 
            onClick={() => toast.success("Logged out successfully")} 
            className="text-slate-500 hover:text-red-400 text-xs transition">
            ➔
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Bar without raw route path */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-900/50 border-b border-slate-800/60 backdrop-blur-md">
          <h2 className="text-sm font-bold text-slate-200 tracking-wide">
            {getPageTitle()}
          </h2>

          <div className="flex items-center gap-4">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <span className="text-amber-400 font-bold">⚡ 450</span>
              <span className="text-slate-400">XP</span>
            </div>
            <Link 
              to="/participant/profile"
              className="h-8 w-8 bg-indigo-600/20 border border-indigo-500/40 rounded-lg flex items-center justify-center text-indigo-400 text-xs font-bold hover:bg-indigo-600 hover:text-white transition">
              👤
            </Link>
          </div>
        </header>

        {/* Dynamic Page Area */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        <footer className="px-8 py-4 bg-slate-900/40 border-t border-slate-800/50 text-center md:flex md:justify-between text-[11px] text-slate-500">
          <p>© 2026 Nexus Play Esports Engine.</p>
          <p className="mt-1 md:mt-0">Student Participant Portal</p>
        </footer>
      </main>
    </div>
  );
};