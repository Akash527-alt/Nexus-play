import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TournamentProvider } from "./context/TournamentContext";

// Layouts
import { OrganizerLayout } from "./components/layout/OrganizerLayout";
import { ParticipantLayout } from "./components/layout/ParticipantLayout";
import { SponsorLayout } from "./components/layout/SponsorLayout";
import { SuperAdminLayout } from "./components/layout/SuperAdminLayout";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage.jsx";
import { OrganizerRegisterPage } from "./pages/auth/OrganizerRegisterPage";
import { OrganizerProfilePage } from "./pages/auth/OrganizerProfilePage";
import { SponsorRegisterPage } from "./pages/auth/SponsorRegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

// Organizer Pages
import { DashboardPage } from "./pages/organizer/DashboardPage";
import { TournamentsPage } from "./pages/organizer/TournamentsPage";
import { CreateTournamentPage } from "./pages/organizer/CreateTournamentPage";
import { TournamentDetailPage } from "./pages/organizer/TournamentDetailPage";
import { ProfilePage } from "./pages/organizer/ProfilePage";
import { SettingsPage } from "./pages/organizer/SettingsPage";
import { SponsorsPage } from "./pages/organizer/SponsorPage";

// Participant Pages
import { ParticipantDashboard } from "./pages/participant/ParticipantDashboard";
import { ParticipantTournaments } from "./pages/participant/ParticipantTournaments";
import { ParticipantTournamentDetailPage } from "./pages/participant/ParticipantTournamentDetailPage";
import { ParticipantHistory } from "./pages/participant/ParticipantHistory";
import { ParticipantProfilePage } from "./pages/participant/ProfilePage";
import { ParticipantSettingsPage } from "./pages/participant/SettingsPage";

// Sponsor Pages
import { SponsorDashboard } from "./pages/sponsor/SponsorDashboard";
import { SponsorTournaments } from "./pages/sponsor/SponsorTournaments";
import { SponsorTournamentDetails } from "./pages/sponsor/SponsorTournamentDetails";
import { MySponsorshipsPage } from "./pages/sponsor/MySponsorshipsPage";
import { SponsorProfilePage } from "./pages/sponsor/SponsorProfilePage";
import { SponsorAnalyticsPage } from "./pages/sponsor/SponsorAnalyticsPage";

// Super Admin Pages
import { SuperAdminDashboard } from "./pages/superadmin/SuperAdminDashboard";
import { UsersManagementPage } from "./pages/superadmin/UsersManagementPage";
import { OrganizersManagementPage } from "./pages/superadmin/OrganizersManagementPage";
import { TournamentsModerationPage } from "./pages/superadmin/TournamentsModerationPage";
import { SponsorsManagementPage } from "./pages/superadmin/SponsorsManagementPage";
import { PaymentsManagementPage } from "./pages/superadmin/PaymentsManagementPage";
import { ReportsPage } from "./pages/superadmin/ReportsPage";
import { PlatformSettingsPage } from "./pages/superadmin/PlatformSettingsPage";

// Protection & Error Handling
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage.jsx";

// Fallback history
const HistoryPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Tournament History</h1>
    <p className="text-gray-400">Past tournament records.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TournamentProvider>
          <Router>
            <Toaster position="top-right" richColors closeButton />

            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/password/reset/:token"
                element={<ResetPasswordPage />}
              />

              <Route
                path="/register/organizer"
                element={<OrganizerRegisterPage />}
              />
              <Route
                path="/register/organizer/profile"
                element={<OrganizerProfilePage />}
              />
              <Route
                path="/register/sponsor"
                element={<SponsorRegisterPage />}
              />

              {/* PARTICIPANT ROUTES */}
              <Route
                path="/participant/*"
                element={
                  <ProtectedRoute roles={["user", "admin", "superadmin"]}>
                    <ParticipantLayout>
                      <Routes>
                        <Route
                          path="dashboard"
                          element={<ParticipantDashboard />}
                        />
                        <Route
                          path="tournaments"
                          element={<ParticipantTournaments />}
                        />
                        <Route
                          path="tournaments/:id"
                          element={<ParticipantTournamentDetailPage />}
                        />
                        <Route
                          path="history"
                          element={<ParticipantHistory />}
                        />
                        <Route
                          path="profile"
                          element={<ParticipantProfilePage />}
                        />
                        <Route
                          path="settings"
                          element={<ParticipantSettingsPage />}
                        />
                        <Route
                          path="*"
                          element={
                            <Navigate to="/participant/dashboard" replace />
                          }
                        />
                      </Routes>
                    </ParticipantLayout>
                  </ProtectedRoute>
                }
              />

              {/* ORGANIZER ROUTES */}
              <Route
                path="/organizer/*"
                element={
                  <ProtectedRoute roles={["organizer", "admin", "superadmin"]}>
                    <OrganizerLayout>
                      <Routes>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route
                          path="tournaments"
                          element={<TournamentsPage />}
                        />
                        <Route
                          path="tournaments/create"
                          element={<CreateTournamentPage />}
                        />
                        <Route
                          path="tournaments/:id"
                          element={<TournamentDetailPage />}
                        />
                        <Route path="history" element={<HistoryPage />} />
                        <Route path="sponsors" element={<SponsorsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route
                          path="*"
                          element={
                            <Navigate to="/organizer/dashboard" replace />
                          }
                        />
                      </Routes>
                    </OrganizerLayout>
                  </ProtectedRoute>
                }
              />

              {/* SPONSOR ROUTES */}
              <Route
                path="/sponsor/*"
                element={
                  <ProtectedRoute roles={["sponsor", "superadmin", "admin"]}>
                    <SponsorLayout>
                      <Routes>
                        <Route path="dashboard" element={<SponsorDashboard />} />
                        <Route
                          path="tournaments"
                          element={<SponsorTournaments />}
                        />
                        <Route
                          path="tournaments/:id"
                          element={<SponsorTournamentDetails />}
                        />
                        <Route
                          path="sponsorships"
                          element={<MySponsorshipsPage />}
                        />
                        <Route
                          path="profile"
                          element={<SponsorProfilePage />}
                        />
                        <Route
                          path="analytics"
                          element={<SponsorAnalyticsPage />}
                        />
                        <Route
                          path="*"
                          element={
                            <Navigate to="/sponsor/dashboard" replace />
                          }
                        />
                      </Routes>
                    </SponsorLayout>
                  </ProtectedRoute>
                }
              />

              {/* SUPER ADMIN ROUTES */}
              <Route
                path="/superadmin/*"
                element={
                  <ProtectedRoute roles={["superadmin", "admin"]}>
                    <SuperAdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<SuperAdminDashboard />} />
                        <Route path="users" element={<UsersManagementPage />} />
                        <Route
                          path="organizers"
                          element={<OrganizersManagementPage />}
                        />
                        <Route
                          path="tournaments"
                          element={<TournamentsModerationPage />}
                        />
                        <Route
                          path="sponsors"
                          element={<SponsorsManagementPage />}
                        />
                        <Route
                          path="payments"
                          element={<PaymentsManagementPage />}
                        />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route
                          path="settings"
                          element={<PlatformSettingsPage />}
                        />
                        <Route
                          path="*"
                          element={
                            <Navigate to="/superadmin/dashboard" replace />
                          }
                        />
                      </Routes>
                    </SuperAdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* ADMIN ALIAS */}
              <Route
                path="/admin/*"
                element={<Navigate to="/superadmin/dashboard" replace />}
              />

              {/* ROOT & FALLBACK */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </TournamentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;