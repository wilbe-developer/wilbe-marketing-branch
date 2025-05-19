
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { getProfileFieldMapping } from "@/utils/profileFieldMappings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  
  // Parse the content string to check for special input fields
  const parseContent = () => {
    // If the content has specific input placeholders, render input fields at those positions
    if (step.content && step.content.includes('[[input:')) {
      // This is a simplified approach. A more robust solution would use regex to identify all placeholders
      const parts = step.content.split(/(\[\[input:[^\]]+\]\])/);
      
      return (
        <div className="prose max-w-none">
          {parts.map((part, index) => {
            if (part.startsWith('[[input:')) {
              // Parse input type and id
              const match = part.match(/\[\[input:(\w+):?([^\]]*)\]\]/);
              if (match) {
                const inputType = match[1]; // 'text', 'textarea', etc.
                const inputId = match[2] || `field_${index}`; // Use provided id or generate one
                
                return renderInputField(inputType, inputId, index);
              }
            }
            
            return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
          })}
        </div>
      );
    }
    
    return (
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: step.text }} />
        {step.content && (
          <div dangerouslySetInnerHTML={{ __html: step.content }} />
        )}
        
        {/* If this is an exercise step or has connected input fields, show a textarea */}
        {step.type === 'exercise' && handleAnswer && (
          <div className="mt-4">
            <Textarea
              value={answer || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              rows={6}
              className="w-full mt-2"
            />
          </div>
        )}
      </div>
    );
  };
  
  // Helper to render an input field based on type
  const renderInputField = (type: string, id: string, index: number) => {
    // Handle different input types
    switch (type) {
      case 'text':
        return (
          <div key={`input-${index}`} className="my-2">
            <Input
              id={id}
              value={answer?.[id] || ''}
              onChange={(e) => handleAnswer?.({ ...answer, [id]: e.target.value })}
              placeholder="Your answer..."
              className="w-full"
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={`input-${index}`} className="my-2">
            <Textarea
              id={id}
              value={answer?.[id] || ''}
              onChange={(e) => handleAnswer?.({ ...answer, [id]: e.target.value })}
              placeholder="Your answer..."
              rows={4}
              className="w-full"
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  const content = (
    <Card>
      <CardContent className="pt-6">
        {parseContent()}
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
