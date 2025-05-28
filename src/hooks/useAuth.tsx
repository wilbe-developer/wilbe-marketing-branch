
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

  // Enhanced detection for all auth tokens including OAuth codes
  const hasAuthTokens = () => {
    const hash = window.location.hash;
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    
    console.log("Checking for auth tokens:", { hash, search });
    
    // Check for magic link tokens in hash
    const hasMagicLinkHash = hash.includes('access_token=') || 
                            hash.includes('type=magiclink') || 
                            hash.includes('refresh_token=');
    
    // Check for OAuth code in query parameters
    const hasOAuthCode = urlParams.has('code');
    
    // Check for recovery tokens
    const hasRecoveryToken = search.includes('type=recovery') || hash.includes('type=recovery');
    
    console.log("Auth token detection:", { hasMagicLinkHash, hasOAuthCode, hasRecoveryToken });
    
    return hasMagicLinkHash || hasOAuthCode || hasRecoveryToken;
  };

  // Clean up auth parameters from URL after processing
  const cleanupAuthUrl = () => {
    const url = new URL(window.location.href);
    
    // Remove OAuth code parameter
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    
    // Clear hash fragment
    url.hash = '';
    
    console.log("Cleaning up auth URL, redirecting to:", url.pathname + url.search);
    window.history.replaceState(null, '', url.pathname + url.search);
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
    
    // Check for any auth tokens immediately
    const hasTokens = hasAuthTokens();
    if (hasTokens && !isRecoveryMode) {
      console.log("Auth tokens detected, starting processing...");
      setIsMagicLinkProcessing(true);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession?.user);
        
        // Handle successful authentication
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && isMagicLinkProcessing) {
          console.log("Authentication successful, cleaning up...");
          setIsMagicLinkProcessing(false);
          
          // Clean up URL after successful auth
          setTimeout(() => {
            cleanupAuthUrl();
          }, 100);
        }
        
        // Handle sign out
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setIsMagicLinkProcessing(false);
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

    // Get initial session with enhanced error handling
    const getInitialSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          // If we have auth tokens but session failed, try to process them
          if (hasTokens && !isRecoveryMode) {
            console.log("Session error but auth tokens present, attempting to process...");
            // Let the auth state change handler deal with it
          } else {
            setIsMagicLinkProcessing(false);
          }
          
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
          
          // If we were processing auth tokens and now have a session, we're done
          if (isMagicLinkProcessing) {
            setIsMagicLinkProcessing(false);
            setTimeout(() => {
              cleanupAuthUrl();
            }, 100);
          }
        }
        
        // Mark auth as initialized if not already done by auth state change
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in initial session check:", error);
        setIsMagicLinkProcessing(false);
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    };

    // Immediate session check for faster auth resolution
    getInitialSession();

    // Set timeout to stop processing if it takes too long
    let processingTimeout: NodeJS.Timeout;
    if (hasTokens && !isRecoveryMode) {
      processingTimeout = setTimeout(() => {
        console.log("Auth processing timeout - stopping processing and cleaning up");
        setIsMagicLinkProcessing(false);
        
        // If we're still stuck processing, clean up the URL and redirect to login
        if (isMagicLinkProcessing && !session?.user) {
          console.log("Auth processing failed, cleaning up and redirecting to login");
          cleanupAuthUrl();
          toast({
            title: "Authentication failed",
            description: "Please try logging in again.",
            variant: "destructive"
          });
          navigate(PATHS.LOGIN);
        }
      }, 8000); // Increased timeout for OAuth flows
    }

    return () => {
      subscription.unsubscribe();
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [isRecoveryMode, fetchUserProfile, toast, navigate]);

  // Stop magic link processing when user becomes authenticated
  useEffect(() => {
    if (session?.user && isMagicLinkProcessing) {
      console.log("User authenticated during processing, stopping processing");
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
