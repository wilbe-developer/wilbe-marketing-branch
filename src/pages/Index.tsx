
import { useAuth } from "@/hooks/useAuth";
import { useUserType } from "@/hooks/useUserType";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PATHS } from "@/lib/constants";

// This component only handles initial routing when users land on app.wilbe.com
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

    // ONLY redirect sprint users to dashboard when they land on the index page
    // This determines their "home" page, but they can still navigate to sandbox
    if (isSprintUser) {
      console.log("Sprint user landing on index, redirecting to dashboard");
      navigate(PATHS.SPRINT_DASHBOARD);
      return;
    }

    // Sandbox users get redirected to home page
    console.log("Sandbox user landing on index, redirecting to home");
    navigate(PATHS.HOME);
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
  
  // This should never render since we redirect in useEffect
  return null;
};

export default Index;
