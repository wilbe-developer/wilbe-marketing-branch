
import React, { useEffect } from "react";
import { QuizApp } from "@/modules/quiz";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Extract UTM parameters from URL
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmTerm = searchParams.get("utm_term");
    const utmContent = searchParams.get("utm_content");
    
    // Only track if we have at least one UTM parameter or tracking all visits
    if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
      // Get or create a session ID from localStorage
      let sessionId = localStorage.getItem('quiz_session_id');
      if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('quiz_session_id', sessionId);
      }
      
      // Record the visit with UTM data
      const recordVisit = async () => {
        try {
          const { error } = await supabase.from('quiz_visits').insert({
            session_id: sessionId,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_term: utmTerm,
            utm_content: utmContent
          });
          
          if (error) {
            console.error('Error recording quiz visit:', error);
          }
        } catch (err) {
          console.error('Failed to record quiz visit:', err);
        }
      };
      
      recordVisit();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <QuizApp 
        title="Infinite Scientist Founder Quiz"
        ctaText="Serious about building?"
        ctaUrl="/waitlist?utm_source=quiz&utm_medium=web"
      />
    </div>
  );
};

export default QuizPage;
