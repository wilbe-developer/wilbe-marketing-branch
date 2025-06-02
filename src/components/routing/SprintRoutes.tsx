
import { Route } from "react-router-dom";
import { PATHS } from "@/lib/constants";
import SprintLayout from "@/components/sprint/SprintLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import MemberRoute from "@/components/MemberRoute";
import SprintDashboardPage from "@/pages/SprintDashboardPage";
import SprintTaskPage from "@/pages/SprintTaskPage";
import SprintProfilePage from "@/pages/SprintProfilePage";
import CommunityPage from "@/pages/CommunityPage";
import NewThreadPage from "@/pages/NewThreadPage";
import ThreadPage from "@/pages/ThreadPage";

export default function SprintRoutes() {
  return (
    <>
      {/* Sprint routes - accessible to all authenticated users */}
      <Route element={<SprintLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path={PATHS.SPRINT_DASHBOARD} element={<SprintDashboardPage />} />
          <Route path={`${PATHS.SPRINT_TASK}/:taskId`} element={<SprintTaskPage />} />
          <Route path={PATHS.SPRINT_PROFILE} element={<SprintProfilePage />} />
        </Route>
      </Route>

      {/* Community pages - require member approval */}
      <Route element={<SprintLayout />}>
        <Route element={<MemberRoute />}>
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/new" element={<NewThreadPage />} />
          <Route path="/community/thread/:threadId" element={<ThreadPage />} />
        </Route>
      </Route>
    </>
  );
}
