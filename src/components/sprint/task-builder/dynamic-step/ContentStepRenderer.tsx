
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";

interface ContentStepRendererProps {
  step: StepNode;
  answer?: any;
  handleAnswer?: (value: any) => void;
}

export const ContentStepRenderer: React.FC<ContentStepRendererProps> = ({ 
  step,
  answer,
  handleAnswer 
}) => {
  // Check if this step has profile dependencies
  const profileDependencies = getStepProfileDependencies(step);
  
  const content = (
    <Card>
      <CardContent className="pt-6">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: step.text }} />
          {step.content && (
            <div dangerouslySetInnerHTML={{ __html: step.content }} />
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  // If this step has profile dependencies, wrap it with SprintProfileShowOrAsk
  if (profileDependencies.length > 0) {
    const dependency = profileDependencies[0]; // Use the first dependency for now
    return (
      <SprintProfileShowOrAsk
        profileKey={dependency.profileKey}
        label={dependency.profileKey}
        type="boolean" // Can be improved to determine type dynamically
      >
        {content}
      </SprintProfileShowOrAsk>
    );
  }
  
  return content;
};

// Helper function to get profile dependencies for a step
function getStepProfileDependencies(step: any) {
  if (!step.conditions) return [];
  
  return step.conditions
    .filter((condition: any) => condition.source.profileKey)
    .map((condition: any) => ({
      profileKey: condition.source.profileKey,
      operator: condition.operator,
      value: condition.value
    }));
}
