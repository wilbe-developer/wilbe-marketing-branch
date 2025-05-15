
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic, { Step } from "../../StepBasedTaskLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { StepContext } from "@/hooks/useTeamStepBuilder";
import { EnhancedStep } from "@/hooks/team-step-builder/types";

interface IPStepContentProps {
  steps: EnhancedStep[];
  isCompleted: boolean;
  onComplete: () => void;
  onStepChange: (stepIndex: number, context?: StepContext) => void;
}

const IPStepContent: React.FC<IPStepContentProps> = ({
  steps,
  isCompleted,
  onComplete,
  onStepChange
}) => {
  const isMobile = useIsMobile();

  // Safely convert EnhancedStep to Step with proper type handling
  const stepBasedTasks: Step[] = steps.map(step => {
    // For form types, convert to question types for StepBasedTaskLogic
    if (step.type === 'form') {
      return {
        type: 'question',
        content: step.content,
        context: step.context,
        question: step.title || '',
        options: [],  // Will be populated if needed during rendering
        uploads: [],
        action: ''
      };
    }
    
    // For content types, just do a simple mapping
    return {
      type: step.type,
      content: step.content,
      context: step.context,
      question: step.title || '',
      options: [],
      uploads: [],
      action: ''
    };
  });

  return (
    <Card className={`mb-6 ${isMobile ? 'shadow-sm' : 'mb-8'}`}>
      <CardContent className={isMobile ? "p-3 sm:p-4 md:p-6" : "p-6"}>
        <StepBasedTaskLogic
          steps={stepBasedTasks}
          isCompleted={isCompleted}
          onComplete={onComplete}
          conditionalFlow={{}}
          onStepChange={onStepChange}
        />
      </CardContent>
    </Card>
  );
};

export default IPStepContent;
