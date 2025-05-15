
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
  const stepBasedTasks: Step[] = steps.map(step => {
    // Start with a base step object
    const baseStep: Step = {
      type: step.type === 'content' ? 'content' : 'question',
      title: step.title || '',
      context: step.context,
      content: step.content,
      question: step.title || '',
      options: [],
      uploads: [],
      action: ''
    };
    
    // For form steps, if they contain buttons, we need to extract them as options
    if (step.type === 'form' && Array.isArray(step.content)) {
      // Look for buttons in the content
      const contentWithButtons = step.content.find(item => 
        React.isValidElement(item) && 
        item.props.children && 
        item.props.children.props && 
        item.props.children.props.children &&
        Array.isArray(item.props.children.props.children) && 
        item.props.children.props.children.some(child => 
          React.isValidElement(child) && child.type === 'button'
        )
      );
      
      // If buttons are found, extract them as options
      if (contentWithButtons && React.isValidElement(contentWithButtons)) {
        try {
          const buttons = contentWithButtons.props.children.props.children;
          if (Array.isArray(buttons)) {
            const extractedOptions = buttons
              .filter(button => React.isValidElement(button) && button.type === 'button')
              .map((button, i) => {
                if (React.isValidElement(button)) {
                  return {
                    label: button.props.children || (i === 0 ? 'Yes' : 'No'),
                    value: i === 0 ? 'yes' : 'no'
                  };
                }
                return null;
              })
              .filter(Boolean);
            
            if (extractedOptions.length > 0) {
              baseStep.options = extractedOptions;
            }
          }
        } catch (error) {
          console.error("Error extracting options from form step:", error);
        }
      }
    }
    
    return baseStep;
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
