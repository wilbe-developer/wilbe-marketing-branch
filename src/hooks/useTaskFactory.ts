
import { useMemo } from 'react';
import { useTeamTaskData } from './useTeamTaskData';
import { useTaskData } from './useTaskData';
import { useGenericIPTaskData } from './useGenericIPTaskData';
import { getTaskDefinition } from '@/data/task-definitions';

export const useTaskFactory = (
  taskTitle: string,
  task: any,
  sprintProfile: any
) => {
  // Look up the task definition
  const taskDefinition = useMemo(() => getTaskDefinition(taskTitle), [taskTitle]);
  
  // Return the appropriate task data hook based on the task title
  return useMemo(() => {
    console.log('useTaskFactory for task:', taskTitle, 'has definition:', !!taskDefinition);
    
    // If we have a task definition, use the generic task data hook
    if (taskDefinition) {
      return useTaskData({ 
        task, 
        sprintProfile, 
        taskDefinition 
      });
    }
    
    // Otherwise, fall back to specific task hooks for backward compatibility
    switch (taskTitle) {
      case "Develop Team Building Plan":
      case "Team Profile":
        console.log('Using dedicated team task data hook');
        return useTeamTaskData(task, sprintProfile);
        
      case "IP & Technology Transfer":
        console.log('Using dedicated IP task data hook');
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
  }, [taskTitle, task, sprintProfile, taskDefinition]);
};
