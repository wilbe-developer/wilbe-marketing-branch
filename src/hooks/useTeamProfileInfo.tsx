
import React from "react";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { StepContext, StepContextType } from "@/hooks/team-step-builder/types";

export const useTeamProfileInfo = (
  currentStepContext: StepContext | undefined,
  isIncorporated: boolean | undefined,
  teamStatus: string | undefined
) => {
  // Render the appropriate profile info based on the current step context
  const renderContextBasedProfileInfo = () => {
    if (!currentStepContext) return null;
    
    if (currentStepContext.type === "incorporation" && isIncorporated !== undefined) {
      return (
        <SprintProfileShowOrAsk 
          profileKey="company_incorporated" 
          label="Is your company incorporated?"
          type="boolean"
        >
          {null}
        </SprintProfileShowOrAsk>
      );
    }
    
    if (currentStepContext.type === "team" && teamStatus) {
      return (
        <SprintProfileShowOrAsk 
          profileKey="team_status" 
          label="Team status"
          type="select"
          options={[
            { value: "solo", label: "I'm solo" },
            { value: "employees", label: "I have a team but they're employees" },
            { value: "cofounders", label: "I have co-founders" }
          ]}
        >
          {null}
        </SprintProfileShowOrAsk>
      );
    }
    
    return null;
  };

  return { renderContextBasedProfileInfo };
};
