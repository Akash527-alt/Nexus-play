import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { DashboardPage } from './pages/organizer/DashboardPage';
import { TournamentsPage } from './pages/organizer/TournamentsPage';
import { CreateTournamentPage } from './pages/organizer/CreateTournamentPage';
import { TournamentDetailPage } from './pages/organizer/TournamentDetailPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            {/* Redirect root to organizer dashboard */}
            <Route path="/" element={<Navigate to="/organizer/dashboard" replace />} />
            
            {/* Organizer Routes */}
            <Route path="/organizer/dashboard" element={<DashboardPage />} />
            <Route path="/organizer/tournaments" element={<TournamentsPage />} />
            <Route path="/organizer/tournaments/create" element={<CreateTournamentPage />} />
            <Route path="/organizer/tournaments/:id" element={<TournamentDetailPage />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/organizer/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}