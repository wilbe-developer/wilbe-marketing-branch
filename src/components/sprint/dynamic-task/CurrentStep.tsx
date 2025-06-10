
import React from "react";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import DynamicTaskStep from "@/components/sprint/task-builder/DynamicTaskStep";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface CurrentStepProps {
  step: any;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload: (file: File) => void;
  sprintProfile: any;
  getStepProfileDependencies: (step: any) => any[];
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
    forceSave: (fieldId: string) => void;
  };
  onAutoSaveField?: (fieldId: string, value: any) => Promise<void>;
}

export const CurrentStep: React.FC<CurrentStepProps> = ({
  step,
  answer,
  onAnswer,
  onFileUpload,
  sprintProfile,
  getStepProfileDependencies,
  autoSaveManager,
  onAutoSaveField,
}) => {
  // Check if this step has profile dependencies
  const profileDependencies = getStepProfileDependencies(step);
  
  const stepContent = (
    <DynamicTaskStep
      step={step}
      answer={answer}
      onAnswer={onAnswer}
      onFileUpload={onFileUpload}
      autoSaveManager={autoSaveManager}
      onAutoSaveField={onAutoSaveField}
    />
  );
  
  // If this step has profile dependencies, wrap it with SprintProfileShowOrAsk
  if (profileDependencies.length > 0) {
    const dependency = profileDependencies[0]; // Use the first dependency for now
    return (
      <SprintProfileShowOrAsk
        profileKey={dependency.profileKey}
        label={dependency.profileKey} // This should be improved to use a proper label
        type="boolean" // This should be determined dynamically based on the profile field
      >
        {stepContent}
      </SprintProfileShowOrAsk>
    );
  }
  
  return stepContent;
};
