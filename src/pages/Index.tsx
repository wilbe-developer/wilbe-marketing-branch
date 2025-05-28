
import { useAuthCoordinator } from "@/hooks/useAuthCoordinator";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PATHS } from "@/lib/constants";

// This component only handles initial routing when users land on app.wilbe.com
const Index = () => {
  const { 
    isFullyReady, 
    isLoading, 
    hasError, 
    errorMessage, 
    authData 
  } = useAuthCoordinator();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index - Auth coordinator state:", {
      isFullyReady,
      isLoading,
      hasError,
      errorMessage,
      authData
    });
    
    // Don't redirect if not fully ready
    if (!isFullyReady) {
      console.log("Index - Auth not fully ready, waiting...");
      return;
    }

    // Handle errors
    if (hasError) {
      console.error("Index - Auth error, redirecting to login:", errorMessage);
      navigate(PATHS.LOGIN);
      return;
    }
    
    const { isAuthenticated, isSprintUser } = authData;
    
    if (!isAuthenticated) {
      console.log("Index - User not authenticated, redirecting to login");
      navigate(PATHS.LOGIN);
      return;
    }

    // ONLY redirect sprint users to dashboard when they land on the index page
    if (isSprintUser) {
      console.log("Index - Sprint user landing on index, redirecting to dashboard");
      navigate(PATHS.SPRINT_DASHBOARD);
      return;
    }

    // Sandbox users get redirected to home page
    console.log("Index - Sandbox user landing on index, redirecting to home");
    navigate(PATHS.HOME);
  }, [isFullyReady, isLoading, hasError, errorMessage, authData, navigate]);
  
  // Show loading state with specific messages
  if (isLoading) {
    const loadingMessage = hasError 
      ? "Authentication error..." 
      : "Setting up your account...";
      
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">{loadingMessage}</p>
          {hasError && errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
      </div>
    );
  }
  
  // This should never render since we redirect in useEffect
  return null;
};

export default Index;
