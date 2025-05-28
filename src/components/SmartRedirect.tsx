
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { PATHS } from "@/lib/constants";

const SmartRedirect = () => {
  const { 
    isFullyReady, 
    loading, 
    isAuthenticated, 
    isSprintUser, 
    isMagicLinkProcessing 
  } = useUnifiedAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SmartRedirect - Auth state:", {
      isFullyReady,
      loading,
      isAuthenticated,
      isSprintUser,
      isMagicLinkProcessing
    });
    
    // Don't redirect if not fully ready
    if (!isFullyReady || loading || isMagicLinkProcessing) {
      console.log("SmartRedirect - Auth not fully ready, waiting...");
      return;
    }
    
    if (!isAuthenticated) {
      console.log("SmartRedirect - User not authenticated, redirecting to login");
      navigate(PATHS.LOGIN);
      return;
    }

    // Authenticated users - redirect based on user type
    if (isSprintUser) {
      console.log("SmartRedirect - Sprint user, redirecting to dashboard");
      navigate(PATHS.SPRINT_DASHBOARD);
    } else {
      console.log("SmartRedirect - Sandbox user, redirecting to home");
      navigate(PATHS.HOME);
    }
  }, [isFullyReady, loading, isAuthenticated, isSprintUser, isMagicLinkProcessing, navigate]);
  
  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Setting up your account...</p>
      </div>
    </div>
  );
};

export default SmartRedirect;
