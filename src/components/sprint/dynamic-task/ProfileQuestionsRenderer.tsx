
import React from "react";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { getProfileFieldMapping } from "@/utils/profileFieldMappings";
import { ProfileQuestion } from "@/types/task-builder";

interface ProfileQuestionsRendererProps {
  taskDefinition: any;
  sprintProfile: any;
  children: React.ReactNode;
}

export const ProfileQuestionsRenderer: React.FC<ProfileQuestionsRendererProps> = ({
  taskDefinition,
  sprintProfile,
  children
}) => {
  // If there are no profile questions, render the children directly
  if (!taskDefinition.profileQuestions || taskDefinition.profileQuestions.length === 0) {
    return <>{children}</>;
  }

  // If there are profile questions, make sure they're answered first
  const requiredProfileKeys = taskDefinition.profileQuestions.map((q: ProfileQuestion) => q.key);
  const profileKeysAnswered = requiredProfileKeys.every(key => 
    sprintProfile && sprintProfile[key] !== undefined
  );

  if (profileKeysAnswered) {
    // All profile questions are answered, render the children
    return <>{children}</>;
  }

  // Render one profile question at a time
  const unansweredKeys = taskDefinition.profileQuestions
    .filter((q: ProfileQuestion) => {
      // Safe check if sprintProfile exists
      if (!sprintProfile) return true;
      return sprintProfile[q.key] === undefined;
    })
    .map((q: ProfileQuestion) => q.key);
  
  if (unansweredKeys.length === 0) return <>{children}</>;
  
  const currentQuestion = taskDefinition.profileQuestions.find(
    (q: ProfileQuestion) => q.key === unansweredKeys[0]
  );
  
  if (!currentQuestion) return <>{children}</>;
  
  const fieldMapping = getProfileFieldMapping(currentQuestion.key);
  
  // Use the question text directly as the label instead of the key
  const questionLabel = currentQuestion.text || fieldMapping.label;
  
  // If we have options defined in the task definition, use those
  const options = currentQuestion.options ? 
    currentQuestion.options.map((option: string) => ({ value: option, label: option })) : 
    fieldMapping.options;
  
  return (
    <div className="space-y-6">
      <SprintProfileShowOrAsk
        profileKey={currentQuestion.key}
        label={questionLabel}
        type={mapProfileType(currentQuestion.type) || fieldMapping.type}
        options={options}
      >
        {/* This will only render when the profile question is answered */}
        {children}
      </SprintProfileShowOrAsk>
    </div>
  );
};

// Helper function to map profile question types to SprintProfileShowOrAsk types
function mapProfileType(type: string): "string" | "boolean" | "select" | "multi-select" {
  switch (type) {
    case "text": return "string";
    case "boolean": return "boolean";
    case "select": return "select";
    case "multiselect": return "multi-select";
    default: return "boolean";
  }
}
