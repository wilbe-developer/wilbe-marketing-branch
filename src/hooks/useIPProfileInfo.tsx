
import React from 'react';
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { IPStepContext } from './team-step-builder/ip-types';

export const useIPProfileInfo = (
  currentStepContext?: IPStepContext,
  universityIP?: boolean,
  ttoEngaged?: boolean
) => {
  const renderContextBasedProfileInfo = () => {
    if (!currentStepContext) return null;
    
    // Show different profile info based on the current step context
    switch (currentStepContext) {
      case 'ip_status':
        return (
          <SprintProfileShowOrAsk
            profileKey="university_ip"
            label="Is your company reliant on something you've invented/created at a university?"
            type="boolean"
          >
            {universityIP === true && (
              <SprintProfileShowOrAsk
                profileKey="tto_engaged"
                label="Have you begun conversations with the Tech Transfer Office (TTO)?"
                type="boolean"
              >
                <></>
              </SprintProfileShowOrAsk>
            )}
          </SprintProfileShowOrAsk>
        );
        
      case 'tto_status':
        return (
          <SprintProfileShowOrAsk
            profileKey="tto_engaged"
            label="Have you begun conversations with the Tech Transfer Office (TTO)?"
            type="boolean"
          >
            <></>
          </SprintProfileShowOrAsk>
        );
        
      default:
        return null;
    }
  };
  
  return { renderContextBasedProfileInfo };
};
