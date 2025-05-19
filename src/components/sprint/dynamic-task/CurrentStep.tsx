
import React from 'react';
import { StepNode } from '@/types/task-builder';
import { 
  ContentStepRenderer, 
  QuestionStepRenderer,
  FileUploadRenderer,
  ExerciseRenderer
} from './StepRenderers';
import { SprintProfileShowOrAsk } from '@/components/sprint/SprintProfileShowOrAsk';

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
            handleAnswer={handleAnswer} 
          />
        )}
        
        {step.type === 'question' && (
          <QuestionStepRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={handleAnswer} 
          />
        )}
        
        {(step.type === 'upload' || step.type === 'file') && (
          <FileUploadRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={handleAnswer} 
          />
        )}
        
        {(step.type === 'exercise' || step.type === 'feedback' || step.type === 'action') && (
          <ExerciseRenderer 
            step={step} 
            answer={answer} 
            handleAnswer={handleAnswer} 
          />
        )}
      </div>
    </div>
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
