
import { supabase } from "@/integrations/supabase/client";

export interface ApplicationSubmissionData {
  firstName: string;
  lastName: string;
  institution?: string;
  linkedIn?: string;
}

export const applicationService = {
  /**
   * Submit a membership application
   */
  async submitMembershipApplication(userId: string, data: ApplicationSubmissionData) {
    try {
      console.log("Submitting membership application for user:", userId, data);
      
      const { error } = await supabase.rpc('submit_membership_application', {
        p_user_id: userId,
        p_first_name: data.firstName,
        p_last_name: data.lastName,
        p_institution: data.institution || null,
        p_linkedin: data.linkedIn || null
      });

      if (error) {
        console.error("Error submitting membership application:", error);
        throw error;
      }

      console.log("Membership application submitted successfully");
      return { success: true };
    } catch (error) {
      console.error("Failed to submit membership application:", error);
      throw error;
    }
  },

  /**
   * Get the current application status for a user
   */
  async getApplicationStatus(userId: string, applicationType: string = 'membership') {
    try {
      const { data, error } = await supabase.rpc('get_application_status', {
        p_user_id: userId,
        p_application_type: applicationType
      });

      if (error) {
        console.error("Error getting application status:", error);
        return 'not_started';
      }

      return data || 'not_started';
    } catch (error) {
      console.error("Failed to get application status:", error);
      return 'not_started';
    }
  },

  /**
   * Check if user has completed the required profile fields for membership application
   */
  hasRequiredFields(user: { firstName?: string; lastName?: string; institution?: string; linkedIn?: string }) {
    return !!(user.firstName && user.lastName);
  },

  /**
   * Check if user needs to complete their profile for membership
   */
  needsProfileCompletion(user: { 
    isMember?: boolean; 
    membershipApplicationStatus?: 'not_started' | 'under_review' | null;
    firstName?: string; 
    lastName?: string; 
  }) {
    // If already a member, no need for profile completion
    if (user.isMember) {
      return false;
    }

    // If application is under review, no need to complete again
    if (user.membershipApplicationStatus === 'under_review') {
      return false;
    }

    // Need completion if status is not_started and missing required fields
    return user.membershipApplicationStatus === 'not_started' && !this.hasRequiredFields(user);
  }
};
