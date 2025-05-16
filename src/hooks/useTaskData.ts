import { useState, useEffect, useMemo } from "react";
import { TaskDefinition, TaskStep, ConditionalFlow } from "@/types/task-definition";
import { useTaskBase } from "./useTaskBase";
import { StepContextType } from "./team-step-builder/types";

export interface UseTaskDataProps {
  task: any;
  sprintProfile: any;
  taskDefinition: TaskDefinition;
}

export const useTaskData = ({ task, sprintProfile, taskDefinition }: UseTaskDataProps) => {
  const {
    answers,
    uploadedFileId,
    isLoading: baseIsLoading,
    handleStepChange,
    updateAnswer,
    updateAnswers: baseUpdateAnswers,
    handleComplete,
    currentStepContext,
    setUploadedFileId
  } = useTaskBase({ 
    task, 
    sprintProfile
  });
  
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Build steps based on task definition, existing answers and profile
  useEffect(() => {
    if (!task || !taskDefinition) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Building steps based on definition and profile:', taskDefinition.id, sprintProfile);
      
      // Filter steps based on profile values and other conditions
      const filteredSteps = taskDefinition.steps.filter(step => {
        if (!step.profileDependencies || step.profileDependencies.length === 0) {
          return true;
        }
        
        // Check if all profile dependencies are satisfied
        return step.profileDependencies.every(dependency => {
          if (!dependency.includes('=')) {
            // If no specific value expected, just check if the field exists
            const key = dependency;
            return !!sprintProfile[key];
          }
          
          const [key, expectedValue] = dependency.split('=');
          // Handle boolean values correctly
          if (expectedValue === 'true') {
            return sprintProfile[key] === true;
          } else if (expectedValue === 'false') {
            return sprintProfile[key] === false;
          }
          // Otherwise compare as strings
          return String(sprintProfile[key]) === expectedValue;
        });
      });
      
      console.log('Filtered steps:', filteredSteps.length);
      setSteps(filteredSteps);
    } catch (error) {
      console.error("Error building task steps:", error);
      setSteps([]);
    } finally {
      setIsLoading(false);
    }
  }, [taskDefinition, sprintProfile, task, answers]);

  // Use the task definition's conditional flow or an empty object
  const conditionalFlow = useMemo(() => {
    return taskDefinition.conditionalFlow || {};
  }, [taskDefinition]);

  // Map step index to semantic key based on task definition
  const getKeyForStep = (stepIndex: number): string => {
    // If the task has an answer mapping defined, use it
    if (taskDefinition.answerMapping && taskDefinition.answerMapping[stepIndex]) {
      return taskDefinition.answerMapping[stepIndex];
    }
    
    // Otherwise, just use the step index with a prefix
    return `step_${stepIndex}`;
  };

  // Custom updateAnswers to map step index to semantic key
  const updateAnswers = (stepIndex: number, answer: any) => {
    console.log('Updating answer for step:', stepIndex, answer);
    const key = getKeyForStep(stepIndex);
    updateAnswer(key, answer);
  };

  return {
    steps,
    isLoading: isLoading || baseIsLoading,
    uploadedFileId,
    setUploadedFileId,
    handleComplete,
    handleStepChange,
    currentStepContext,
    conditionalFlow,
    answers,
    updateAnswers,
    taskDefinition
  };
};
