
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSimplifiedAuth } from "@/hooks/useSimplifiedAuth";
import { PATHS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const SmartRedirect = () => {
  const { 
    isFullyReady, 
    loading, 
    isAuthenticated, 
    isSprintUser, 
    isMagicLinkProcessing,
    error,
    retryAuth
  } = useSimplifiedAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SmartRedirect - Auth state:", {
      isFullyReady,
      loading,
      isAuthenticated,
      isSprintUser,
      isMagicLinkProcessing,
      error
    });
    
    // Don't redirect if there's an error or not fully ready
    if (error || !isFullyReady || loading || isMagicLinkProcessing) {
      console.log("SmartRedirect - Auth not ready or has error, waiting...");
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
  }, [isFullyReady, loading, isAuthenticated, isSprintUser, isMagicLinkProcessing, error, navigate]);
  
  // Show error state with retry option
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
          <div className="space-y-2">
            <Button onClick={retryAuth} className="w-full">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(PATHS.LOGIN)}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">
          {isMagicLinkProcessing ? "Processing login..." : "Setting up your account..."}
        </p>
        {loading && !isMagicLinkProcessing && (
          <p className="text-sm text-gray-400 mt-2">
            This shouldn't take long. If it continues loading, please refresh the page.
          </p>
        )}
      </div>
    </div>
  );
};

export default SmartRedirect;
