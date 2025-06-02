
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  isAdmin?: boolean;
  membershipApplicationStatus?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [hasSprintProfile, setHasSprintProfile] = useState(false);
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [userDashboardAccessEnabled, setUserDashboardAccessEnabled] = useState(false);
  const navigate = useNavigate();

  // Check if user has access to BSF Dashboard
  // Access granted if: hasSprintProfile AND (isDashboardActive OR userDashboardAccessEnabled)
  const hasDashboardAccess = hasSprintProfile && (isDashboardActive || userDashboardAccessEnabled);

  // Check if user is a member (for backward compatibility)
  const isMember = user?.membershipApplicationStatus === 'approved';

  // Fetch app settings (including dashboard active flag)
  const fetchAppSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');
      
      if (error) throw error;
      
      const dashboardSetting = data?.find(setting => setting.key === 'isDashboardActive');
      setIsDashboardActive(dashboardSetting?.value === true);
    } catch (error) {
      console.error('Error fetching app settings:', error);
    }
  };

  // Fetch sprint profile and check dashboard access
  const fetchSprintProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('sprint_profiles')
        .select('dashboard_access_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && profile) {
        setHasSprintProfile(true);
        setUserDashboardAccessEnabled(profile.dashboard_access_enabled || false);
      } else {
        setHasSprintProfile(false);
        setUserDashboardAccessEnabled(false);
      }
    } catch (error) {
      console.error('Error fetching sprint profile:', error);
      setHasSprintProfile(false);
      setUserDashboardAccessEnabled(false);
    }
  };

  // Fetch user profile and membership status
  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
      }

      // Check if user is admin
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
      }

      const isAdmin = roles?.some(role => role.role === 'admin') || false;

      // Get membership application status
      const { data: application, error: appError } = await supabase
        .from('user_applications')
        .select('status')
        .eq('user_id', userId)
        .eq('application_type', 'membership')
        .maybeSingle();

      if (appError && appError.code !== 'PGRST116') {
        console.error("Error fetching application:", appError);
      }

      const membershipApplicationStatus = application?.status || 'not_started';

      // Set user data
      setUser({
        id: userId,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: profile?.email || '',
        avatar: profile?.avatar || '',
        isAdmin,
        membershipApplicationStatus
      });

      // Fetch sprint profile and dashboard access
      await fetchSprintProfile(userId);

    } catch (error) {
      console.error("Error loading user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Session error:", error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
    fetchAppSettings();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        setSession(session);
        
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveryMode(true);
        } else {
          setIsRecoveryMode(false);
        }
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setHasSprintProfile(false);
          setUserDashboardAccessEnabled(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Successfully logged in!");
      return { success: true, data };
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (email: string, password: string) => {
    return login(email, password);
  };

  const signup = async (email: string, password: string, metadata?: any, redirectTo?: string) => {
    try {
      setLoading(true);
      
      const options: any = {
        email,
        password,
      };

      if (metadata) {
        options.options = {
          data: metadata
        };
      }

      if (redirectTo) {
        options.options = {
          ...options.options,
          emailRedirectTo: `${window.location.origin}${redirectTo}`
        };
      }

      const { data, error } = await supabase.auth.signUp(options);

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success("Please check your email for a confirmation link!");
      } else {
        toast.success("Account created successfully!");
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    return signup(userData.email, "temp-password", userData);
  };

  const sendMagicLink = async (email: string, redirectTo?: string) => {
    try {
      const options: any = { email };
      
      if (redirectTo) {
        options.options = {
          emailRedirectTo: `${window.location.origin}${redirectTo}`
        };
      }

      const { error } = await supabase.auth.signInWithOtp(options);
      
      if (error) throw error;

      toast.success("Magic link sent! Please check your email.");
      return { success: true };
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast.error(error.message || "Failed to send magic link");
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset`,
      });
      
      if (error) throw error;

      toast.success("Password reset email sent!");
      return { success: true };
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send reset email");
      return { success: false, error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;

      toast.success("Password updated successfully!");
      navigate('/');
      return { success: true };
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
      return { success: false, error };
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          linked_in: data.linkedIn,
          institution: data.institution,
          role: data.role,
          location: data.location,
          about: data.about,
          expertise: data.expertise,
          bio: data.bio,
          cover_photo: data.coverPhoto,
          twitter_handle: data.twitterHandle,
          status: data.status,
          activity_status: data.activityStatus,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Re-fetch user profile to get latest data
      await fetchUserProfile(user.id);
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const submitMembershipApplication = async (applicationData: {
    firstName: string;
    lastName: string;
    institution?: string;
    linkedIn?: string;
  }) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Update profile first
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: applicationData.firstName,
          last_name: applicationData.lastName,
          institution: applicationData.institution,
          linked_in: applicationData.linkedIn,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Create or update application
      const { error: appError } = await supabase
        .from("user_applications")
        .upsert({
          user_id: user.id,
          application_type: 'membership',
          status: 'under_review',
          submitted_at: new Date().toISOString()
        });

      if (appError) throw appError;
      
      // Re-fetch the user profile to get updated application status
      await fetchUserProfile(user.id);
      
      toast.success("Application submitted successfully!");
      
      return { success: true };
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast.error(error.message || "Failed to submit application");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setHasSprintProfile(false);
      setUserDashboardAccessEnabled(false);
      navigate('/');
      toast.success("Successfully logged out!");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  // Refresh sprint profile data (useful when access is granted/revoked)
  const refreshSprintProfile = async () => {
    if (user?.id) {
      await fetchSprintProfile(user.id);
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session && !!user,
    isAdmin: user?.isAdmin || false,
    isMember,
    isRecoveryMode,
    hasSprintProfile,
    isDashboardActive,
    userDashboardAccessEnabled,
    hasDashboardAccess,
    login,
    loginWithPassword,
    signup,
    register,
    sendMagicLink,
    resetPassword,
    updatePassword,
    updateProfile,
    submitMembershipApplication,
    logout,
    refreshSprintProfile
  };
};

// Export AuthProvider from the existing useAuth.tsx file
export { AuthProvider } from './useAuth';
