
import React from 'react';
import { StepNode } from '@/types/task-builder';
import { 
  ContentStepRenderer, 
  QuestionStepRenderer,
  FileUploadRenderer,
  ExerciseRenderer
} from './StepRenderers';

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
  return (
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
};

export default CurrentStep;
