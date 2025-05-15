
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic, { Step } from "../../StepBasedTaskLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { EnhancedStep } from "@/hooks/team-step-builder/types";
import { IPStepContext } from "@/hooks/team-step-builder/ip-types";

interface IPStepContentProps {
  steps: EnhancedStep[];
  isCompleted: boolean;
  onComplete: () => void;
  onStepChange: (stepIndex: number, context?: { type: IPStepContext }) => void;
}

const IPStepContent: React.FC<IPStepContentProps> = ({
  steps,
  isCompleted,
  onComplete,
  onStepChange
}) => {
  const isMobile = useIsMobile();

  // Convert EnhancedStep to Step with proper type conversion
  const stepBasedTasks: Step[] = steps.map(step => ({
    type: step.type === 'content' ? 'content' : 'question',
    title: step.title || '',
    context: step.context,
    content: step.content,
    // For form steps, ensure we extract the question and options if available
    question: step.title || '',
    // We'll handle options in the rendering component
    options: [],
    uploads: [],
    action: ''
  }));

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
