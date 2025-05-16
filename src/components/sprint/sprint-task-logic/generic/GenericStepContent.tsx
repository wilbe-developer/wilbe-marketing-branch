
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic, { Step } from "../../StepBasedTaskLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { StepContext } from "@/hooks/team-step-builder/types";
import { TaskStep } from "@/types/task-definition";

interface GenericStepContentProps {
  steps: Step[] | TaskStep[];
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  onStepChange: (stepIndex: number, context?: StepContext) => void;
  onAnswerUpdate?: (stepIndex: number, answer: any) => void;
  isLoading?: boolean;
  conditionalFlow?: Record<number, Record<string, number>>;
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
    const stepType = 
      step.type === 'form' ? 'question' : step.type;
    
    // Convert context to StepContextType
    const context = step.context || undefined;
    
    return {
      ...step,
      type: stepType as any,
      context: context as any
    };
  });

  return (
    <Card className={`mb-6 ${isMobile ? 'shadow-sm' : 'mb-8'}`}>
      <CardContent className={isMobile ? "p-3 sm:p-4 md:p-6" : "p-6"}>
        <StepBasedTaskLogic
          steps={compatibleSteps as Step[]}
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
