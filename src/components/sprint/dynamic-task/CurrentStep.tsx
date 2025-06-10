
import React from 'react';
import { StepNode } from '@/types/task-builder';
import {
  ContentStepRenderer, 
  QuestionStepRenderer,
  FileUploadRenderer,
  ExerciseRenderer,
  CollaborationRenderer,
} from './StepRenderers';
import { TeamMemberStepRenderer } from '@/components/sprint/task-builder/dynamic-step/TeamMemberStepRenderer';
import { SprintProfileShowOrAsk } from '@/components/sprint/SprintProfileShowOrAsk';
import { getProfileFieldMapping } from '@/utils/profileFieldMappings';
import { FormStepRenderer } from './FormStepRenderer';
import { ConditionalQuestionRenderer } from './ConditionalQuestionRenderer';
import { normalizeStepType } from '@/utils/taskStepUtils';
import { StepType } from '@/components/sprint/StepBasedTaskLogic';

interface CurrentStepProps {
  step: StepNode;
  answer: any;
  handleAnswer: (stepId: string, value: any) => void;
}

const CurrentStep: React.FC<CurrentStepProps> = ({ 
  step, 
  answer, 
  handleAnswer 
}) => {
  console.log("CurrentStep rendering step with type:", step.type);
  
  // Normalize step type for consistent handling
  // Cast the normalized type to StepType to satisfy TypeScript
  const normalizedType = normalizeStepType(step.type) as StepType;
  console.log("Normalized step type in CurrentStep:", normalizedType);
  
  // Check if this step has profile dependencies
  const profileDependencies = getStepProfileDependencies(step);
  
  const renderStepContent = () => (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">{step.text}</h3>
      
      {/* Step content based on normalized type */}
      <div className="mb-6">
        {normalizedType === 'content' && (
          <ContentStepRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {normalizedType === 'question' && (
          <QuestionStepRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {normalizedType === 'upload' && (
          <FileUploadRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {normalizedType === 'exercise' && (
          <ExerciseRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {normalizedType === 'collaboration' && (
          <CollaborationRenderer
            step={step}
            answer={answer}
            handleAnswer={(value) => handleAnswer(step.id, value)}
          />
        )}
        
        {normalizedType === 'team-members' && (
          <TeamMemberStepRenderer
            step={step}
            answer={answer}
            onAnswer={(value) => handleAnswer(step.id, value)}
          />
        )}
        
        {step.type === 'form' && (
          <FormStepRenderer
            step={step}
            answer={answer}
            handleAnswer={(value) => handleAnswer(step.id, value)}
          />
        )}

        {step.type === 'conditionalQuestion' && (
          <ConditionalQuestionRenderer
            step={step}
            answer={answer}
            handleAnswer={(value) => handleAnswer(step.id, value)}
          />
        )}
      </div>
    </div>
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
        {renderStepContent()}
      </SprintProfileShowOrAsk>
    );
  }
  
  return renderStepContent();
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

export default CurrentStep;
