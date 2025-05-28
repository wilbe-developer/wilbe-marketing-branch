
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserTypeState {
  isSprintUser: boolean;
  isSandboxUser: boolean;
  isApproved: boolean;
  loading: boolean;
}

export const useUserType = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [userType, setUserType] = useState<UserTypeState>({
    isSprintUser: false,
    isSandboxUser: false,
    isApproved: false,
    loading: true
  });

  useEffect(() => {
    const checkUserType = async () => {
      console.log("UserType - Starting check:", { 
        isAuthenticated, 
        hasUser: !!user?.id, 
        authLoading 
      });

      // Wait for auth to be fully loaded and authenticated
      if (authLoading) {
        console.log("UserType - Auth still loading, waiting...");
        setUserType({
          isSprintUser: false,
          isSandboxUser: false,
          isApproved: false,
          loading: true
        });
        return;
      }

      if (!isAuthenticated || !user?.id) {
        console.log("UserType - Not authenticated or no user");
        setUserType({
          isSprintUser: false,
          isSandboxUser: false,
          isApproved: false,
          loading: false
        });
        return;
      }

      try {
        console.log("UserType - Fetching user type data for:", user.id);

        // Check if user has completed sprint onboarding
        const { data: hasSprintProfile, error: sprintError } = await supabase
          .rpc('has_completed_sprint_onboarding', {
            p_user_id: user.id
          });

        if (sprintError) {
          console.error("UserType - Sprint profile check error:", sprintError);
        }

        // Check user roles - member role means approved for sandbox
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) {
          console.error("UserType - User roles check error:", rolesError);
        }

        const isApproved = userRoles?.some(role => role.role === 'member') || false;
        const isSprintUser = hasSprintProfile || false;
        const isSandboxUser = !isSprintUser;

        console.log("UserType - Results:", { 
          isSprintUser, 
          isSandboxUser, 
          isApproved,
          hasSprintProfile,
          userRoles: userRoles?.map(r => r.role)
        });

        setUserType({
          isSprintUser,
          isSandboxUser,
          isApproved,
          loading: false
        });
      } catch (error) {
        console.error("UserType - Error checking user type:", error);
        setUserType({
          isSprintUser: false,
          isSandboxUser: true, // Default to sandbox user on error
          isApproved: false,
          loading: false
        });
      }
    };

    checkUserType();
  }, [isAuthenticated, user?.id, authLoading]);

  return userType;
};
