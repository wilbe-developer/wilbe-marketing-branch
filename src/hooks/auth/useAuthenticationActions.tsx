import { NavigateFunction } from "react-router-dom";
import { UserProfile } from "@/types";
import { PATHS } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

interface UseAuthenticationActionsProps {
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  toast: any;
}

export const useAuthenticationActions = ({
  setUser,
  setSession,
  setLoading,
  navigate,
  toast
}: UseAuthenticationActionsProps) => {
  
  // Magic link function
  const sendMagicLink = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + PATHS.HOME,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Magic link sent",
        description: "Check your email for a login link.",
      });
      
    } catch (error) {
      toast({
        title: "Failed to send magic link",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password (for admins)
  const loginWithPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Auth state change will handle session and user updates
      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });
      
      navigate(PATHS.HOME);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + PATHS.PASSWORD_RESET,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      });
      
    } catch (error) {
      toast({
        title: "Failed to send password reset email",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
    } catch (error) {
      toast({
        title: "Failed to update password",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      
      // Generate a random password (won't be used with magic links)
      const randomPassword = Math.random().toString(36).slice(-10);
      
      // Create new user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || "",
        password: randomPassword,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            linkedIn: userData.linkedIn,
            institution: userData.institution,
            location: userData.location,
            role: userData.role,
          },
          emailRedirectTo: window.location.origin + PATHS.PENDING,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Your account is pending approval. We'll notify you once approved.",
      });
      
      navigate(PATHS.PENDING);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate(PATHS.LOGIN);
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return {
    sendMagicLink,
    loginWithPassword,
    resetPassword,
    updatePassword,
    register,
    logout
  };
};
