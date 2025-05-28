
import { useAuth } from "@/hooks/useAuth";
import { useUserType } from "@/hooks/useUserType";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PATHS } from "@/lib/constants";

// This component only handles initial routing when users land on app.wilbe.com
const Index = () => {
  const { isAuthenticated, loading: authLoading, isRecoveryMode, isMagicLinkProcessing } = useAuth();
  const { isSprintUser, loading: userTypeLoading } = useUserType();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index component - routing logic", {
      isAuthenticated,
      authLoading,
      userTypeLoading,
      isRecoveryMode,
      isSprintUser,
      isMagicLinkProcessing
    });
    
    // Don't redirect if in recovery mode (let the password reset page handle it)
    if (isRecoveryMode) {
      console.log("Recovery mode detected, not redirecting");
      return;
    }
    
    // Don't redirect while processing magic links or OAuth
    if (isMagicLinkProcessing) {
      console.log("Magic link/OAuth processing in progress, waiting...");
      return;
    }
    
    // Wait for auth and user type to load completely
    if (authLoading || userTypeLoading) {
      console.log("Still loading, waiting...");
      return;
    }
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      console.log("User not authenticated, redirecting to login");
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
  }, [
    isAuthenticated, 
    authLoading, 
    userTypeLoading, 
    navigate, 
    isSprintUser, 
    isRecoveryMode,
    isMagicLinkProcessing
  ]);
  
  // Show enhanced loading state while processing
  if (authLoading || userTypeLoading || isMagicLinkProcessing) {
    const loadingMessage = isMagicLinkProcessing 
      ? "Authenticating..." 
      : "Loading...";
      
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">{loadingMessage}</p>
        </div>
      </div>
    );
  }
  
  // This should never render since we redirect in useEffect
  return null;
};

export default Index;
