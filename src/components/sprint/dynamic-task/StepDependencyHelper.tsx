
import React from "react";
import { StepNode } from "@/types/task-builder";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { 
  QuestionStepRenderer,
  TeamMemberStepRenderer,
  UploadStepRenderer 
} from "@/components/sprint/task-builder/dynamic-step";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface StepDependencyHelperProps {
  step: StepNode;
  sprintProfile: any;
  answer: any;
  handleAnswer: (value: any) => void;
  handleFileUpload: (file: File) => void;
  taskDefinition: any;
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
  };
  onAutoSaveField?: (fieldId: string, value: any) => Promise<void>;
}

export const StepDependencyHelper: React.FC<StepDependencyHelperProps> = ({
  step,
  sprintProfile,
  answer,
  handleAnswer,
  handleFileUpload,
  taskDefinition,
  autoSaveManager,
  onAutoSaveField,
}) => {
  // Check if this step has profile dependencies
  const profileDependencies = getStepProfileDependencies(step);
  
  const stepContent = () => {
    switch (step.type) {
      case "question":
      case "form":
      case "conditionalQuestion":
      case "groupedQuestions":
        return (
          <QuestionStepRenderer
            step={step}
            answer={answer}
            onAnswer={handleAnswer}
            autoSaveManager={autoSaveManager}
            onAutoSaveField={onAutoSaveField}
          />
        );
      
      case "team-members":
        return (
          <TeamMemberStepRenderer
            step={step}
            answer={answer}
            onAnswer={handleAnswer}
            autoSaveManager={autoSaveManager}
            onAutoSaveField={onAutoSaveField}
          />
        );
      
      case "file":
      case "upload":
        return (
          <UploadStepRenderer
            step={step}
            answer={answer}
            onAnswer={handleAnswer}
            onFileUpload={handleFileUpload}
          />
        );
      
      default:
        return <div>Unsupported step type: {step.type}</div>;
    }
  };
  
  // If this step has profile dependencies, wrap it with SprintProfileShowOrAsk
  if (profileDependencies.length > 0) {
    const dependency = profileDependencies[0]; // Use the first dependency for now
    return (
      <SprintProfileShowOrAsk
        profileKey={dependency.profileKey}
        label={dependency.profileKey} // This should be improved to use a proper label
        type="boolean" // This should be determined dynamically based on the profile field
      >
        {stepContent()}
      </SprintProfileShowOrAsk>
    );
  }
  
  return stepContent();
};

export const getStepProfileDependencies = (step: StepNode) => {
  if (!step.conditions) return [];
  
  return step.conditions
    .filter((condition: any) => condition.source.profileKey)
    .map((condition: any) => ({
      profileKey: condition.source.profileKey,
      operator: condition.operator,
      value: condition.value
    }));
};
