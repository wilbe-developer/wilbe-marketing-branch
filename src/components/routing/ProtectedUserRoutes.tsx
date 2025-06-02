
import { Route } from "react-router-dom";
import { PATHS } from "@/lib/constants";
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

export default function ProtectedUserRoutes() {
  return (
    <Route element={<Layout />}>
      <Route element={<ProtectedRoute />}>
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.KNOWLEDGE_CENTER} element={<KnowledgeCenterPage />} />
        <Route path={PATHS.MEMBER_DIRECTORY} element={<MemberDirectoryPage />} />
        <Route path={`${PATHS.VIDEO}/:videoId`} element={<VideoPlayerPage />} />
        <Route path={PATHS.EVENTS} element={<EventsPage />} />
        <Route path={PATHS.BUILD_YOUR_DECK} element={<BuildYourDeckPage />} />
        <Route path={PATHS.PROFILE} element={<ProfilePage />} />

        {/* Placeholder routes */}
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

      {/* Legacy Admin route */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path={PATHS.ADMIN} element={<AdminPage />} />
      </Route>
    </Route>
  );
}
