
import { useState, useEffect, useCallback } from "react";
import { useTaskDataFetching } from "./useTaskDataFetching";
import { useStepVisibility } from "./useStepVisibility";
import { useTaskMutations } from "./useTaskMutations";
import { UseDynamicTaskProps, UseDynamicTaskReturn } from "./types";
import { StepNode } from "@/types/task-builder";

export const useDynamicTask = ({ taskId, sprintProfile }: UseDynamicTaskProps): UseDynamicTaskReturn => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [visibleSteps, setVisibleSteps] = useState<StepNode[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Fetch task data
  const { taskDefinition, sprintProgress, isLoading } = useTaskDataFetching(taskId);

  // Step visibility utilities
  const { buildVisibleStepsList } = useStepVisibility(sprintProfile, answers);

  // Task mutations
  const { answerNode, uploadFile, updateProfile, completeTask } = useTaskMutations(
    taskId, 
    answers, 
    setAnswers
  );

  // Navigate to a specific step
  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < visibleSteps.length) {
      setCurrentStepIndex(index);
    }
  }, [visibleSteps.length]);

  // Update visible steps when task definition, answers, or profile changes
  useEffect(() => {
    if (taskDefinition) {
      const steps = buildVisibleStepsList(taskDefinition.steps);
      setVisibleSteps(steps);
    }
  }, [taskDefinition, answers, sprintProfile, buildVisibleStepsList]);

  // Load saved answers from user progress - only from user_sprint_progress
  useEffect(() => {
    if (sprintProgress) {
      // First check task_answers (which is the newer field)
      if (sprintProgress.task_answers && Object.keys(sprintProgress.task_answers).length > 0) {
        console.log("Loaded answers from sprint_progress.task_answers:", sprintProgress.task_answers);
        setAnswers(sprintProgress.task_answers as Record<string, any>);
      } 
      // Fall back to legacy 'answers' field if needed
      else if (sprintProgress.answers && Object.keys(sprintProgress.answers).length > 0) {
        console.log("Loaded answers from sprint_progress.answers:", sprintProgress.answers);
        setAnswers(sprintProgress.answers as Record<string, any>);
      }
    }
  }, [sprintProgress]);

  return {
    taskDefinition: taskDefinition || null,
    isLoading,
    visibleSteps,
    currentStep: visibleSteps[currentStepIndex],
    currentStepIndex,
    answers,
    userProgress: sprintProgress,
    answerNode: async (stepId: string, value: any) => {
      await answerNode.mutateAsync({ stepId, value });
    },
    uploadFile: async (stepId: string, file: File) => {
      await uploadFile.mutateAsync({ stepId, file });
    },
    updateProfile: async (key: string, value: any) => {
      await updateProfile.mutateAsync({ key, value });
    },
    completeTask: async () => {
      await completeTask.mutateAsync();
    },
    goToStep,
    isCompleted: sprintProgress?.completed || false
  };
};

export * from './types';
