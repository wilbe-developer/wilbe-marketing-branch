
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSimplifiedAuth } from "@/hooks/useSimplifiedAuth";
import { PATHS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export const SimplifiedProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, loading, isRecoveryMode, error, retryAuth } = useSimplifiedAuth();
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith(PATHS.ADMIN) || 
                        location.pathname.includes("lead-generator");

  console.log("SimplifiedProtectedRoute - Auth state:", { 
    isAuthenticated, 
    isAdmin, 
    loading, 
    isAdminRoute, 
    pathname: location.pathname,
    isRecoveryMode,
    error
  });

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={retryAuth}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Show loading state
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
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // For admin routes, check if user has admin privileges
  if (isAdminRoute && !isAdmin) {
    console.log("User doesn't have admin privileges, redirecting to home");
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Render the protected outlet
  console.log("User authenticated, rendering protected content");
  return <Outlet />;
};

export const SimplifiedMemberRoute = () => {
  const { isAuthenticated, isApproved, loading, isRecoveryMode, error, retryAuth } = useSimplifiedAuth();
  const location = useLocation();

  console.log("SimplifiedMemberRoute - Auth state:", { isAuthenticated, isApproved, loading, isRecoveryMode, error });

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={retryAuth}>Try Again</Button>
        </div>
      </div>
    );
  }

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

  // Redirect to pending approval page if not approved
  if (!isApproved) {
    console.log("User not approved, redirecting to pending approval");
    return <Navigate to={PATHS.PENDING} state={{ from: location }} replace />;
  }

  // Render the protected outlet
  console.log("User authenticated and approved, rendering protected content");
  return <Outlet />;
};

export const SimplifiedSandboxRoute = () => {
  const { isAuthenticated, loading, isRecoveryMode, error, retryAuth } = useSimplifiedAuth();
  const location = useLocation();

  console.log("SimplifiedSandboxRoute - Auth state:", { 
    isAuthenticated, 
    loading,
    pathname: location.pathname,
    isRecoveryMode,
    error
  });

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={retryAuth}>Try Again</Button>
        </div>
      </div>
    );
  }

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

  // For sandbox pages, we allow access but individual pages control content based on approval
  console.log("Rendering sandbox content for user");
  return <Outlet />;
};
