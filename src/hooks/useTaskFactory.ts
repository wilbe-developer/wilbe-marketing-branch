
import { useMemo } from 'react';
import { useTeamTaskData } from './useTeamTaskData';
import { useGenericIPTaskData } from './useGenericIPTaskData';

// Generic type for task data hooks
type TaskDataHook = {
  steps: any[];
  isLoading: boolean;
  handleComplete: (fileId?: string) => Promise<boolean>;
  handleStepChange: (stepIndex: number, context?: any) => void;
  currentStepContext?: any;
  uploadedFileId?: string;
  conditionalFlow?: Record<number, Record<string, number>>;
  answers?: Record<string, any>;
  updateAnswers?: (stepIndex: number, answer: any) => void;
  [key: string]: any;
};

export const useTaskFactory = (
  taskTitle: string,
  task: any,
  sprintProfile: any
): TaskDataHook => {
  // Return the appropriate task data hook based on the task title
  return useMemo(() => {
    switch (taskTitle) {
      case "Develop Team Building Plan":
      case "Team Profile":
        return useTeamTaskData(task, sprintProfile);
        
      case "IP & Technology Transfer":
        return useGenericIPTaskData(task, sprintProfile);
        
      default:
        // Return a minimal implementation for unknown tasks
        console.warn(`No specific implementation for task: ${taskTitle}`);
        return {
          steps: [],
          isLoading: false,
          handleComplete: async () => false,
          handleStepChange: () => {},
          currentStepContext: undefined,
          uploadedFileId: undefined,
          conditionalFlow: {},
          answers: {}
        };
    }
  }, [taskTitle, task, sprintProfile]);
};
