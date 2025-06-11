
import { supabase } from "@/integrations/supabase/client";
import { SprintSignupAnswers } from "@/types/sprint-signup";
import { useSprintFileUpload } from "./useSprintFileUpload";

export const useSprintProfile = () => {
  const { uploadFounderProfile } = useSprintFileUpload();

  const updateUserSprintData = async (userId: string | null, answers: SprintSignupAnswers, uploadedFile: File | null) => {
    try {
      if (!userId) {
        console.error('No user ID available for sprint data update');
        return;
      }

      // Upload CV if provided
      let cvUrl = null;
      if (uploadedFile) {
        cvUrl = await uploadFounderProfile(userId);
      }

      // Call the create_sprint_profile RPC
      const { error: profileError } = await supabase.rpc('create_sprint_profile', {
        p_user_id: userId,
        p_name: answers.name || '',
        p_email: answers.email || '',
        p_linkedin_url: answers.linkedin || '',
        p_cv_url: cvUrl,
        p_current_job: answers.job || '',
        p_company_incorporated: answers.incorporated === 'yes',
        p_received_funding: answers.funding_received === 'yes',
        p_funding_details: answers.funding_details || '',
        p_has_deck: answers.deck === 'yes',
        p_team_status: answers.team || '',
        p_commercializing_invention: answers.invention === 'yes',
        p_university_ip: answers.ip === 'tto_yes' || answers.ip === 'tto_no',
        p_tto_engaged: answers.ip === 'tto_yes',
        p_problem_defined: answers.problem === 'yes',
        p_customer_engagement: answers.customers || '',
        p_market_known: answers.market_known === 'yes',
        p_market_gap_reason: answers.market_gap_reason || '',
        p_funding_amount: answers.funding_amount_text || '',
        p_has_financial_plan: answers.funding_plan === 'yes',
        p_funding_sources: Array.isArray(answers.funding_sources) ? answers.funding_sources : [],
        p_experiment_validated: answers.experiment || '',
        p_industry_changing_vision: answers.vision === 'yes',
        p_is_scientist_engineer: answers.is_scientist_engineer === 'yes',
        p_job_type: answers.job_type || '',
        p_ip_concerns: answers.ip_concerns === 'yes',
        p_potential_beneficiaries: answers.potential_beneficiaries === 'yes',
        p_specific_customers: answers.specific_customers === 'yes',
        p_customer_evidence: answers.customer_evidence === 'yes',
        p_competition_research: answers.competition_research === 'yes',
        p_success_vision_1yr: answers.success_vision_1yr === 'yes',
        p_success_vision_10yr: answers.success_vision_10yr === 'yes',
        p_impact_scale: Array.isArray(answers.impact_scale) ? answers.impact_scale : [],
        p_prior_accelerators: answers.prior_accelerators === 'yes',
        p_prior_accelerators_details: answers.prior_accelerators_details || '',
        p_planned_accelerators: answers.planned_accelerators === 'yes',
        p_planned_accelerators_details: answers.planned_accelerators_details || '',
        p_lab_space_needed: answers.lab_space_needed === 'yes',
        p_lab_space_secured: answers.lab_space_secured === 'yes',
        p_lab_space_details: answers.lab_space_details || '',
        p_deck_feedback: answers.deck_feedback === 'yes',
        p_utm_source: answers.utm_source || null,
        p_utm_medium: answers.utm_medium || null,
        p_utm_campaign: answers.utm_campaign || null,
        p_utm_term: answers.utm_term || null,
        p_utm_content: answers.utm_content || null,
        p_minimal_success_version: answers.minimal_success_version || '',
        p_dashboard_access_enabled: false,
        p_ambitious_version: answers.ambitious_version || ''
      });

      if (profileError) {
        console.error('Error creating/updating profile:', profileError);
        throw profileError;
      }
    } catch (error) {
      console.error('Error updating user sprint data:', error);
      throw error;
    }
  };

  return { updateUserSprintData };
};
