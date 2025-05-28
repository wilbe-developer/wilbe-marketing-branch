
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
  loginOrSignup: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Initialize auth
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, !!session?.user);
        
        if (session?.user) {
          // User signed in
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
          
          // Handle redirect for magic link users
          if (event === 'SIGNED_IN') {
            setTimeout(() => handlePostAuthRedirect(session.user.id), 100);
          }
        } else {
          // User signed out
          setUser(null);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        loginOrSignup,
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
