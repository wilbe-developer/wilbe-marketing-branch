
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PATHS } from "@/lib/constants";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useAuthState } from "./useAuthState";
import { useAuthActions } from "./useAuthActions";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  hasSprintProfile: boolean;
  hasDashboardAccess: boolean;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<{ success: boolean }>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  register: (userData: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  submitMembershipApplication: (data: { firstName: string; lastName: string; institution?: string; linkedIn?: string; }) => Promise<{ success: boolean }>;
  loading: boolean;
  isRecoveryMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    session, 
    loading, 
    setUser, 
    setSession, 
    setLoading 
  } = useAuthState();
  
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [hasSprintProfile, setHasSprintProfile] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    sendMagicLink: sendMagicLinkAction, 
    loginWithPassword,
    resetPassword,
    updatePassword,
    register, 
    logout, 
    updateProfile, 
    submitMembershipApplication,
    fetchUserProfile
  } = useAuthActions({ 
    user, 
    setUser, 
    setSession, 
    setLoading, 
    navigate, 
    toast,
    setHasSprintProfile
  });

  // Modified sendMagicLink function to accept custom redirect path
  const sendMagicLink = async (email: string, redirectTo?: string) => {
    return sendMagicLinkAction(email, redirectTo);
  };

  // Check for recovery mode
  useEffect(() => {
    const checkRecoveryMode = () => {
      // Check URL parameters for recovery mode
      const url = new URL(window.location.href);
      const type = url.searchParams.get("type");
      
      if (type === "recovery") {
        console.log("Recovery mode detected from URL param");
        setIsRecoveryMode(true);
        return;
      }
      
      // Check for hash fragment which might indicate password reset
      if (window.location.pathname === PATHS.PASSWORD_RESET) {
        console.log("On password reset page, checking for hash fragment...");
        if (window.location.hash) {
          console.log("Hash fragment found, likely a recovery token");
          setIsRecoveryMode(true);
          return;
        }
      }
    };
    
    checkRecoveryMode();
    
    // Set up an event listener to catch changes to the URL
    const handleHashChange = () => {
      checkRecoveryMode();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Setup auth state listener and check initial session
  useEffect(() => {
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession);
        setSession(newSession);
        
        // If signed in, fetch user profile
        if (newSession?.user) {
          console.log("User signed in, fetching profile for:", newSession.user.id);
          // Use setTimeout to avoid potential Supabase client deadlock
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setHasSprintProfile(false);
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log("Existing session:", !!existingSession);
        
        if (existingSession?.user) {
          setSession(existingSession);
          console.log("Found existing session, fetching profile for:", existingSession.user.id);
          await fetchUserProfile(existingSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, setLoading, setSession, setUser]);

  // Using the roles from the user_roles table now
  const isAdmin = !!user?.isAdmin;
  const isMember = !!user?.isMember; // This will include admins since database function checks both 'member' and 'admin'
  const isAuthenticated = !!user;
  
  // Compute dashboard access: has sprint profile AND (global flag OR individual access OR is admin)
  const hasDashboardAccess = hasSprintProfile && (
    user?.isDashboardActive || 
    user?.dashboardAccessEnabled || 
    isAdmin
  );

  console.log("Auth provider state:", { isAuthenticated, isAdmin, isMember, hasSprintProfile, hasDashboardAccess, loading, isRecoveryMode });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isMember,
        hasSprintProfile,
        hasDashboardAccess,
        sendMagicLink,
        loginWithPassword,
        resetPassword,
        updatePassword,
        register,
        logout,
        updateProfile,
        submitMembershipApplication,
        loading,
        isRecoveryMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
