
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types";
import { Session } from "@supabase/supabase-js";
import { PATHS } from "@/lib/constants";
import { applicationService } from "@/services/applicationService";

interface UseAuthActionsProps {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  navigate: ReturnType<typeof useNavigate>;
  toast: any;
}

export const useAuthActions = ({
  user,
  setUser,
  setSession,
  setLoading,
  navigate,
  toast
}: UseAuthActionsProps) => {
  
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      
      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        if (profileError.code !== 'PGRST116') { // Not found error
          throw profileError;
        }
      }

      // Check if user is admin
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('is_admin', { user_id: userId });

      if (adminError) {
        console.error("Admin check error:", adminError);
      }

      // Check if user is member (includes admins)
      const { data: memberCheck, error: memberError } = await supabase
        .rpc('is_member', { user_id: userId });

      if (memberError) {
        console.error("Member check error:", memberError);
      }

      // Get application status using our new service
      const membershipApplicationStatus = await applicationService.getApplicationStatus(userId);

      const userProfile: UserProfile = {
        id: userId,
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        email: profile?.email || "",
        linkedIn: profile?.linked_in || "",
        institution: profile?.institution || "",
        role: profile?.role || "",
        location: profile?.location || "",
        approved: profile?.approved || false,
        avatar: profile?.avatar || "",
        about: profile?.about || "",
        expertise: profile?.expertise || "",
        bio: profile?.bio || "",
        coverPhoto: profile?.cover_photo || "",
        twitterHandle: profile?.twitter_handle || "",
        status: profile?.status || "",
        activityStatus: profile?.activity_status || "",
        isAdmin: adminCheck || false,
        isMember: memberCheck || false,
        membershipApplicationStatus: membershipApplicationStatus
      };

      console.log("Setting user profile:", userProfile);
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const sendMagicLink = async (email: string, redirectTo?: string) => {
    try {
      setLoading(true);
      
      const redirectUrl = redirectTo 
        ? `${window.location.origin}${redirectTo}`
        : `${window.location.origin}${PATHS.HOME}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      toast({
        title: "Magic link sent!",
        description: "Check your email for the magic link to sign in.",
      });

      return { success: true };
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      
      navigate(PATHS.HOME);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
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
        redirectTo: `${window.location.origin}${PATHS.PASSWORD_RESET}`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent!",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been updated successfully.",
      });
      
      navigate(PATHS.HOME);
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      
      if (!userData.email || !userData.firstName) {
        throw new Error("Email and first name are required");
      }

      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: "temp-password-will-be-reset",
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName || "",
            linkedIn: userData.linkedIn || "",
            institution: userData.institution || "",
            role: userData.role || "",
            location: userData.location || "",
            avatar: userData.avatar || ""
          },
          emailRedirectTo: `${window.location.origin}${PATHS.HOME}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate(PATHS.LOGIN);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
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
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
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

      await applicationService.submitMembershipApplication(user.id, applicationData);
      
      // Re-fetch the user profile to get updated application status
      await fetchUserProfile(user.id);
      
      toast({
        title: "Application submitted",
        description: "Your membership application has been submitted successfully.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

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
