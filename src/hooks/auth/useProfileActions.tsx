
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { applicationService } from "@/services/applicationService";

interface UseProfileActionsProps {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
}

export const useProfileActions = ({
  user,
  setUser,
  setLoading,
  toast
}: UseProfileActionsProps) => {
  
  // Fetch user profile using unified profile function
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching unified user profile for:", userId);
      
      // Get the unified profile data
      const { data: unifiedData, error: unifiedError } = await supabase
        .rpc('get_unified_profile', { p_user_id: userId });
        
      if (unifiedError) {
        console.error('Error fetching unified user profile:', unifiedError);
        setLoading(false);
        return;
      }
      
      // Check if user has admin role using our database function
      const { data: isAdminData, error: isAdminError } = await supabase
        .rpc('is_admin', { user_id: userId });
      
      if (isAdminError) {
        console.error('Error checking admin role:', isAdminError);
      }
      
      // Check if user is member using our database function
      const { data: isMemberData, error: isMemberError } = await supabase
        .rpc('is_member', { user_id: userId });
      
      if (isMemberError) {
        console.error('Error checking member status:', isMemberError);
      }
      
      const isAdmin = isAdminData || false;
      const isMember = isMemberData || false;
      
      // Get application status using our service
      const membershipApplicationStatus = await applicationService.getApplicationStatus(userId);
      
      console.log("Role check results:", { isAdmin, isMember, membershipApplicationStatus });
      
      if (unifiedData && unifiedData.length > 0) {
        const profileData = unifiedData[0];
        console.log("Unified user profile found:", profileData, "Is admin:", isAdmin, "Is member:", isMember, "Application status:", membershipApplicationStatus);
        
        // Transform unified profile data to match our UserProfile interface
        const userProfile: UserProfile = {
          id: profileData.user_id,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || '',
          linkedIn: profileData.linked_in,
          institution: profileData.institution,
          location: profileData.location,
          role: profileData.role, // This is just job role, not system role
          bio: profileData.bio,
          about: profileData.about,
          approved: profileData.approved || false,
          createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
          avatar: profileData.avatar,
          isAdmin: isAdmin, // Using the role-based check
          isMember: isMember, // Using the role-based check
          twitterHandle: profileData.twitter_handle,
          expertise: profileData.expertise,
          activityStatus: profileData.activity_status,
          lastLoginDate: profileData.last_login_date ? new Date(profileData.last_login_date) : undefined,
          status: profileData.status,
          membershipApplicationStatus: membershipApplicationStatus // New computed field
        };
        setUser(userProfile);
      }
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function - now handles both profiles and sprint_profiles sync
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Not authenticated");
      }
      
      // Transform data to match database fields
      const dbData: any = {};

      if (data.firstName !== undefined) dbData.first_name = data.firstName;
      if (data.lastName !== undefined) dbData.last_name = data.lastName;
      if (data.email !== undefined) dbData.email = data.email;
      if (data.linkedIn !== undefined) dbData.linked_in = data.linkedIn;
      if (data.institution !== undefined) dbData.institution = data.institution;
      if (data.location !== undefined) dbData.location = data.location;
      if (data.role !== undefined) dbData.role = data.role; // This is just job role, not access role
      if (data.bio !== undefined) dbData.bio = data.bio;
      if (data.about !== undefined) dbData.about = data.about;
      if (data.avatar !== undefined) dbData.avatar = data.avatar;
      if (data.twitterHandle !== undefined) dbData.twitter_handle = data.twitterHandle;
      if (data.expertise !== undefined) dbData.expertise = data.expertise;
      if (data.activityStatus !== undefined) dbData.activity_status = data.activityStatus;
      if (data.status !== undefined) dbData.status = data.status;
      
      // Update profile in Supabase - this will use upsert pattern for unified handling
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          ...dbData 
        }, { 
          onConflict: 'id' 
        });
      
      if (error) {
        throw error;
      }
      
      // Re-fetch the user profile to ensure we have the latest unified data
      await fetchUserProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit membership application
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

      console.log("Submitting membership application:", applicationData);
      await applicationService.submitMembershipApplication(user.id, applicationData);
      
      // Re-fetch the user profile to get updated application status
      await fetchUserProfile(user.id);
      
      toast({
        title: "Application submitted",
        description: "Your membership application has been submitted successfully.",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserProfile,
    updateProfile,
    submitMembershipApplication
  };
};
