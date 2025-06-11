import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { AuthProvider } from './hooks/useAuth';
import { MetaWrapper } from './components/MetaWrapper';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SprintDashboard from './pages/SprintDashboard';
import SprintTaskPage from './pages/SprintTaskPage';
import CommunityPage from './pages/CommunityPage';
import PasswordResetPage from './pages/PasswordResetPage';
import AdminDashboard from './pages/AdminDashboard';
import MembershipApplicationPage from './pages/MembershipApplicationPage';
import AcceptInvitationPage from "@/pages/AcceptInvitationPage";
import { SprintContextProvider } from './hooks/useSprintContext';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Router>
        <QueryClient>
          <AuthProvider>
            <MetaWrapper>
              <SprintContextProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/sprint/dashboard" element={<SprintDashboard />} />
                  <Route path="/sprint/task/:taskId" element={<SprintTaskPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/reset-password" element={<PasswordResetPage />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/membership-application" element={<MembershipApplicationPage />} />
                  
                  {/* Add the invitation acceptance route */}
                  <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
                  
                </Routes>
              </SprintContextProvider>
            </MetaWrapper>
          </AuthProvider>
        </QueryClient>
      </Router>
    </div>
  );
}

export default App;
