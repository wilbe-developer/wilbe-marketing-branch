
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
  isApproved: boolean;
  loginOrSignup: (email: string) => Promise<{ success: boolean }>;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<{ success: boolean }>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  register: (userData: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
  isRecoveryMode: boolean;
  isMagicLinkProcessing: boolean;
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
  const [isMagicLinkProcessing, setIsMagicLinkProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    loginOrSignup,
    sendMagicLink: sendMagicLinkAction, 
    loginWithPassword,
    resetPassword,
    updatePassword,
    register, 
    logout, 
    updateProfile, 
    fetchUserProfile
  } = useAuthActions({ 
    user, 
    setUser, 
    setSession, 
    setLoading, 
    navigate, 
    toast 
  });

  // Modified sendMagicLink function to accept custom redirect path
  const sendMagicLink = async (email: string, redirectTo?: string) => {
    return sendMagicLinkAction(email, redirectTo);
  };

  // Centralized magic link detection
  const hasMagicLinkTokens = () => {
    const hash = window.location.hash;
    const search = window.location.search;
    return hash.includes('access_token=') || 
           hash.includes('type=magiclink') || 
           hash.includes('refresh_token=') ||
           search.includes('type=recovery');
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

  // Centralized magic link processing in auth hook
  useEffect(() => {
    console.log("Setting up centralized auth processing...");
    
    // Check for magic link tokens immediately
    if (hasMagicLinkTokens() && !isRecoveryMode) {
      console.log("Magic link tokens detected, starting processing...");
      setIsMagicLinkProcessing(true);
      
      // Set a timeout to prevent infinite processing
      const processingTimeout = setTimeout(() => {
        console.log("Magic link processing timeout - continuing with normal auth flow");
        setIsMagicLinkProcessing(false);
      }, 5000);
      
      // Clean up timeout if component unmounts
      return () => {
        clearTimeout(processingTimeout);
      };
    }
  }, [isRecoveryMode]);

  // Setup auth state listener and session checking
  useEffect(() => {
    console.log("Setting up auth state listener and session check...");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession?.user);
        
        // Handle magic link authentication events
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && isMagicLinkProcessing) {
          console.log("Magic link authentication successful");
          setIsMagicLinkProcessing(false);
          
          // Clear URL hash after successful magic link auth
          if (window.location.hash) {
            console.log("Cleaning up URL hash after magic link success");
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
        
        setSession(newSession);
        
        // If signed in, fetch user profile
        if (newSession?.user) {
          console.log("User signed in, fetching profile for:", newSession.user.id);
          // Use setTimeout to avoid potential Supabase client conflicts
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const checkInitialSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        console.log("Initial session check:", !!existingSession?.user);
        
        if (existingSession?.user) {
          setSession(existingSession);
          console.log("Found existing session, fetching profile for:", existingSession.user.id);
          await fetchUserProfile(existingSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in initial session check:", error);
        setLoading(false);
      }
    };

    // If not processing magic link, check session immediately
    if (!isMagicLinkProcessing) {
      checkInitialSession();
    } else {
      // If processing magic link, wait a bit for Supabase to handle it
      console.log("Waiting for magic link processing before session check...");
      const sessionCheckDelay = setTimeout(() => {
        checkInitialSession();
      }, 1000);
      
      return () => {
        clearTimeout(sessionCheckDelay);
        subscription.unsubscribe();
      };
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, setLoading, setSession, setUser, isMagicLinkProcessing]);

  // Stop magic link processing when user becomes authenticated
  useEffect(() => {
    if (session?.user && isMagicLinkProcessing) {
      console.log("User authenticated during magic link processing, stopping processing");
      setIsMagicLinkProcessing(false);
    }
  }, [session?.user, isMagicLinkProcessing]);

  // Using the roles from the user_roles table now
  const isAdmin = !!user?.isAdmin;
  const isApproved = !!user?.approved;
  const isAuthenticated = !!user;

  console.log("Auth provider state:", { 
    isAuthenticated, 
    isAdmin, 
    isApproved, 
    loading, 
    isRecoveryMode, 
    isMagicLinkProcessing 
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isApproved,
        loginOrSignup,
        sendMagicLink,
        loginWithPassword,
        resetPassword,
        updatePassword,
        register,
        logout,
        updateProfile,
        loading,
        isRecoveryMode,
        isMagicLinkProcessing
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
