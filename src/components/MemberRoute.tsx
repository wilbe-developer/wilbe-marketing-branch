
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";

const MemberRoute = () => {
  const { isAuthenticated, loading, isRecoveryMode } = useAuth();
  const location = useLocation();

  console.log("MemberRoute - Auth state:", { isAuthenticated, loading, isRecoveryMode });

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

  // Render the protected outlet - no approval check needed
  console.log("User authenticated, rendering protected content");
  return <Outlet />;
};

export default MemberRoute;
