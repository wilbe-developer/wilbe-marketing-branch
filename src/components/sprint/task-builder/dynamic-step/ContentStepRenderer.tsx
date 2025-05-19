
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { getProfileFieldMapping } from "@/utils/profileFieldMappings";

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
    const fieldMapping = getProfileFieldMapping(dependency.profileKey);
    
    return (
      <SprintProfileShowOrAsk
        profileKey={dependency.profileKey}
        label={fieldMapping.label}
        type={fieldMapping.type}
        options={fieldMapping.options}
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
