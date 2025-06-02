import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface UseAuthActionsParams {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: useNavigate;
  toast: ReturnType<typeof useToast>["toast"];
  setHasSprintProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAuthActions = ({ 
  user, 
  setUser, 
  setSession, 
  setLoading, 
  navigate, 
  toast,
  setHasSprintProfile
}: UseAuthActionsParams) => {
  const sendMagicLink = async (email: string, redirectTo: string = "") => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });
      if (error) {
        console.error("Error sending magic link:", error);
        toast({
          title: "Error",
          description: "Failed to send magic link. Please try again.",
          variant: "destructive",
        });
        return { success: false };
      }
      toast({
        title: "Success",
        description: "Magic link sent to your email!",
      });
      return { success: true };
    } catch (error) {
      console.error("Unexpected error sending magic link:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Error",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSession(data.session);
      navigate("/");
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset`,
      });

      if (error) {
        console.error("Reset password error:", error);
        toast({
          title: "Error",
          description: "Failed to send reset password link. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Reset password link sent to your email!",
      });
    } catch (error) {
      console.error("Unexpected reset password error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Update password error:", error);
        toast({
          title: "Error",
          description: "Failed to update password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
      navigate("/profile");
    } catch (error) {
      console.error("Unexpected update password error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<UserProfile>) => {
    try {
      setLoading(true);

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Error",
          description: "Email already exists. Please use a different email.",
          variant: "destructive",
        });
        return;
      }

      // Proceed with user creation
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password: userData.password!,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
          },
        },
      });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Error",
          description: "Failed to register. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSession(data.session);
      navigate("/");
      toast({
        title: "Success",
        description: "Registration successful! Please check your email to verify your account.",
      });
    } catch (error) {
      console.error("Unexpected registration error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error",
          description: "Failed to logout. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setUser(null);
      setSession(null);
      navigate("/login");
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      console.error("No user to update profile for.");
      toast({
        title: "Error",
        description: "No user session found.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update the user state with the new profile data
      setUser({ ...user, ...profileData });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Unexpected profile update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitMembershipApplication = async (data: { firstName: string; lastName: string; institution?: string; linkedIn?: string; }) => {
    try {
      setLoading(true);

      // Check if user is authenticated
      if (!user) {
        console.error("User not authenticated.");
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Update user profile with application data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          firstName: data.firstName,
          lastName: data.lastName,
          institution: data.institution,
          linkedIn: data.linkedIn,
          status: 'pending', // Set status to 'pending'
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Send email to admins about the new application
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          templateId: 8,
          emails: [process.env.NEXT_PUBLIC_WILBE_ADMIN_EMAIL],
          templateData: {
            subject: 'New Membership Application',
            message: `A new membership application has been submitted by ${data.firstName} ${data.lastName}. Please review in the admin dashboard.`,
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        toast({
          title: "Error",
          description: "Failed to notify admins about the application. Please try again.",
          variant: "destructive",
        });
        return { success: false };
      }

      toast({
        title: "Success",
        description: "Membership application submitted successfully!",
      });
      return { success: true };
    } catch (error) {
      console.error("Unexpected application submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error("Unexpected error checking admin role:", error);
      return false;
    }
  };

  const checkIsMember = async (userId: string): Promise<boolean> => {
    try {
      // Check if the user has either 'member' or 'admin' role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['member', 'admin']); // Check for both 'member' and 'admin'

      if (error) {
        console.error("Error checking member role:", error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error("Unexpected error checking member role:", error);
      return false;
    }
  };

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      console.log("Fetching user profile for:", userId);

      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_unified_profile', { p_user_id: userId });

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setLoading(false);
        return;
      }

      console.log("Profile data:", profileData);

      // Fetch global dashboard setting
      const { data: dashboardSetting, error: settingError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'dashboard_active')
        .single();

      if (settingError) {
        console.error("Error fetching dashboard setting:", settingError);
      }

      const isDashboardActive = dashboardSetting?.value?.active === true;

      // Check for sprint profile and get dashboard access
      const { data: sprintProfile, error: sprintError } = await supabase
        .from('sprint_profiles')
        .select('dashboard_access_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (sprintError) {
        console.error("Error checking sprint profile:", sprintError);
      }

      const hasSprintProfileData = !!sprintProfile;
      const dashboardAccessEnabled = sprintProfile?.dashboard_access_enabled || false;

      setHasSprintProfile(hasSprintProfileData);

      if (profileData && profileData.length > 0) {
        const profile = profileData[0];
        
        const userProfile: UserProfile = {
          id: profile.user_id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          linkedIn: profile.linked_in,
          institution: profile.institution,
          location: profile.location,
          role: profile.role,
          bio: profile.bio,
          about: profile.about,
          expertise: profile.expertise,
          avatar: profile.avatar,
          approved: profile.approved,
          createdAt: profile.created_at,
          activityStatus: profile.activity_status,
          status: profile.status,
          twitterHandle: profile.twitter_handle,
          lastLoginDate: profile.last_login_date,
          isAdmin: await checkIsAdmin(userId),
          isMember: await checkIsMember(userId),
          isDashboardActive,
          dashboardAccessEnabled
        };

        console.log("Setting user profile:", userProfile);
        setUser(userProfile);
      } else {
        console.log("No profile data found, creating minimal user object");
        const userProfile: UserProfile = {
          id: userId,
          isAdmin: await checkIsAdmin(userId),
          isMember: await checkIsMember(userId),
          isDashboardActive,
          dashboardAccessEnabled
        };
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setHasSprintProfile]);

  return {
    sendMagicLink,
    loginWithPassword,
    resetPassword,
    updatePassword,
    register,
    logout,
    updateProfile,
    submitMembershipApplication,
    fetchUserProfile
  };
};
