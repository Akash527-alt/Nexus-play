import React, { useEffect, useState } from 'react';
import { OrganizerNavbar } from './components/layout/OrganizerNavbar';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { tournamentService } from './services/tournamentService';

export default function App() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    // Abhi ke liye mock service use kiya h, backend ready hone par replace kr dena
    tournamentService.getAll().then((data) => setTournaments(data));
  }, []);

  // Temp. menu handler h
  const handleMenuToggle = () => {
    console.log('Mobile menu clicked');
  };

  // Create tournament page banne tak temp. button rkha h
  const createButton = <Button variant="primary">Create Event</Button>;

  // Badges ka UI check krne ke liye test krne ke liye ye kiya h
  const badgeTestSection = (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase">Status Badges Test</h2>
      <div className="flex gap-2">
        <Badge status="Live" />
        <Badge status="Upcoming" />
        <Badge status="Completed" />
      </div>
    </div>
  );

  // Dummy tournaments render krke dekh rhe h, ki array working h ya nhi
  const tournamentListSection = (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase">
        Loaded Tournaments ({tournaments.length})
      </h2>
      <div className="space-y-2">
        {tournaments.map((t) => (
          <div key={t.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-800">{t.name}</span>
            <Badge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <OrganizerNavbar onMenuToggle={handleMenuToggle} />

      <main className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Organizer Workspace</h1>
            <p className="text-xs text-slate-500 mt-1">Components aur dummy service test area</p>
          </div>
          {createButton}
        </div>

        {badgeTestSection}
        {tournamentListSection}
      </main>
    </div>
  );
}