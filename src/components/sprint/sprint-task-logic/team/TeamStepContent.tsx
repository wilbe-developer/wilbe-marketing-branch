
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic, { Step } from "../../StepBasedTaskLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { StepContext } from "@/hooks/useTeamStepBuilder";
import { EnhancedStep } from "@/hooks/team-step-builder/types";

interface TeamStepContentProps {
  steps: EnhancedStep[];
  isCompleted: boolean;
  onComplete: () => void;
  onStepChange: (stepIndex: number, context?: StepContext) => void;
}

const TeamStepContent: React.FC<TeamStepContentProps> = ({
  steps,
  isCompleted,
  onComplete,
  onStepChange
}) => {
  const isMobile = useIsMobile();

  // Convert EnhancedStep to Step with proper type conversion.
  const stepBasedTasks: Step[] = steps.map(step => ({
    type: step.type === 'content' ? 'content' : 'question',
    content: step.content,
    context: step.context,
    // Add any other required properties with sensible defaults
    question: '',
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

export default TeamStepContent;
