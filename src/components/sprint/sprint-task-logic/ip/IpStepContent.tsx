
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic, { Step } from "../../StepBasedTaskLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { IpStepContext, EnhancedIpStep } from "@/hooks/ip-step-builder/types";
import { StepContext } from "@/hooks/team-step-builder/types";

interface IpStepContentProps {
  steps: EnhancedIpStep[];
  conditionalFlow: Record<number, Record<string, number>>;
  isCompleted: boolean;
  onComplete: () => void;
  onStepChange: (stepIndex: number, context?: IpStepContext) => void;
}

const IpStepContent: React.FC<IpStepContentProps> = ({
  steps,
  conditionalFlow,
  isCompleted,
  onComplete,
  onStepChange
}) => {
  const isMobile = useIsMobile();

  // Convert EnhancedIpStep to Step with proper type conversion
  const stepBasedTasks: Step[] = steps.map(step => ({
    type: step.type === 'content' ? 'content' : 'question',
    content: step.content,
    // Here we're using a type assertion to ensure the context is treated as compatible
    context: step.context as any, // This is safe because we extended the type in our definition
    question: step.question || '',
    options: step.options || [],
    uploads: step.uploads || [],
    action: ''
  }));

  // Handle answer selection to store context for step change
  const handleEnhancedStepChange = (stepIndex: number, context?: StepContext) => {
    // Extract the value from the answer to enrich our context
    const answer = context?.answer;
    
    // Create an enhanced context with the answer data if available
    const enhancedContext = context?.type 
      ? { 
          type: context.type, 
          data: answer 
        } as IpStepContext
      : undefined;
      
    // Pass the enhanced context to the parent
    onStepChange(stepIndex, enhancedContext);
  };

  return (
    <Card className={`mb-6 ${isMobile ? 'shadow-sm' : 'mb-8'}`}>
      <CardContent className={isMobile ? "p-3 sm:p-4 md:p-6" : "p-6"}>
        <StepBasedTaskLogic
          steps={stepBasedTasks}
          conditionalFlow={conditionalFlow}
          isCompleted={isCompleted}
          onComplete={onComplete}
          onStepChange={handleEnhancedStepChange}
        />
      </CardContent>
    </Card>
  );
};

export default IpStepContent;
