import { useState, useEffect } from "react";
import { SprintSignupAnswers } from "@/types/sprint-signup";
import { useSprintAnswers } from "./useSprintAnswers";
import { useSprintFileUpload } from "./useSprintFileUpload";
import { useSprintSubmission } from "./useSprintSubmission";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { windows } from "@/components/sprint/SprintSignupWindows";

export const useSprintSignup = () => {
  const [currentWindow, setCurrentWindow] = useState(0);
  const [hasSprintProfile, setHasSprintProfile] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const {
    answers,
    setAnswers,
    handleChange,
    toggleMultiSelect
  } = useSprintAnswers();
  
  const {
    uploadedFile,
    handleFileUpload
  } = useSprintFileUpload();
  
  const {
    isSubmitting,
    silentSignup
  } = useSprintSubmission();

  useEffect(() => {
    const fetchSprintProfile = async () => {
      if (isAuthenticated && user) {
        const { data: profile, error } = await supabase
          .from('sprint_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && profile) {
          setHasSprintProfile(true);
          setAnswers({
            // Basic Info
            name: profile.name || '',
            email: profile.email || '',
            linkedin: profile.linkedin_url || '',
            job: profile.current_job || '',
            
            // Window 2
            is_scientist_engineer: profile.is_scientist_engineer ? 'yes' : 'no',
            job_type: profile.job_type || '',
            team: profile.team_status || '',
            
            // Window 3
            incorporated: profile.company_incorporated ? 'yes' : 'no',
            
            // Window 4
            invention: profile.commercializing_invention ? 'yes' : 'no',
            ip: profile.university_ip 
              ? (profile.tto_engaged ? 'tto_yes' : 'tto_no') 
              : 'own',
            ip_concerns: profile.ip_concerns ? 'yes' : 'no',
            
            // Window 5
            potential_beneficiaries: profile.potential_beneficiaries ? 'yes' : 'no',
            
            // Window 6
            customers: profile.customer_engagement || '',
            specific_customers: profile.specific_customers ? 'yes' : 'no',
            customer_evidence: profile.customer_evidence ? 'yes' : 'no',
            
            // Window 7
            market_known: profile.market_known ? 'yes' : 'no',
            competition_research: profile.competition_research ? 'yes' : 'no',
            market_gap_reason: profile.market_gap_reason || '',
            
            // Window 8
            experiment: profile.experiment_validated ? 'yes' : 'no',
            
            // Window 9
            success_vision_1yr: profile.success_vision_1yr ? 'yes' : 'no',
            success_vision_10yr: profile.success_vision_10yr ? 'yes' : 'no',
            impact_scale: profile.impact_scale || [],
            vision: profile.industry_changing_vision ? 'yes' : 'no',
            
            // Window 10
            prior_accelerators: profile.prior_accelerators ? 'yes' : 'no',
            prior_accelerators_details: profile.prior_accelerators_details || '',
            planned_accelerators: profile.planned_accelerators ? 'yes' : 'no',
            planned_accelerators_details: profile.planned_accelerators_details || '',
            
            // Window 11
            funding_received: profile.received_funding ? 'yes' : 'no',
            funding_details: profile.funding_details || '',
            funding_amount_text: profile.funding_amount || '',
            funding_plan: profile.has_financial_plan ? 'yes' : 'no',
            funding_sources: profile.funding_sources || [],
            
            // Window 12
            deck: profile.has_deck ? 'yes' : 'no',
            deck_feedback: profile.deck_feedback ? 'yes' : 'no',
            
            // Window 13
            lab_space_needed: profile.lab_space_needed ? 'yes' : 'no',
            lab_space_secured: profile.lab_space_secured ? 'yes' : 'no',
            lab_space_details: profile.lab_space_details || '',
            
            // Other
            founder_profile: profile.cv_url || null,
          });
        }
      }
    };

    fetchSprintProfile();
  }, [isAuthenticated, user, setAnswers]);

  const goToNextWindow = () => {
    setCurrentWindow(prevWindow => prevWindow + 1);
  };

  const goToPreviousWindow = () => {
    setCurrentWindow(prevWindow => prevWindow - 1);
  };

  return {
    currentWindow,
    answers,
    isSubmitting,
    uploadedFile,
    hasSprintProfile,
    handleChange,
    toggleMultiSelect,
    handleFileUpload,
    goToNextWindow,
    goToPreviousWindow,
    silentSignup
  };
};
