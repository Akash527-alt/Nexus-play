import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "./context/ThemeContext";
import { OrganizerLayout } from "./components/layout/OrganizerLayout";

// Organizer Pages
import { DashboardPage } from "./pages/organizer/DashboardPage";
import { TournamentsPage } from "./pages/organizer/TournamentsPage";
import { CreateTournamentPage } from "./pages/organizer/CreateTournamentPage";
import { TournamentDetailPage } from "./pages/organizer/TournamentDetailPage";
import { ProfilePage } from "./pages/organizer/ProfilePage";
import { SettingsPage } from "./pages/organizer/SettingsPage";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage.jsx";
import { OrganizerRegisterPage } from "./pages/auth/OrganizerRegisterPage";
import { OrganizerProfilePage } from "./pages/auth/OrganizerProfilePage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" richColors closeButton />

          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/register/organizer"
              element={<OrganizerRegisterPage />}
            />

            <Route
              path="/register/organizer/profile"
              element={<OrganizerProfilePage />}
            />
            {/* ================= ORGANIZER ROUTES ================= */}
            <Route
              path="/organizer/*"
              element={
                <OrganizerLayout>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />

                    <Route path="tournaments" element={<TournamentsPage />} />

                    <Route
                      path="tournaments/create"
                      element={<CreateTournamentPage />}
                    />

                    <Route
                      path="tournaments/:id"
                      element={<TournamentDetailPage />}
                    />

                    <Route path="profile" element={<ProfilePage />} />

                    <Route path="settings" element={<SettingsPage />} />

                    <Route
                      path="history"
                      element={
                        <div className="theme-card p-6 rounded-2xl border shadow-xs">
                          <h1 className="text-xl font-bold theme-text">
                            Tournament History
                          </h1>

                          <p className="text-sm theme-subtext">
                            View completed and past esports events.
                          </p>
                        </div>
                      }
                    />

                    <Route
                      path="sponsors"
                      element={
                        <div className="theme-card p-6 rounded-2xl border shadow-xs">
                          <h1 className="text-xl font-bold theme-text">
                            Sponsors Management
                          </h1>

                          <p className="text-sm theme-subtext">
                            Manage brand partnerships and tournament sponsors.
                          </p>
                        </div>
                      }
                    />

                    <Route
                      path="*"
                      element={<Navigate to="/organizer/dashboard" replace />}
                    />
                  </Routes>
                </OrganizerLayout>
              }
            />
            {/* ================= ROOT ================= */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
