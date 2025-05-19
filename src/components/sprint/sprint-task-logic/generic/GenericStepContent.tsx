
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic, { Step } from "../../StepBasedTaskLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { StepContext } from "@/hooks/team-step-builder/types";
import { TaskStep, ConditionalFlow } from "@/types/task-definition";

interface GenericStepContentProps {
  steps: TaskStep[] | Step[];
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  onStepChange: (stepIndex: number, context?: StepContext) => void;
  onAnswerUpdate?: (stepIndex: number, answer: any) => void;
  isLoading?: boolean;
  conditionalFlow?: ConditionalFlow;
}

const GenericStepContent: React.FC<GenericStepContentProps> = ({
  steps,
  isCompleted,
  onComplete,
  onStepChange,
  onAnswerUpdate,
  isLoading = false,
  conditionalFlow = {}
}) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card className={`mb-6 ${isMobile ? 'shadow-sm' : 'mb-8'}`}>
        <CardContent className={isMobile ? "p-3 sm:p-4 md:p-6" : "p-6"}>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <Card className={`mb-6 ${isMobile ? 'shadow-sm' : 'mb-8'}`}>
        <CardContent className={isMobile ? "p-3 sm:p-4 md:p-6" : "p-6"}>
          <div className="text-center py-8">
            <p>No steps available for this task.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Convert TaskStep to Step for compatibility with StepBasedTaskLogic
  const compatibleSteps = steps.map(step => {
    // Normalize the step type to ensure it matches what StepBasedTaskLogic expects
    let normalizedType = step.type;
    
    // For debugging, log the original step type
    console.log(`Original step type: ${step.type}`);
    
    // Handle specific type conversions
    if (step.type === 'form') {
      normalizedType = 'question';
    } else if (step.type === 'collaboration' || step.type === 'team-members') {
      normalizedType = 'collaboration';
    }
    
    // Log the normalized step type
    console.log(`Normalized step type: ${normalizedType}`);
    
    // Return the step with the normalized type
    return {
      ...step,
      type: normalizedType,
      context: step.context || undefined
    } as Step;
  });

  return (
    <Card className={`mb-6 ${isMobile ? 'shadow-sm' : 'mb-8'}`}>
      <CardContent className={isMobile ? "p-3 sm:p-4 md:p-6" : "p-6"}>
        <StepBasedTaskLogic
          steps={compatibleSteps}
          isCompleted={isCompleted}
          onComplete={onComplete}
          conditionalFlow={conditionalFlow}
          onStepChange={onStepChange}
          onAnswerUpdate={onAnswerUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default GenericStepContent;
