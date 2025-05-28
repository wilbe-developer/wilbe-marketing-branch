
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
  const [authInitialized, setAuthInitialized] = useState(false);
  
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

  // Detect magic link tokens in URL
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
      const url = new URL(window.location.href);
      const type = url.searchParams.get("type");
      
      if (type === "recovery") {
        console.log("Recovery mode detected from URL param");
        setIsRecoveryMode(true);
        return;
      }
      
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
    
    const handleHashChange = () => {
      checkRecoveryMode();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Main authentication initialization effect
  useEffect(() => {
    console.log("Initializing authentication system...");
    
    // Check for magic link tokens immediately
    const hasMagicTokens = hasMagicLinkTokens();
    if (hasMagicTokens && !isRecoveryMode) {
      console.log("Magic link tokens detected, starting processing...");
      setIsMagicLinkProcessing(true);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession?.user);
        
        // Handle magic link authentication success
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
          try {
            await fetchUserProfile(newSession.user.id);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        } else {
          setUser(null);
        }
        
        // Mark auth as initialized after first state change
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (!authInitialized) {
            setAuthInitialized(true);
            setLoading(false);
          }
          return;
        }
        
        console.log("Initial session check:", !!existingSession?.user);
        
        if (existingSession?.user) {
          setSession(existingSession);
          console.log("Found existing session, fetching profile for:", existingSession.user.id);
          try {
            await fetchUserProfile(existingSession.user.id);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
        
        // Mark auth as initialized if not already done by auth state change
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in initial session check:", error);
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    };

    // Delay session check if processing magic link to avoid conflicts
    if (hasMagicTokens && !isRecoveryMode) {
      console.log("Delaying session check due to magic link processing...");
      const sessionCheckDelay = setTimeout(() => {
        getInitialSession();
      }, 1500);
      
      // Set timeout to stop magic link processing if it takes too long
      const processingTimeout = setTimeout(() => {
        console.log("Magic link processing timeout - stopping processing");
        setIsMagicLinkProcessing(false);
        getInitialSession();
      }, 5000);
      
      return () => {
        clearTimeout(sessionCheckDelay);
        clearTimeout(processingTimeout);
        subscription.unsubscribe();
      };
    } else {
      // No magic link tokens, check session immediately
      getInitialSession();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [isRecoveryMode, fetchUserProfile]);

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
    loading: loading || !authInitialized, 
    isRecoveryMode, 
    isMagicLinkProcessing,
    authInitialized
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
        loading: loading || !authInitialized,
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
