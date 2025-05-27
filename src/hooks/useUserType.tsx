
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
      if (!isAuthenticated || !user?.id || authLoading) {
        setUserType({
          isSprintUser: false,
          isSandboxUser: false,
          isApproved: false,
          loading: authLoading
        });
        return;
      }

      try {
        // Check if user has completed sprint onboarding
        const { data: hasSprintProfile } = await supabase
          .rpc('has_completed_sprint_onboarding', {
            p_user_id: user.id
          });

        // Check if user has member role (approved for sandbox)
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        const isApproved = userRoles?.some(role => role.role === 'member') || false;
        const isSprintUser = hasSprintProfile || false;
        const isSandboxUser = !isSprintUser;

        setUserType({
          isSprintUser,
          isSandboxUser,
          isApproved,
          loading: false
        });

        console.log("User type determined:", { isSprintUser, isSandboxUser, isApproved });
      } catch (error) {
        console.error("Error checking user type:", error);
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
