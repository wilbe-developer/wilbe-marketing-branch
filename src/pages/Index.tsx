
import { useAuth } from "@/hooks/useAuth";
import { useUserType } from "@/hooks/useUserType";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATHS } from "@/lib/constants";

// This component only handles initial routing when users land on app.wilbe.com
const Index = () => {
  const { isAuthenticated, loading: authLoading, isRecoveryMode } = useAuth();
  const { isSprintUser, isSandboxUser, loading: userTypeLoading } = useUserType();
  const navigate = useNavigate();
  const [isMagicLinkProcessing, setIsMagicLinkProcessing] = useState(false);
  
  // Check if current URL contains magic link tokens
  const hasMagicLinkTokens = () => {
    const hash = window.location.hash;
    return hash.includes('access_token=') || hash.includes('type=magiclink') || hash.includes('refresh_token=');
  };

  useEffect(() => {
    console.log("Index component mounted, checking auth state...");
    
    // Don't redirect if in recovery mode (let the password reset page handle it)
    if (isRecoveryMode) {
      console.log("Recovery mode detected, not redirecting");
      return;
    }
    
    // If magic link tokens are present, wait for Supabase to process them
    if (hasMagicLinkTokens()) {
      console.log("Magic link tokens detected in URL, waiting for processing...");
      setIsMagicLinkProcessing(true);
      
      // Give Supabase time to process the magic link tokens
      setTimeout(() => {
        console.log("Magic link processing timeout reached");
        setIsMagicLinkProcessing(false);
      }, 3000); // 3 second timeout
      
      return;
    }
    
    // Wait for both auth and user type to load (and magic link processing to complete)
    if (authLoading || userTypeLoading || isMagicLinkProcessing) {
      console.log("Still loading...", { authLoading, userTypeLoading, isMagicLinkProcessing });
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
  }, [isAuthenticated, authLoading, userTypeLoading, navigate, isSprintUser, isSandboxUser, isRecoveryMode, isMagicLinkProcessing]);

  // Stop magic link processing when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isMagicLinkProcessing) {
      console.log("User authenticated during magic link processing, stopping processing");
      setIsMagicLinkProcessing(false);
    }
  }, [isAuthenticated, isMagicLinkProcessing]);
  
  if (authLoading || userTypeLoading || isMagicLinkProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">
            {isMagicLinkProcessing ? "Processing login link..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }
  
  // This should never render since we redirect in useEffect
  return null;
};

export default Index;
