import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  PlusCircle, 
  History, 
  Handshake, 
  User, 
  Settings,
  LogOut,
  Gamepad2
} from 'lucide-react';

export function OrganizerSidebar() {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/organizer/dashboard', icon: LayoutDashboard },
    { label: 'Tournaments', path: '/organizer/tournaments', icon: Trophy },
    { label: 'Create Tournament', path: '/organizer/tournaments/create', icon: PlusCircle },
    { label: 'History', path: '/organizer/history', icon: History },
    { label: 'Sponsors', path: '/organizer/sponsors', icon: Handshake },
  ];

  const bottomItems = [
    { label: 'Profile', path: '/organizer/profile', icon: User },
    { label: 'Settings', path: '/organizer/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 sticky top-0 h-screen">
      <div>
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-wide text-base leading-tight">NexusPlay</h2>
            <p className="text-[11px] text-slate-400 font-medium">Organizer Portal</p>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
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

      {/* Bottom Profile & Settings Section */}
      <div className="p-4 border-t border-slate-800/80 space-y-1.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Account</p>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                    : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button 
          onClick={() => alert('Logged out successfully')} 
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer mt-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}