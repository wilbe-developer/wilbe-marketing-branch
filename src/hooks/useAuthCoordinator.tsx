
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useUserType } from "./useUserType";

interface AuthCoordinatorState {
  isFullyReady: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const useAuthCoordinator = () => {
  const { 
    isAuthenticated, 
    loading: authLoading, 
    isRecoveryMode, 
    isMagicLinkProcessing,
    user 
  } = useAuth();
  
  const { 
    loading: userTypeLoading, 
    isSprintUser, 
    isSandboxUser, 
    isApproved 
  } = useUserType();
  
  const [state, setState] = useState<AuthCoordinatorState>({
    isFullyReady: false,
    isLoading: true,
    hasError: false
  });

  useEffect(() => {
    console.log("AuthCoordinator - State check:", {
      authLoading,
      userTypeLoading,
      isAuthenticated,
      isMagicLinkProcessing,
      isRecoveryMode,
      hasUser: !!user,
      isSprintUser,
      isSandboxUser
    });

    // Don't process if in recovery mode
    if (isRecoveryMode) {
      setState({
        isFullyReady: true,
        isLoading: false,
        hasError: false
      });
      return;
    }

    // Don't process while magic link is processing
    if (isMagicLinkProcessing) {
      setState({
        isFullyReady: false,
        isLoading: true,
        hasError: false
      });
      return;
    }

    // Still loading auth or user type
    if (authLoading || userTypeLoading) {
      setState({
        isFullyReady: false,
        isLoading: true,
        hasError: false
      });
      return;
    }

    // Not authenticated - ready for login page
    if (!isAuthenticated) {
      setState({
        isFullyReady: true,
        isLoading: false,
        hasError: false
      });
      return;
    }

    // Authenticated but no user profile loaded yet
    if (isAuthenticated && !user) {
      console.warn("AuthCoordinator - User authenticated but no profile loaded");
      setState({
        isFullyReady: false,
        isLoading: true,
        hasError: false
      });
      return;
    }

    // Fully authenticated and user type determined
    if (isAuthenticated && user && !userTypeLoading) {
      console.log("AuthCoordinator - Fully ready", { isSprintUser, isSandboxUser, isApproved });
      setState({
        isFullyReady: true,
        isLoading: false,
        hasError: false
      });
      return;
    }

    // Default loading state
    setState({
      isFullyReady: false,
      isLoading: true,
      hasError: false
    });
  }, [
    authLoading,
    userTypeLoading,
    isAuthenticated,
    isMagicLinkProcessing,
    isRecoveryMode,
    user,
    isSprintUser,
    isSandboxUser,
    isApproved
  ]);

  // Add timeout protection
  useEffect(() => {
    if (state.isLoading && !isRecoveryMode && !isMagicLinkProcessing) {
      const timeout = setTimeout(() => {
        console.error("AuthCoordinator - Loading timeout reached");
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: "Authentication setup is taking longer than expected"
        }));
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [state.isLoading, isRecoveryMode, isMagicLinkProcessing]);

  return {
    ...state,
    authData: {
      isAuthenticated,
      user,
      isSprintUser,
      isSandboxUser,
      isApproved
    }
  };
};
