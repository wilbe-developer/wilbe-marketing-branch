
import { BrowserRouter, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { SprintContextProvider } from "@/hooks/useSprintContext";
import MetaWrapper from "@/components/MetaWrapper";

// Import all routes directly
import { Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import LandingPageMarketing from "@/pages/LandingPage";
import MediaPage from "@/pages/MediaPage";
import AboutUsPage from "@/pages/AboutUsPage";
import BlogPage from "@/pages/BlogPage";
import ErrorPage from "@/pages/ErrorPage";
import { PATHS } from "@/lib/constants";
import MerchPage from "@/pages/MerchPage";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import PasswordResetPage from "@/pages/PasswordResetPage";
import LandingPageOld from "@/components/LandingPageOld";
import BsfPage from "@/components/BsfOld";
import QuizPage from "@/pages/QuizPage";
import SprintSignupPage from "@/pages/SprintSignupPage";
import SprintWaitingPage from "@/pages/SprintWaitingPage";
import SprintPage from "@/pages/SprintPage";
import SprintWaitlistPage from "@/pages/SprintWaitlistPage";
import SprintReferralPage from "@/pages/SprintReferralPage";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import KnowledgeCenterPage from "@/pages/KnowledgeCenterPage";
import MemberDirectoryPage from "@/pages/MemberDirectoryPage";
import VideoPlayerPage from "@/pages/VideoPlayerPage";
import EventsPage from "@/pages/EventsPage";
import BuildYourDeckPage from "@/pages/BuildYourDeckPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import SprintLayout from "@/components/sprint/SprintLayout";
import MemberRoute from "@/components/MemberRoute";
import SprintDashboardPage from "@/pages/SprintDashboardPage";
import SprintTaskPage from "@/pages/SprintTaskPage";
import SprintProfilePage from "@/pages/SprintProfilePage";
import CommunityPage from "@/pages/CommunityPage";
import NewThreadPage from "@/pages/NewThreadPage";
import ThreadPage from "@/pages/ThreadPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import UserApprovalsPage from "@/pages/admin/UserApprovalsPage";
import SprintMonitorPage from "@/pages/admin/SprintMonitorPage";
import TaskBuilderPage from "@/pages/admin/TaskBuilderPage";
import UTMAnalyticsPage from "@/pages/admin/UTMAnalyticsPage";
import LeadGeneratorPage from "@/pages/LeadGeneratorPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import SprintDataRoomPage from "@/pages/SprintDataRoomPage";
import FAQsPage from "@/pages/FAQsPage";
import NotFoundPage from "@/pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <SprintContextProvider>
          <MetaWrapper>
            <Routes>
              {/* Marketing Routes */}
              <Route
                element={
                  <ErrorBoundary fallback={<ErrorPage />}>
                    <LandingPageMarketing />
                  </ErrorBoundary>
                }
                path="/landing-page"
              />
              <Route
                element={
                  <ErrorBoundary fallback={<ErrorPage />}>
                    <MediaPage />
                  </ErrorBoundary>
                }
                path="/media"
              />
              <Route
                element={
                  <ErrorBoundary fallback={<ErrorPage />}>
                    <AboutUsPage />
                  </ErrorBoundary>
                }
                path="/about"
              />
              <Route
                element={
                  <ErrorBoundary fallback={<ErrorPage />}>
                    <BlogPage />
                  </ErrorBoundary>
                }
                path="/blog"
              />

              {/* Public Routes */}
              <Route path="/merch" element={<MerchPage />} />
              <Route path={PATHS.LOGIN} element={<LoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path={PATHS.LANDING_PAGE} element={<LandingPageOld />} />
              <Route path={PATHS.BSF_PAGE} element={<BsfPage />} />
              <Route path={PATHS.QUIZ} element={<QuizPage />} />
              <Route path="/sprint-signup" element={<SprintSignupPage />} />
              <Route path={PATHS.SPRINT_WAITING} element={<SprintWaitingPage />} />
              <Route path={PATHS.SPRINT} element={<SprintPage />} />
              <Route path="/waitlist" element={<SprintWaitlistPage />} />
              <Route path="/referral" element={<SprintReferralPage />} />
              <Route path="/ref/:code" element={<SprintWaitlistPage />} />

              {/* Protected User Routes */}
              <Route element={<Layout />}>
                <Route element={<ProtectedRoute />}>
                  <Route path={PATHS.HOME} element={<HomePage />} />
                  <Route path={PATHS.KNOWLEDGE_CENTER} element={<KnowledgeCenterPage />} />
                  <Route path={PATHS.MEMBER_DIRECTORY} element={<MemberDirectoryPage />} />
                  <Route path={`${PATHS.VIDEO}/:videoId`} element={<VideoPlayerPage />} />
                  <Route path={PATHS.EVENTS} element={<EventsPage />} />
                  <Route path={PATHS.BUILD_YOUR_DECK} element={<BuildYourDeckPage />} />
                  <Route path={PATHS.PROFILE} element={<ProfilePage />} />
                  <Route
                    path={PATHS.LAB_SEARCH}
                    element={
                      <div className="py-12 text-center">
                        <h1 className="text-2xl font-bold mb-4">Lab Search</h1>
                        <p>This feature is coming soon.</p>
                      </div>
                    }
                  />
                  <Route
                    path={PATHS.ASK}
                    element={
                      <div className="py-12 text-center">
                        <h1 className="text-2xl font-bold mb-4">Ask & Invite</h1>
                        <p>This feature is coming soon.</p>
                      </div>
                    }
                  />
                </Route>
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path={PATHS.ADMIN} element={<AdminPage />} />
                </Route>
              </Route>

              {/* Sprint Routes */}
              <Route element={<SprintLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route path={PATHS.SPRINT_DASHBOARD} element={<SprintDashboardPage />} />
                  <Route path={`${PATHS.SPRINT_TASK}/:taskId`} element={<SprintTaskPage />} />
                  <Route path={PATHS.SPRINT_PROFILE} element={<SprintProfilePage />} />
                </Route>
              </Route>
              <Route element={<SprintLayout />}>
                <Route element={<MemberRoute />}>
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/community/new" element={<NewThreadPage />} />
                  <Route path="/community/thread/:threadId" element={<ThreadPage />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/approvals" element={<UserApprovalsPage />} />
                <Route path="/admin/sprint-monitor" element={<SprintMonitorPage />} />
                <Route path="/admin/task-builder" element={<TaskBuilderPage />} />
                <Route path="/admin/utm-analytics" element={<UTMAnalyticsPage />} />
                <Route path="/lead-generator" element={<LeadGeneratorPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Miscellaneous Routes */}
              <Route path="/sprint/data-room/:sprintId" element={<SprintDataRoomPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MetaWrapper>
        </SprintContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
