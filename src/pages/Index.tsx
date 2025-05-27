
import { useAuth } from "@/hooks/useAuth";
import { useUserType } from "@/hooks/useUserType";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PATHS } from "@/lib/constants";
import HomePage from "./HomePage";

// This is just a wrapper to redirect to the appropriate page based on auth status and user type
const Index = () => {
  const { isAuthenticated, loading: authLoading, isRecoveryMode } = useAuth();
  const { isSprintUser, isSandboxUser, loading: userTypeLoading } = useUserType();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't redirect if in recovery mode (let the password reset page handle it)
    if (isRecoveryMode) {
      return;
    }
    
    // Wait for both auth and user type to load
    if (authLoading || userTypeLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate(PATHS.LOGIN);
      return;
    }

    // If sprint user, redirect to dashboard
    if (isSprintUser) {
      console.log("Sprint user detected, redirecting to dashboard");
      navigate(PATHS.SPRINT_DASHBOARD);
      return;
    }

    // If sandbox user, stay on home page (will be handled by HomePage component)
    console.log("Sandbox user detected, staying on homepage");
  }, [isAuthenticated, authLoading, userTypeLoading, navigate, isSprintUser, isSandboxUser, isRecoveryMode]);
  
  if (authLoading || userTypeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <HomePage />;
};

export default Index;
