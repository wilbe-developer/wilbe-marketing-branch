
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import UserApprovalsPage from "@/pages/admin/UserApprovalsPage";
import SprintMonitorPage from "@/pages/admin/SprintMonitorPage";
import TaskBuilderPage from "@/pages/admin/TaskBuilderPage";
import UTMAnalyticsPage from "@/pages/admin/UTMAnalyticsPage";
import LeadGeneratorPage from "@/pages/LeadGeneratorPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

export default function AdminRoutes() {
  return (
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
  );
}
