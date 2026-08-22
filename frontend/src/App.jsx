import React, { useState } from 'react';
import { OrganizerNavbar } from './components/layout/OrganizerNavbar';
import { DashboardPage } from './pages/organizer/DashboardPage';

export default function App() {
  // Mobile side drawer ke state handle krne ke liye variable banaya h
  const [navOpen, setNavOpen] = useState(false);

  // Jab navbar ka hamburger click krenge to ye chalega
  const handleMenuToggle = () => {
    setNavOpen(!navOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar display kr rhe h */}
      <OrganizerNavbar onMenuToggle={handleMenuToggle} />

      {/* Main content ka container jidhar abhi apna Dashboard render hoga */}
      <main className="p-6 max-w-6xl mx-auto w-full flex-1">
        <DashboardPage />
      </main>
    </div>
  );
}