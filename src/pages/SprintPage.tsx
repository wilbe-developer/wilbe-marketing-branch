import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";

const SprintPage = () => {
  const { isAuthenticated, loading, user, hasDashboardAccess } = useAuth();
  const { isLoading: isLoadingSettings } = useAppSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSprintOnboarding = async () => {
      // Wait until auth state is loaded
      if (loading || isLoadingSettings) return;

      // If not authenticated, redirect to signup (without storing redirect location)
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to sprint signup");
        navigate(PATHS.SPRINT_SIGNUP);
        return;
      }

      // Check if user has completed sprint onboarding (has a profile)
      if (user) {
        console.log("Checking if user has a sprint profile");
        try {
          const { data: hasProfile, error: profileError } = await supabase
            .rpc('has_completed_sprint_onboarding', {
              p_user_id: user.id
            });

          if (profileError) {
            console.error('Error checking sprint onboarding:', profileError);
            toast.error("Error checking your sprint status. Please try again.");
            return;
          }

          if (!hasProfile) {
            console.log("User has no sprint profile, redirecting to signup");
            navigate(PATHS.SPRINT_SIGNUP);
            return;
          }

          // Redirect based on the computed dashboard access
          if (hasDashboardAccess) {
            console.log("User has dashboard access, redirecting to dashboard");
            navigate(PATHS.SPRINT_DASHBOARD);
          } else {
            console.log("User has sprint profile but no dashboard access, redirecting to waiting page");
            navigate(PATHS.SPRINT_WAITING);
          }
        } catch (error) {
          console.error('Error in sprint check flow:', error);
          toast.error("Something went wrong. Please try again.");
        }
      }
    };

    checkSprintOnboarding();
  }, [isAuthenticated, loading, navigate, user, hasDashboardAccess, isLoadingSettings]);

  // Show loading spinner while checking
  if (loading || isLoadingSettings || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your sprint...</p>
        </div>
      </div>
    );
  }

  // This should not be visible as we navigate away in the useEffect
  return null;
};

export default SprintPage;
