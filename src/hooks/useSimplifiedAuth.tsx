import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PATHS } from "@/lib/constants";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
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
  error: string | null;
  retryAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SimplifiedAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isMagicLinkProcessing, setIsMagicLinkProcessing] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [userTypeLoading, setUserTypeLoading] = useState(false);
  const [isSprintUser, setIsSprintUser] = useState(false);
  const [isSandboxUser, setIsSandboxUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Clear error when retrying
  const retryAuth = () => {
    setError(null);
    setLoading(true);
    initializeAuth();
  };

  // Fetch user profile
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      const userProfile: UserProfile = {
        id: userId,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        linkedIn: data.linked_in || '',
        institution: data.institution || '',
        role: data.role || '',
        location: data.location || '',
        approved: data.approved || false,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        isAdmin: false // Will be set by role check
      };

      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  // Check user type and roles
  const checkUserTypeAndRoles = async (userId: string) => {
    try {
      setUserTypeLoading(true);
      
      // Check if user has completed sprint onboarding
      const { data: hasSprintProfile, error: sprintError } = await supabase
        .rpc('has_completed_sprint_onboarding', { p_user_id: userId });

      if (sprintError) {
        console.error("Sprint profile check error:", sprintError);
        // Fallback to direct query if function fails
        const { data: sprintData } = await supabase
          .from('sprint_profiles')
          .select('id')
          .eq('user_id', userId)
          .limit(1);
        
        const isSprintUserResult = (sprintData && sprintData.length > 0) || false;
        setIsSprintUser(isSprintUserResult);
        setIsSandboxUser(!isSprintUserResult);
      } else {
        const isSprintUserResult = hasSprintProfile || false;
        setIsSprintUser(isSprintUserResult);
        setIsSandboxUser(!isSprintUserResult);
      }

      // Check admin role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      const isAdmin = roles?.some(r => r.role === 'admin') || false;
      const isApproved = roles?.some(r => r.role === 'user') || false;

      if (user) {
        setUser(prev => prev ? { ...prev, isAdmin, approved: isApproved } : null);
      }

      setUserTypeLoading(false);
    } catch (error) {
      console.error("Error checking user type:", error);
      setIsSprintUser(false);
      setIsSandboxUser(true);
      setUserTypeLoading(false);
    }
  };

  // Authentication actions
  const loginOrSignup = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-10),
        options: {
          emailRedirectTo: window.location.origin + "/",
        }
      });
      
      if (error) {
        if (error.message.includes("User already registered")) {
          const { error: magicLinkError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: window.location.origin + "/",
            }
          });
          
          if (magicLinkError) {
            throw magicLinkError;
          }
          
          toast({
            title: "Magic link sent",
            description: "Check your email for a login link.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Account created!",
          description: "You have been successfully logged in.",
        });
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const sendMagicLink = async (email: string, customRedirectTo?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const redirectPath = customRedirectTo || "/";
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + redirectPath,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Magic link sent",
        description: "Check your email for a login link.",
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Failed to send magic link",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Failed to send password reset email",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Failed to update password",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      
      const randomPassword = Math.random().toString(36).slice(-10);
      
      const { error } = await supabase.auth.signUp({
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsSprintUser(false);
      setIsSandboxUser(false);
      setError(null);
      
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

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          linked_in: data.linkedIn,
          institution: data.institution,
          location: data.location,
          role: data.role,
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Failed to update profile",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check for recovery mode
  useEffect(() => {
    const checkRecoveryMode = () => {
      const url = new URL(window.location.href);
      const type = url.searchParams.get("type");
      
      if (type === "recovery" || window.location.pathname === PATHS.PASSWORD_RESET) {
        setIsRecoveryMode(true);
      }
    };
    
    checkRecoveryMode();
  }, []);

  // Initialize auth with timeout
  const initializeAuth = async () => {
    try {
      console.log("Initializing simplified auth...");
      
      // Check for auth tokens
      const hash = window.location.hash;
      const search = window.location.search;
      const urlParams = new URLSearchParams(search);
      
      const hasMagicLinkHash = hash.includes('access_token=') || hash.includes('type=magiclink');
      const hasOAuthCode = urlParams.has('code');
      const hasRecoveryToken = search.includes('type=recovery') || hash.includes('type=recovery');
      
      if ((hasMagicLinkHash || hasOAuthCode) && !hasRecoveryToken) {
        setIsMagicLinkProcessing(true);
      }

      // Get initial session
      const { data: { session: existingSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        setError("Failed to initialize authentication");
        return;
      }
      
      if (existingSession?.user) {
        console.log("Found existing session");
        setSession(existingSession);
        await fetchUserProfile(existingSession.user.id);
        await checkUserTypeAndRoles(existingSession.user.id);
        
        if (isMagicLinkProcessing) {
          setIsMagicLinkProcessing(false);
          // Clean up URL
          const url = new URL(window.location.href);
          url.searchParams.delete('code');
          url.searchParams.delete('state');
          url.hash = '';
          window.history.replaceState(null, '', url.pathname + url.search);
        }
      }
      
      setAuthInitialized(true);
    } catch (error) {
      console.error("Error initializing auth:", error);
      setError("Failed to initialize authentication");
    } finally {
      setLoading(false);
      setIsMagicLinkProcessing(false);
    }
  };

  // Main auth initialization
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession?.user);
        
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession?.user) {
          setSession(newSession);
          setIsMagicLinkProcessing(false);
          
          // Defer the async operations to avoid blocking the auth state change
          setTimeout(async () => {
            try {
              await fetchUserProfile(newSession.user.id);
              await checkUserTypeAndRoles(newSession.user.id);
            } catch (error) {
              console.error("Error in auth state change:", error);
              setError("Failed to load user data");
            }
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsSprintUser(false);
          setIsSandboxUser(false);
          setError(null);
        }
        
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    );

    // Initialize auth with timeout
    const timeoutId = setTimeout(() => {
      if (!authInitialized) {
        console.warn("Auth initialization timeout");
        setError("Authentication initialization timed out");
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 10000); // 10 second timeout

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // Computed values
  const isAdmin = !!user?.isAdmin;
  const isApproved = !!user?.approved;
  const isAuthenticated = !!user && !!session;
  const isFullyReady = authInitialized && !loading && !userTypeLoading && !isMagicLinkProcessing && !error;

  console.log("Simplified Auth state:", { 
    isAuthenticated, 
    isAdmin, 
    isApproved, 
    isSprintUser,
    isSandboxUser,
    loading, 
    isRecoveryMode, 
    isMagicLinkProcessing,
    isFullyReady,
    error,
    authInitialized,
    userTypeLoading
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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
        loading,
        isRecoveryMode,
        isMagicLinkProcessing,
        isFullyReady,
        error,
        retryAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSimplifiedAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSimplifiedAuth must be used within a SimplifiedAuthProvider");
  }
  return context;
};
