
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";

const MemberRoute = () => {
  const { isAuthenticated, loading, isRecoveryMode, hasDashboardAccess } = useAuth();
  const location = useLocation();

  console.log("MemberRoute - Auth state:", { isAuthenticated, loading, isRecoveryMode, hasDashboardAccess });

  // Show loading states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your session...</p>
        </div>
      </div>
    );
  }

  // If in recovery mode and on password reset page, allow access
  if (isRecoveryMode && location.pathname === PATHS.PASSWORD_RESET) {
    return <Outlet />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // Check if this is a sprint-related route that requires dashboard access
  const isSprintRoute = location.pathname.startsWith('/sprint');
  
  if (isSprintRoute && !hasDashboardAccess) {
    console.log("User doesn't have dashboard access, redirecting to sprint waiting");
    return <Navigate to="/sprint-waiting" replace />;
  }

  // Render the protected outlet
  console.log("User authenticated and has access, rendering protected content");
  return <Outlet />;
};

export default MemberRoute;
