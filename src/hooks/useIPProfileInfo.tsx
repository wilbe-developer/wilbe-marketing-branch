
import React from 'react';
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { IPStepContext } from './team-step-builder/ip-types';

export const useIPProfileInfo = (
  currentStepContext?: IPStepContext,
  universityIP?: boolean
) => {
  const renderContextBasedProfileInfo = () => {
    if (!currentStepContext) return null;
    
    // Show profile info based on the current step context
    if (currentStepContext === 'ip_status') {
      return (
        <SprintProfileShowOrAsk
          profileKey="university_ip"
          label="Is your company reliant on something you've invented/created at a university?"
          type="boolean"
        >
          <></>
        </SprintProfileShowOrAsk>
      );
    }
    
    return null;
  };
  
  return { renderContextBasedProfileInfo };
};
