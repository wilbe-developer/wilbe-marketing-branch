
import React from "react";
import { Button } from "@/components/ui/button";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface StepNavigatorProps {
  currentStepIndex: number;
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
    forceSave: (fieldId: string) => void;
  };
  currentStepId?: string;
}

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStepIndex,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
  onComplete,
  autoSaveManager,
  currentStepId,
}) => {
  const handleNext = () => {
    // Force save current step before navigating
    if (autoSaveManager && currentStepId) {
      autoSaveManager.forceSave(currentStepId);
    }
    onNext();
  };

  const handleComplete = () => {
    // Force save current step before completing
    if (autoSaveManager && currentStepId) {
      autoSaveManager.forceSave(currentStepId);
    }
    onComplete();
  };

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStepIndex === 0}
      >
        Previous
      </Button>
      
      {isLastStep ? (
        <Button onClick={handleComplete}>
          Complete Task
        </Button>
      ) : (
        <Button 
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next
        </Button>
      )}
    </div>
  );
};
