
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserType } from "@/hooks/useUserType";
import { PATHS } from "@/lib/constants";

const SandboxRoute = () => {
  const { isAuthenticated, loading: authLoading, isRecoveryMode } = useAuth();
  const { isSprintUser, isSandboxUser, isApproved, loading: userTypeLoading } = useUserType();
  const location = useLocation();

  console.log("SandboxRoute - Auth state:", { 
    isAuthenticated, 
    isSprintUser, 
    isSandboxUser, 
    isApproved, 
    authLoading, 
    userTypeLoading,
    pathname: location.pathname,
    isRecoveryMode
  });

  // Show loading states
  if (authLoading || userTypeLoading) {
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

  // Redirect sprint users to their dashboard
  if (isSprintUser) {
    console.log("Sprint user accessing sandbox, redirecting to dashboard");
    return <Navigate to={PATHS.SPRINT_DASHBOARD} replace />;
  }

  // Render the sandbox content (approved or partial access)
  console.log("Rendering sandbox content for user");
  return <Outlet />;
};

export default SandboxRoute;
