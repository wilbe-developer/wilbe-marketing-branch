
import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { UserProfile } from "@/types";
import { useProfileActions } from "./auth/useProfileActions";
import { useAuthenticationActions } from "./auth/useAuthenticationActions";

interface UseAuthActionsProps {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  toast: any;
}

export const useAuthActions = (props: UseAuthActionsProps) => {
  const { fetchUserProfile, updateProfileAsync } = useProfileActions();
  const { 
    loginOrSignup,
    sendMagicLink, 
    loginWithPassword, 
    resetPassword, 
    updatePassword, 
    register, 
    logout 
  } = useAuthenticationActions(props);

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      await updateProfileAsync(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  return {
    fetchUserProfile: useCallback(fetchUserProfile, []),
    loginOrSignup,
    sendMagicLink,
    loginWithPassword,
    resetPassword,
    updatePassword,
    register,
    logout,
    updateProfile
  };
};
