
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PATHS } from "@/lib/constants";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  isRecoveryMode: boolean;
  isMagicLinkProcessing: boolean;
  loginOrSignup: (email: string) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<{ success: boolean }>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  register: (userData: Partial<UserProfile>) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isMagicLinkProcessing, setIsMagicLinkProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile from database
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

      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      const isAdmin = roles?.some(r => r.role === 'admin') || false;
      const isApproved = roles?.some(r => r.role === 'user') || false;

      const userProfile: UserProfile = {
        id: userId,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        linkedIn: data.linked_in || '',
        institution: data.institution || '',
        role: data.role || '',
        location: data.location || '',
        approved: isApproved,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        isAdmin: isAdmin
      };

      return userProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  // Check if user has completed sprint onboarding
  const checkUserType = async (userId: string) => {
    try {
      const { data: sprintProfile } = await supabase
        .from('sprint_profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      return sprintProfile && sprintProfile.length > 0;
    } catch (error) {
      console.error("Error checking user type:", error);
      return false;
    }
  };

  // Handle redirect after authentication
  const handlePostAuthRedirect = async (userId: string) => {
    try {
      const isSprintUser = await checkUserType(userId);
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      if (redirectPath) {
        navigate(redirectPath);
      } else if (isSprintUser) {
        navigate(PATHS.SPRINT_DASHBOARD);
      } else {
        navigate(PATHS.HOME);
      }
    } catch (error) {
      console.error("Error handling redirect:", error);
      navigate(PATHS.HOME);
    }
  };

  // Login or signup function
  const loginOrSignup = async (email: string) => {
    try {
      setLoading(true);
      
      // Try signup first (for new users this creates account instantly)
      const { data, error } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-10),
        options: {
          emailRedirectTo: window.location.origin + "/",
        }
      });
      
      if (error?.message.includes("User already registered")) {
        // User exists, send magic link
        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin + "/",
          }
        });
        
        toast({
          title: "Check your email",
          description: "We've sent you a login link.",
        });
      } else if (error) {
        throw error;
      } else {
        // New user created and logged in
        toast({
          title: "Welcome!",
          description: "Your account has been created.",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Login with password
  const loginWithPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
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
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send magic link
  const sendMagicLink = async (email: string, redirectTo?: string) => {
    try {
      setLoading(true);
      const redirectPath = redirectTo || "/";
      
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
      console.error("Magic link error:", error);
      toast({
        title: "Failed to send magic link",
        description: "Please try again.",
        variant: "destructive",
      });
      
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
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
      console.error("Password reset error:", error);
      toast({
        title: "Failed to send password reset email",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update password
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
      console.error("Password update error:", error);
      toast({
        title: "Failed to update password",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
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
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) return;
      
      setLoading(true);
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
      console.error("Profile update error:", error);
      toast({
        title: "Failed to update profile",
        description: "Please try again.",
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
      navigate(PATHS.LOGIN);
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
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

  // Initialize auth
  useEffect(() => {
    // Check for magic link processing
    const hash = window.location.hash;
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    
    const hasMagicLinkHash = hash.includes('access_token=') || hash.includes('type=magiclink');
    const hasOAuthCode = urlParams.has('code');
    const hasRecoveryToken = search.includes('type=recovery') || hash.includes('type=recovery');
    
    if ((hasMagicLinkHash || hasOAuthCode) && !hasRecoveryToken) {
      setIsMagicLinkProcessing(true);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, !!session?.user);
        
        if (session?.user) {
          // User signed in
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
          
          // Handle redirect for magic link users
          if (event === 'SIGNED_IN' && isMagicLinkProcessing) {
            setIsMagicLinkProcessing(false);
            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            url.searchParams.delete('state');
            url.hash = '';
            window.history.replaceState(null, '', url.pathname + url.search);
            
            setTimeout(() => handlePostAuthRedirect(session.user.id), 100);
          }
        } else {
          // User signed out
          setUser(null);
          setIsMagicLinkProcessing(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id).then(userProfile => {
          setUser(userProfile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;
  const isApproved = !!user?.approved;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isApproved,
        isRecoveryMode,
        isMagicLinkProcessing,
        loginOrSignup,
        loginWithPassword,
        sendMagicLink,
        resetPassword,
        updatePassword,
        register,
        updateProfile,
        logout,
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
