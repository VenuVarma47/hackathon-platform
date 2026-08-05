import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Views
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HackathonList from './pages/hackathons/HackathonList';
import HackathonDetail from './pages/hackathons/HackathonDetail';
import CreateHackathon from './pages/hackathons/CreateHackathon';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import OrganizerDashboard from './pages/dashboard/OrganizerDashboard';
import ParticipantDashboard from './pages/dashboard/ParticipantDashboard';
import JudgeDashboard from './pages/dashboard/JudgeDashboard';
import LeaderboardView from './pages/leaderboard/LeaderboardView';
import TeamManager from './pages/teams/TeamManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HackathonList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hackathons" element={<HackathonList />} />
              <Route path="/hackathons/:id" element={<HackathonDetail />} />
              <Route path="/leaderboard/:hackathonId" element={<LeaderboardView />} />

              {/* Protected Routes */}
              <Route
                path="/hackathons/create"
                element={
                  <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                    <CreateHackathon />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teams"
                element={
                  <ProtectedRoute allowedRoles={['Participant', 'Admin']}>
                    <TeamManager />
                  </ProtectedRoute>
                }
              />

              {/* Role-Based Dashboards */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/organizer"
                element={
                  <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/participant"
                element={
                  <ProtectedRoute allowedRoles={['Participant', 'Admin']}>
                    <ParticipantDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/judge"
                element={
                  <ProtectedRoute allowedRoles={['Judge', 'Admin']}>
                    <JudgeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4">
              MERN Stack Hackathon Management Platform • College Major Project 2026
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
