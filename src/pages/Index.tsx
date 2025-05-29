
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATHS } from "@/lib/constants";
import HomePage from "./HomePage";
import ProfileCompletionDialog from "@/components/ProfileCompletionDialog";
import { applicationService } from "@/services/applicationService";

// This is just a wrapper to redirect to the appropriate page based on auth status
const Index = () => {
  const { isAuthenticated, user, loading, isRecoveryMode } = useAuth();
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  useEffect(() => {
    // Don't redirect if in recovery mode (let the password reset page handle it)
    if (isRecoveryMode) {
      return;
    }
    
    if (!loading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigate(PATHS.LOGIN);
    }
  }, [isAuthenticated, loading, navigate, isRecoveryMode]);

  // Check if user needs to complete profile for membership application
  useEffect(() => {
    if (user && isAuthenticated && !loading) {
      const needsCompletion = applicationService.needsProfileCompletion(user);
      setShowProfileDialog(needsCompletion);
    }
  }, [user, isAuthenticated, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <HomePage />
      <ProfileCompletionDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
      />
    </>
  );
};

export default Index;
