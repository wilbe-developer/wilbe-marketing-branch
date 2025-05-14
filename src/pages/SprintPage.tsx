
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SprintPage = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSprintOnboarding = async () => {
      // Wait until auth state is loaded
      if (loading) return;

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

          // Redirect to dashboard - tasks are now global and don't need to be created per user
          console.log("User has sprint profile, redirecting to dashboard");
          navigate(PATHS.SPRINT_DASHBOARD);
        } catch (error) {
          console.error('Error in sprint check flow:', error);
          toast.error("Something went wrong. Please try again.");
        }
      }
    };

    checkSprintOnboarding();
  }, [isAuthenticated, loading, navigate, user]);

  // Show loading spinner while checking
  if (loading || isAuthenticated) {
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
