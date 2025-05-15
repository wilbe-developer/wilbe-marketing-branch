
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

  // Convert EnhancedStep to Step with proper type conversion
  const stepBasedTasks: Step[] = steps.map(step => {
    // Convert form types to question types for StepBasedTaskLogic
    if (step.type === 'form') {
      // Extract question from content if it exists
      let question = '';
      let options: Array<{ label: string; value: string }> = [];
      
      // Try to extract question from h3 elements in the content
      if (React.isValidElement(step.content)) {
        const content = step.content as React.ReactElement;
        
        // Look for h3 elements in the content
        React.Children.forEach(content.props.children, (child) => {
          if (React.isValidElement(child) && child.type === 'h3') {
            question = child.props.children;
          }
          
          // Look for radio inputs to extract options
          if (React.isValidElement(child) && child.props.className?.includes('flex space-x-4')) {
            React.Children.forEach(child.props.children, (radioLabel) => {
              if (React.isValidElement(radioLabel) && radioLabel.props.children) {
                const radioInput = radioLabel.props.children[0];
                const radioText = radioLabel.props.children[1];
                
                if (radioInput && radioText) {
                  options.push({
                    label: radioText.props?.children || '',
                    value: radioInput.props?.value || ''
                  });
                }
              }
            });
          }
        });
      }
      
      return {
        type: 'question',
        content: step.content,
        context: step.context,
        question: question || step.title || '',
        options: options,
        uploads: [],
        action: ''
      };
    }
    
    // For content types, just do a simple mapping
    return {
      type: step.type,
      content: step.content,
      context: step.context,
      question: '',
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
