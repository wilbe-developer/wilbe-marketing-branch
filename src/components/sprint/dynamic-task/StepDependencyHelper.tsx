
import React from "react";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { getProfileFieldMapping } from "@/utils/profileFieldMappings";
import DynamicTaskStep from "../task-builder/DynamicTaskStep";
import { StepNode } from "@/types/task-builder";

interface StepDependencyHelperProps {
  step: StepNode;
  sprintProfile: any;
  answer: any;
  handleAnswer: (value: any) => Promise<void>;
  handleFileUpload: (file: File) => Promise<void>;
  taskDefinition: any;
}

export const StepDependencyHelper: React.FC<StepDependencyHelperProps> = ({
  step,
  sprintProfile,
  answer,
  handleAnswer,
  handleFileUpload,
  taskDefinition
}) => {
  // Get profile dependencies for the step
  const profileDependencies = getStepProfileDependencies(step);
  
  const stepContent = (
    <DynamicTaskStep
      step={step}
      answer={answer}
      onAnswer={handleAnswer}
      onFileUpload={handleFileUpload}
    />
  );
  
  // If this step has profile dependencies, wrap it with SprintProfileShowOrAsk
  if (profileDependencies.length > 0) {
    const dependency = profileDependencies[0]; // Use the first dependency for now
    const fieldMapping = getProfileFieldMapping(dependency.profileKey);

    // Find the profile question to get its text
    const profileQuestion = taskDefinition.profileQuestions?.find(
      (q: any) => q.key === dependency.profileKey
    );
    
    // Use the profile question text as the label if available
    const questionLabel = profileQuestion?.text || fieldMapping.label;
    
    return (
      <SprintProfileShowOrAsk
        profileKey={dependency.profileKey}
        label={questionLabel}
        type={fieldMapping.type}
        options={fieldMapping.options}
      >
        {stepContent}
      </SprintProfileShowOrAsk>
    );
  }
  
  return stepContent;
};

// Helper function to get profile dependencies for a step
export function getStepProfileDependencies(step: any) {
  if (!step.conditions) return [];
  
  return step.conditions
    .filter((condition: any) => condition.source && condition.source.profileKey)
    .map((condition: any) => ({
      profileKey: condition.source.profileKey,
      operator: condition.operator,
      value: condition.value
    }));
}
