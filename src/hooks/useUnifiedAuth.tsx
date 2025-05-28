
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PATHS } from "@/lib/constants";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useAuthActions } from "./useAuthActions";
import { useAuthState } from "./useAuthState";

interface UnifiedAuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  isSprintUser: boolean;
  isSandboxUser: boolean;
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
  isFullyReady: boolean;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const UnifiedAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const [userTypeLoading, setUserTypeLoading] = useState(false);
  const [isSprintUser, setIsSprintUser] = useState(false);
  const [isSandboxUser, setIsSandboxUser] = useState(false);
  
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

  const sendMagicLink = async (email: string, redirectTo?: string) => {
    return sendMagicLinkAction(email, redirectTo);
  };

  // Enhanced detection for all auth tokens including OAuth codes
  const hasAuthTokens = () => {
    const hash = window.location.hash;
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    
    console.log("UnifiedAuth - Checking for auth tokens:", { hash, search });
    
    const hasMagicLinkHash = hash.includes('access_token=') || 
                            hash.includes('type=magiclink') || 
                            hash.includes('refresh_token=');
    const hasOAuthCode = urlParams.has('code');
    const hasRecoveryToken = search.includes('type=recovery') || hash.includes('type=recovery');
    
    console.log("UnifiedAuth - Token detection:", { hasMagicLinkHash, hasOAuthCode, hasRecoveryToken });
    
    return hasMagicLinkHash || hasOAuthCode || hasRecoveryToken;
  };

  // Clean up auth parameters from URL after processing
  const cleanupAuthUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    url.hash = '';
    
    console.log("UnifiedAuth - Cleaning up auth URL, redirecting to:", url.pathname + url.search);
    window.history.replaceState(null, '', url.pathname + url.search);
  };

  // Check user type and roles
  const checkUserTypeAndRoles = async (userId: string) => {
    console.log("UnifiedAuth - Checking user type for:", userId);
    setUserTypeLoading(true);
    
    try {
      // Check if user has completed sprint onboarding
      const { data: hasSprintProfile, error: sprintError } = await supabase
        .rpc('has_completed_sprint_onboarding', {
          p_user_id: userId
        });

      if (sprintError) {
        console.error("UnifiedAuth - Sprint profile check error:", sprintError);
      }

      const isSprintUserResult = hasSprintProfile || false;
      const isSandboxUserResult = !isSprintUserResult;

      console.log("UnifiedAuth - User type results:", { 
        isSprintUser: isSprintUserResult, 
        isSandboxUser: isSandboxUserResult
      });

      setIsSprintUser(isSprintUserResult);
      setIsSandboxUser(isSandboxUserResult);
      setUserTypeLoading(false);
      
      return { isSprintUser: isSprintUserResult, isSandboxUser: isSandboxUserResult };
    } catch (error) {
      console.error("UnifiedAuth - Error checking user type:", error);
      setIsSprintUser(false);
      setIsSandboxUser(true); // Default to sandbox user on error
      setUserTypeLoading(false);
      
      return { isSprintUser: false, isSandboxUser: true };
    }
  };

  // Check for recovery mode
  useEffect(() => {
    const checkRecoveryMode = () => {
      const url = new URL(window.location.href);
      const type = url.searchParams.get("type");
      
      if (type === "recovery") {
        console.log("UnifiedAuth - Recovery mode detected from URL param");
        setIsRecoveryMode(true);
        return;
      }
      
      if (window.location.pathname === PATHS.PASSWORD_RESET) {
        console.log("UnifiedAuth - On password reset page, checking for hash fragment...");
        if (window.location.hash) {
          console.log("UnifiedAuth - Hash fragment found, likely a recovery token");
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
    console.log("UnifiedAuth - Initializing authentication system...");
    
    // Check for any auth tokens immediately
    const hasTokens = hasAuthTokens();
    if (hasTokens && !isRecoveryMode) {
      console.log("UnifiedAuth - Auth tokens detected, starting processing...");
      setIsMagicLinkProcessing(true);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("UnifiedAuth - State changed:", event, !!newSession?.user);
        
        // Handle successful authentication
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession?.user) {
          console.log("UnifiedAuth - Authentication successful, fetching profile...");
          
          // Stop processing and clean up URL
          if (isMagicLinkProcessing) {
            setIsMagicLinkProcessing(false);
            setTimeout(() => {
              cleanupAuthUrl();
            }, 100);
          }
          
          // Set session first
          setSession(newSession);
          
          // Then fetch user profile and determine type
          try {
            await fetchUserProfile(newSession.user.id);
            await checkUserTypeAndRoles(newSession.user.id);
            console.log("UnifiedAuth - Profile and user type fetched successfully");
          } catch (error) {
            console.error("UnifiedAuth - Error fetching user profile or type:", error);
          }
        }
        
        // Handle sign out
        if (event === 'SIGNED_OUT') {
          console.log("UnifiedAuth - User signed out");
          setIsMagicLinkProcessing(false);
          setSession(null);
          setUser(null);
          setIsSprintUser(false);
          setIsSandboxUser(false);
        }
        
        // Mark auth as initialized after first state change
        if (!authInitialized) {
          console.log("UnifiedAuth - Marking as initialized");
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    );

    // Get initial session with enhanced error handling
    const getInitialSession = async () => {
      try {
        console.log("UnifiedAuth - Checking for existing session...");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("UnifiedAuth - Error getting session:", error);
          setIsMagicLinkProcessing(false);
          
          if (!authInitialized) {
            setAuthInitialized(true);
            setLoading(false);
          }
          return;
        }
        
        console.log("UnifiedAuth - Initial session check:", !!existingSession?.user);
        
        if (existingSession?.user) {
          setSession(existingSession);
          console.log("UnifiedAuth - Found existing session, fetching profile for:", existingSession.user.id);
          
          try {
            await fetchUserProfile(existingSession.user.id);
            await checkUserTypeAndRoles(existingSession.user.id);
            console.log("UnifiedAuth - Existing session profile and type fetched");
          } catch (error) {
            console.error("UnifiedAuth - Error fetching profile for existing session:", error);
          }
          
          // If we were processing auth tokens and now have a session, we're done
          if (isMagicLinkProcessing) {
            setIsMagicLinkProcessing(false);
            setTimeout(() => {
              cleanupAuthUrl();
            }, 100);
          }
        }
        
        // Mark auth as initialized
        if (!authInitialized) {
          console.log("UnifiedAuth - Initial session check complete, marking as initialized");
          setAuthInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("UnifiedAuth - Error in initial session check:", error);
        setIsMagicLinkProcessing(false);
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    };

    // Immediate session check
    getInitialSession();

    // Set timeout for auth processing
    let processingTimeout: NodeJS.Timeout;
    if (hasTokens && !isRecoveryMode) {
      processingTimeout = setTimeout(() => {
        console.warn("UnifiedAuth - Processing timeout reached");
        setIsMagicLinkProcessing(false);
        
        // If still processing and no session, clean up and show error
        if (isMagicLinkProcessing && !session?.user) {
          console.error("UnifiedAuth - Processing failed, cleaning up");
          cleanupAuthUrl();
          toast({
            title: "Authentication failed",
            description: "Please try logging in again.",
            variant: "destructive"
          });
        }
      }, 8000);
    }

    return () => {
      subscription.unsubscribe();
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [isRecoveryMode]);

  // Computed values
  const isAdmin = !!user?.isAdmin;
  const isApproved = !!user?.approved;
  const isAuthenticated = !!user;
  const isFullyReady = authInitialized && !loading && !userTypeLoading && !isMagicLinkProcessing;

  console.log("UnifiedAuth - Provider state:", { 
    isAuthenticated, 
    isAdmin, 
    isApproved, 
    isSprintUser,
    isSandboxUser,
    loading: loading || !authInitialized || userTypeLoading, 
    isRecoveryMode, 
    isMagicLinkProcessing,
    isFullyReady,
    authInitialized,
    userTypeLoading,
    hasUser: !!user
  });

  return (
    <UnifiedAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isApproved,
        isSprintUser,
        isSandboxUser,
        loginOrSignup,
        sendMagicLink,
        loginWithPassword,
        resetPassword,
        updatePassword,
        register,
        logout,
        updateProfile,
        loading: loading || !authInitialized || userTypeLoading,
        isRecoveryMode,
        isMagicLinkProcessing,
        isFullyReady
      }}
    >
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error("useUnifiedAuth must be used within an UnifiedAuthProvider");
  }
  return context;
};
