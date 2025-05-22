import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/lib/constants";
import { toast } from "sonner";
import { SprintSignupAnswers } from "@/types/sprint-signup";
import { useSprintFileUpload } from "./useSprintFileUpload";
import { useAuth } from "./useAuth";
import { useAppSettings } from "./useAppSettings";
import { sendSprintWaitingEmail } from "@/services/emailService";

export const useSprintSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadFounderProfile } = useSprintFileUpload();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isDashboardActive, isLoading: isLoadingSettings } = useAppSettings();

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
          // If user already exists, send a magic link instead
          if (signUpError.message?.includes("User already registered")) {
            console.log("User already exists, sending magic link instead");
            
            const { error: magicLinkError } = await supabase.auth.signInWithOtp({
              email: answers.email,
              options: {
                emailRedirectTo: window.location.origin + (isDashboardActive ? PATHS.SPRINT_DASHBOARD : PATHS.SPRINT_WAITING),
              }
            });
            
            if (magicLinkError) {
              console.error("Magic link error:", magicLinkError);
              throw new Error("Failed to send login link. Please try signing in first.");
            }
            
            toast.success(
              "We've sent you a login link. Please check your email to continue.",
              { duration: 6000 }
            );
            
            return; // Exit early since we're not creating a profile yet
          }
          
          console.error("Signup error:", signUpError);
          throw signUpError;
        }
        
        if (!authData.user) {
          throw new Error("Failed to create user account");
        }
        
        console.log("User created successfully:", authData.user.id);
        userId = authData.user.id;

        // Show success message for new users
        toast.success(
          "Account created successfully! You are now logged in.",
          { duration: 4000 }
        );
      }

      if (!userId) {
        throw new Error("Failed to get user ID");
      }

      console.log("Creating/updating sprint profile for user:", userId);

      // Process CV upload if available
      let cvUrl = answers.cv || '';
      if (answers.founder_profile && typeof answers.founder_profile === 'object') {
        // This means we have a file object from the uploader
        const uploadedCV = await uploadFounderProfile(userId);
        if (uploadedCV) {
          cvUrl = uploadedCV;
        }
      }

      // Process boolean values
      const getBooleanValue = (value: string | undefined | null) => value === 'yes';

      // Create/update the profile in Supabase - accurately map fields from SprintSignupWindows.ts
      const { error: profileError } = await supabase.rpc('create_sprint_profile', {
        p_user_id: userId,
        p_name: answers.name || '',
        p_email: answers.email || '',
        p_linkedin_url: answers.linkedin || '',
        p_cv_url: cvUrl,
        p_current_job: answers.job || '',
        p_company_incorporated: getBooleanValue(answers.incorporated),
        p_received_funding: getBooleanValue(answers.funding_received),
        p_funding_details: '', // No longer used in the form, passing empty string
        p_has_deck: getBooleanValue(answers.deck),
        p_team_status: answers.team || '',
        p_commercializing_invention: getBooleanValue(answers.invention), // This is the actual "is your company reliant on university invention" field
        p_university_ip: getBooleanValue(answers.invention), // Fixed mapping: invention field answers university IP question
        p_tto_engaged: false, // No longer used in form
        p_problem_defined: false, // No longer used in form
        p_customer_engagement: answers.customers || '',
        p_market_known: getBooleanValue(answers.market_known),
        p_market_gap_reason: '', // No longer used in form
        p_funding_amount: '', // No longer used in form
        p_has_financial_plan: false, // No longer used in form
        p_funding_sources: [], // No longer used in form
        p_experiment_validated: getBooleanValue(answers.experiment),
        p_industry_changing_vision: false, // No longer used in form
        
        // Field mapping for fields in SprintSignupWindows.ts
        p_is_scientist_engineer: getBooleanValue(answers.is_scientist_engineer),
        p_job_type: answers.job_type || '',
        p_ip_concerns: getBooleanValue(answers.ip_concerns), // Correctly mapped field for IP concerns
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
      toast.success("Your sprint profile has been created successfully!");
      
      // Send confirmation email if the dashboard is not active
      if (!isDashboardActive && answers.name && answers.email) {
        console.log("Sending sprint waiting confirmation email");
        sendSprintWaitingEmail(answers.email, answers.name, answers.linkedin || '')
          .then(success => {
            if (!success) {
              console.error("Failed to send sprint waiting confirmation email");
            }
          })
          .catch(error => {
            console.error("Error sending confirmation email:", error);
          });
      }
      
      // Redirect based on the feature flag
      if (isDashboardActive) {
        navigate(PATHS.SPRINT_DASHBOARD);
      } else {
        navigate(PATHS.SPRINT_WAITING);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update sprint profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isLoadingSettings,
    silentSignup
  };
};
