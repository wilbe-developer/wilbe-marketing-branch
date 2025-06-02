import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PATHS } from "@/lib/constants";
import SprintSignupForm from "@/components/sprint/SprintSignupForm";
import { useAppSettings } from "@/hooks/useAppSettings";

interface UtmParams {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

const SprintSignupPage = () => {
  const { isAuthenticated, loading, user, hasDashboardAccess } = useAuth();
  const { isLoading: isLoadingSettings } = useAppSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [utmParams, setUtmParams] = useState<UtmParams>({});
  
  useEffect(() => {
    // Extract UTM parameters from URL
    const urlParams = new URLSearchParams(location.search);
    const extractedUtmParams: UtmParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
    };
    
    // Filter out null values
    const filteredParams = Object.fromEntries(
      Object.entries(extractedUtmParams).filter(([_, value]) => value !== null)
    );
    
    setUtmParams(filteredParams);
    
    // Log for debugging
    console.log("UTM parameters detected:", filteredParams);
  }, [location.search]);

  useEffect(() => {
    // Check if authenticated user already has a sprint profile, if so redirect to appropriate page
    const checkExistingProfile = async () => {
      if (!loading && !isLoadingSettings && isAuthenticated && user) {
        try {
          const { data: hasProfile, error } = await supabase
            .rpc('has_completed_sprint_onboarding', {
              p_user_id: user.id
            });

          if (error) {
            console.error('Error checking sprint profile:', error);
            return;
          }

          if (hasProfile) {
            // User already has a profile, redirect based on access logic
            if (hasDashboardAccess) {
              navigate(PATHS.SPRINT_DASHBOARD);
            } else {
              navigate(PATHS.SPRINT_WAITING);
            }
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };

    checkExistingProfile();
  }, [isAuthenticated, loading, user, navigate, hasDashboardAccess, isLoadingSettings]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SprintSignupForm utmParams={utmParams} />
    </div>
  );
};

export default SprintSignupPage;
