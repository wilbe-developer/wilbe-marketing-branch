
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // Check for admin routes
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.includes('lead-generator');
  if (isAdminRoute && !user?.isAdmin) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
