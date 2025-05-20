
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/lib/constants";
import { toast } from "sonner";
import { SprintSignupAnswers } from "@/types/sprint-signup";
import { useSprintFileUpload } from "./useSprintFileUpload";
import { useAuth } from "./useAuth";

export const useSprintSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadFounderProfile } = useSprintFileUpload();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const silentSignup = async (answers: SprintSignupAnswers) => {
    setIsSubmitting(true);
    try {
      // Make sure we have an email for creating a new account
      if (!isAuthenticated && !answers.email) {
        toast.error("Email is required to create your sprint profile.");
        return;
      }

      let userId = user?.id;

      // If no user exists, create one using the provided email
      if (!isAuthenticated) {
        console.log("Creating new user with email:", answers.email);
        
        // Generate a random password
        const tempPassword = Math.random().toString(36).slice(-10);
        
        // Sign up with the provided email
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: answers.email,
          password: tempPassword,
          options: {
            data: { 
              tempAccount: true,
              firstName: answers.name?.split(' ')[0] || '',
              lastName: answers.name?.split(' ').slice(1).join(' ') || ''
            }
          }
        });

        if (signUpError) {
          console.error("Signup error:", signUpError);
          throw signUpError;
        }
        
        if (!authData.user) {
          throw new Error("Failed to create user account");
        }
        
        console.log("User created successfully:", authData.user.id);
        userId = authData.user.id;

        // Send welcome email with password reset instructions
        toast.success(
          "Account created! Please check your email to set your password.",
          { duration: 6000 }
        );
      }

      if (!userId) {
        throw new Error("Failed to get user ID");
      }

      console.log("Creating/updating sprint profile for user:", userId);

      // Process boolean values
      const getBooleanValue = (value: string | undefined | null) => value === 'yes';

      // Create/update the profile in Supabase - adapted to match SprintSignupWindows.ts field IDs
      const { error: profileError } = await supabase.rpc('create_sprint_profile', {
        p_user_id: userId,
        p_name: answers.name || '',
        p_email: answers.email || '',
        p_linkedin_url: answers.linkedin || '',
        p_cv_url: answers.cv || '',
        p_current_job: answers.job || '',
        p_company_incorporated: getBooleanValue(answers.incorporated),
        p_received_funding: getBooleanValue(answers.funding_received),
        p_funding_details: answers.funding_details || '',
        p_has_deck: getBooleanValue(answers.deck),
        p_team_status: answers.team || '',
        p_commercializing_invention: getBooleanValue(answers.invention),
        p_university_ip: getBooleanValue(answers.ip_concerns),
        p_tto_engaged: answers.ip === 'tto_yes' || false,
        p_problem_defined: answers.problem === 'yes' || false,
        p_customer_engagement: answers.customers || '',
        p_market_known: getBooleanValue(answers.market_known),
        p_market_gap_reason: answers.market_gap_reason || '',
        p_funding_amount: answers.funding_amount_text || '',
        p_has_financial_plan: getBooleanValue(answers.funding_plan),
        p_funding_sources: Array.isArray(answers.funding_sources) ? answers.funding_sources : [],
        p_experiment_validated: getBooleanValue(answers.experiment),
        p_industry_changing_vision: getBooleanValue(answers.success_vision_10yr),
        
        // Updated field mapping for new fields in SprintSignupWindows.ts
        p_is_scientist_engineer: getBooleanValue(answers.is_scientist_engineer),
        p_job_type: answers.job_type || '',
        p_ip_concerns: getBooleanValue(answers.ip_concerns),
        p_potential_beneficiaries: getBooleanValue(answers.potential_beneficiaries),
        p_specific_customers: getBooleanValue(answers.specific_customers),
        p_customer_evidence: getBooleanValue(answers.customer_evidence),
        p_competition_research: getBooleanValue(answers.competition_research),
        p_success_vision_1yr: getBooleanValue(answers.success_vision_1yr),
        p_success_vision_10yr: getBooleanValue(answers.success_vision_10yr),
        p_impact_scale: Array.isArray(answers.impact_scale) ? answers.impact_scale : [],
        p_prior_accelerators: getBooleanValue(answers.prior_accelerators),
        p_prior_accelerators_details: answers.prior_accelerators_details || '',
        p_planned_accelerators: getBooleanValue(answers.planned_accelerators),
        p_planned_accelerators_details: answers.planned_accelerators_details || '',
        p_lab_space_needed: getBooleanValue(answers.lab_space_needed),
        p_lab_space_secured: getBooleanValue(answers.lab_space_secured),
        p_lab_space_details: answers.lab_space_details || '',
        p_deck_feedback: getBooleanValue(answers.deck_feedback)
      });

      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }

      console.log("Sprint profile updated successfully");
      toast.success("Sprint profile updated successfully!");
      navigate(PATHS.SPRINT_DASHBOARD);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update sprint profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    silentSignup
  };
};
