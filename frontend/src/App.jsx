import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { OrganizerLayout } from './components/layout/OrganizerLayout';

// Pages
import { DashboardPage } from './pages/organizer/DashboardPage';
import { TournamentsPage } from './pages/organizer/TournamentsPage';
import { CreateTournamentPage } from './pages/organizer/CreateTournamentPage';
import { TournamentDetailPage } from './pages/organizer/TournamentDetailPage';
import { ProfilePage } from './pages/organizer/ProfilePage';
import { SettingsPage } from './pages/organizer/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <OrganizerLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/organizer/dashboard" replace />} />

            <Route path="/organizer/dashboard" element={<DashboardPage />} />
            <Route path="/organizer/tournaments" element={<TournamentsPage />} />
            <Route path="/organizer/tournaments/create" element={<CreateTournamentPage />} />
            <Route path="/organizer/tournaments/:id" element={<TournamentDetailPage />} />

            <Route path="/organizer/profile" element={<ProfilePage />} />
            <Route path="/organizer/settings" element={<SettingsPage />} />

            {/* Dynamic Theme Compatible Placeholders */}
            <Route 
              path="/organizer/history" 
              element={
                <div className="theme-card p-6 rounded-2xl border shadow-xs space-y-1">
                  <h1 className="text-xl font-bold theme-text">Tournament History</h1>
                  <p className="text-sm theme-subtext">View completed and past esports events.</p>
                </div>
              } 
            />
            <Route 
              path="/organizer/sponsors" 
              element={
                <div className="theme-card p-6 rounded-2xl border shadow-xs space-y-1">
                  <h1 className="text-xl font-bold theme-text">Sponsors Management</h1>
                  <p className="text-sm theme-subtext">Manage brand partnerships and tournament sponsors.</p>
                </div>
              } 
            />

            <Route path="*" element={<Navigate to="/organizer/dashboard" replace />} />
          </Routes>
        </OrganizerLayout>
      </Router>
    </ThemeProvider>
  );
}