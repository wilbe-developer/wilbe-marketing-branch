
import React, { useState } from 'react';
import { SprintTaskDefinition, StepNode } from '@/types/task-builder';
import { useSprintProfileQuickEdit } from '@/hooks/useSprintProfileQuickEdit';
import { flattenSteps, evaluateStepVisibility } from '@/utils/taskDefinitionAdapter';
import { toast } from 'sonner';
import TaskProgress from './dynamic-task/TaskProgress';
import StepNavigator from './dynamic-task/StepNavigator';
import CurrentStep from './dynamic-task/CurrentStep';
import TaskCompleted from './dynamic-task/TaskCompleted';

interface DynamicTaskLogicProps {
  taskDefinition: SprintTaskDefinition;
  isCompleted: boolean;
  onComplete: (fileId?: string) => Promise<void>;
  initialAnswers?: Record<string, any>;
}

export const DynamicTaskLogic: React.FC<DynamicTaskLogicProps> = ({
  taskDefinition,
  isCompleted,
  onComplete,
  initialAnswers = {}
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  
  // Get all steps and filter visible ones based on conditions
  const allSteps = taskDefinition.definition.steps || [];
  const flattenedSteps = flattenSteps(allSteps);
  
  // Filter steps based on visibility conditions
  const visibleSteps = flattenedSteps.filter(step => 
    evaluateStepVisibility(step, sprintProfile || {}, answers)
  );
  
  const currentStep = visibleSteps[currentStepIndex];
  
  // If completed, show a summary
  if (isCompleted) {
    return <TaskCompleted steps={visibleSteps} answers={answers} />;
  }
  
  // Handle answering a step
  const handleAnswer = (stepId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: value
    }));
  };
  
  // Go to next step or complete if last step
  const handleNext = () => {
    if (currentStepIndex < visibleSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };
  
  // Go to previous step
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  // Complete the task
  const handleComplete = async () => {
    try {
      await onComplete();
      toast("Task completed successfully!");
    } catch (error) {
      console.error("Error completing task:", error);
      toast("Failed to complete task. Please try again.");
    }
  };
  
  if (!currentStep) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No steps found for this task.</p>
      </div>
    );
  }
  
  // Check if the next button should be disabled
  const isNextDisabled = (
    (currentStep.type === 'question' && !answers[currentStep.id]) ||
    ((currentStep.type === 'upload' || currentStep.type === 'file') && !answers[currentStep.id])
  );

  const isLastStep = currentStepIndex === visibleSteps.length - 1;
  
  // Render the current step
  return (
    <div className="space-y-6">
      <TaskProgress 
        currentStep={currentStepIndex} 
        totalSteps={visibleSteps.length} 
      />
      
      <CurrentStep
        step={currentStep}
        answer={answers[currentStep.id]}
        handleAnswer={handleAnswer}
      />
      
      <StepNavigator
        currentStep={currentStepIndex}
        totalSteps={visibleSteps.length}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        isNextDisabled={isNextDisabled}
        isLastStep={isLastStep}
      />
    </div>
  );
};

export default DynamicTaskLogic;
