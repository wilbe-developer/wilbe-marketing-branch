
import { useState, useEffect, useMemo } from 'react';
import { useTeamTaskData } from './useTeamTaskData';
import { useTaskData } from './useTaskData';
import { useGenericIPTaskData } from './useGenericIPTaskData';
import { getTaskDefinition } from '@/data/task-definitions';
import { supabase } from '@/integrations/supabase/client';
import { TaskDefinition } from '@/types/task-definition';

export const useTaskFactory = (
  taskTitle: string,
  task: any,
  sprintProfile: any
) => {
  const [dbTaskDefinition, setDbTaskDefinition] = useState<TaskDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Try to load task definition from database
  useEffect(() => {
    const fetchTaskDefinition = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('task_definitions')
          .select('*')
          .eq('title', taskTitle)
          .single();
          
        if (error) {
          console.error('Error fetching task definition:', error);
        } else if (data) {
          // Parse the JSON fields and ensure we handle non-string values
          const parsedData = {
            ...data,
            steps: Array.isArray(data.steps) ? data.steps : JSON.parse(typeof data.steps === 'string' ? data.steps : JSON.stringify(data.steps)),
            conditionalFlow: data.conditional_flow ? 
              (typeof data.conditional_flow === 'object' ? data.conditional_flow : JSON.parse(typeof data.conditional_flow === 'string' ? data.conditional_flow : JSON.stringify(data.conditional_flow))) : 
              {},
            answerMapping: data.answer_mapping ? 
              (typeof data.answer_mapping === 'object' ? data.answer_mapping : JSON.parse(typeof data.answer_mapping === 'string' ? data.answer_mapping : JSON.stringify(data.answer_mapping))) : 
              {}
          };
          setDbTaskDefinition(parsedData);
        }
      } catch (err) {
        console.error('Failed to parse task definition:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (taskTitle) {
      fetchTaskDefinition();
    } else {
      setIsLoading(false);
    }
  }, [taskTitle]);
  
  // Look up the local task definition
  const localTaskDefinition = useMemo(() => getTaskDefinition(taskTitle), [taskTitle]);
  
  // Return the appropriate task data hook based on priority
  return useMemo(() => {
    console.log('useTaskFactory for task:', taskTitle, 'has DB definition:', !!dbTaskDefinition, 'has local definition:', !!localTaskDefinition);
    
    // First priority: Use database task definition if available
    if (dbTaskDefinition) {
      return useTaskData({ 
        task, 
        sprintProfile, 
        taskDefinition: dbTaskDefinition,
        isLoadingDefinition: isLoading
      });
    }
    
    // Second priority: Use local JS task definition if available
    if (localTaskDefinition) {
      return useTaskData({ 
        task, 
        sprintProfile, 
        taskDefinition: localTaskDefinition 
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
  }, [taskTitle, task, sprintProfile, localTaskDefinition, dbTaskDefinition, isLoading]);
};
