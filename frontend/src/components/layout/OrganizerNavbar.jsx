import React from 'react';
import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';

export function OrganizerNavbar({ onMenuToggle }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tournaments..." 
            className="w-full pl-9 pr-4 py-1.5 text-xs border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-2 right-2" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="Avatar" 
            className="w-8 h-8 rounded-full object-cover" 
          />
          <div className="hidden sm:block">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-800">Vikramaditya S.</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[10px] text-slate-400 block">Organizer Head</span>
          </div>
        </div>
      </div>
    </header>
  );
}