
import React from 'react';
import { StepNode } from '@/types/task-builder';
import { 
  ContentStepRenderer, 
  QuestionStepRenderer,
  FileUploadRenderer,
  ExerciseRenderer
} from './StepRenderers';
import { SprintProfileShowOrAsk } from '@/components/sprint/SprintProfileShowOrAsk';
import { getProfileFieldMapping } from '@/utils/profileFieldMappings';
import { TeamMemberStepRenderer } from '@/components/sprint/task-builder/dynamic-step/TeamMemberStepRenderer';
import { FormStepRenderer } from './FormStepRenderer';
import { ConditionalQuestionRenderer } from './ConditionalQuestionRenderer';

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
  // Check if this step has profile dependencies
  const profileDependencies = getStepProfileDependencies(step);
  
  const renderStepContent = () => (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">{step.text}</h3>
      
      {/* Step content based on type */}
      <div className="mb-6">
        {step.type === 'content' && (
          <ContentStepRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {step.type === 'question' && (
          <QuestionStepRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {(step.type === 'upload' || step.type === 'file') && (
          <FileUploadRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {(step.type === 'exercise' || step.type === 'feedback' || step.type === 'action') && (
          <ExerciseRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={(value) => handleAnswer(step.id, value)} 
          />
        )}
        
        {step.type === 'team-members' && (
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
