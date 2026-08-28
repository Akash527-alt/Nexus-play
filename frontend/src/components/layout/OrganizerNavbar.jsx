import React from 'react';
import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';

export function OrganizerNavbar({ onMenuToggle }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side - Brand & Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight hidden sm:inline">
            NexusPlay
          </span>
        </div>
      </div>

      {/* Right side - User Info & Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-indigo-600 rounded-full absolute top-2 right-2"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* Updated Profile Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
              Hardik Gohil
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 inline" />
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Frontend Developer</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center">
            HG
          </div>
        </div>
      </div>
    </header>
  );
}