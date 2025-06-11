import { Suspense, lazy } from "react";
import { Toaster as SonnerToaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "react-error-boundary";
import { ThemeProvider } from "next-themes";

import LandingPage from "@/pages/LandingPage";
const Account = lazy(() => import('@/pages/Account'));
const Admin = lazy(() => import('@/pages/Admin'));
const BSFApplication = lazy(() => import('@/pages/BSFApplication'));
const BSFHomePage = lazy(() => import('@/pages/BSFHomePage'));
const BSFProfile = lazy(() => import('@/pages/BSFProfile'));
const BSFProjects = lazy(() => import('@/pages/BSFProjects'));
const BSFTeam = lazy(() => import('@/pages/BSFTeam'));
const BSFWelcome = lazy(() => import('@/pages/BSFWelcome'));
const Contact = lazy(() => import('@/pages/Contact'));
const Discussion = lazy(() => import('@/pages/Discussion'));
const Discussions = lazy(() => import('@/pages/Discussions'));
const Events = lazy(() => import('@/pages/Events'));
const Jobs = lazy(() => import('@/pages/Jobs'));
const Legal = lazy(() => import('@/pages/Legal'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Profile = lazy(() => import('@/pages/Profile'));
const Search = lazy(() => import('@/pages/Search'));
const Settings = lazy(() => import('@/pages/Settings'));
const Terms = lazy(() => import('@/pages/Terms'));
const Welcome = lazy(() => import('@/pages/Welcome'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Navigate to="/landing-page" replace />} />
                  <Route path="/landing-page" element={<LandingPage />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/bsf-application" element={<BSFApplication />} />
                  <Route path="/bsf-home-page" element={<BSFHomePage />} />
                  <Route path="/bsf-profile" element={<BSFProfile />} />
                  <Route path="/bsf-projects" element={<BSFProjects />} />
                  <Route path="/bsf-team" element={<BSFTeam />} />
                  <Route path="/bsf-welcome" element={<BSFWelcome />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/discussion/:discussionId" element={<Discussion />} />
                  <Route path="/discussions" element={<Discussions />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/welcome" element={<Welcome />} />
                </Routes>
              </Suspense>
            </div>
            <SonnerToaster position="top-right" richColors />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
