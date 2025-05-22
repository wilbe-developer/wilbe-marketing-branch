
import { useState, useCallback } from 'react';
import { useTaskDefinitionsQuery } from './hooks/useTaskDefinitionsQuery';
import { useTaskDefinitionMutations } from './hooks/useTaskDefinitionMutations';
import { SprintTaskDefinition, TaskDefinition } from '@/types/task-builder';
import { v4 as uuidv4 } from 'uuid';

export function useSprintTaskDefinitions() {
  const { data, isLoading, error, refetch } = useTaskDefinitionsQuery();
  const { 
    createTaskDefinition: createTaskDefinitionMutation,
    updateTaskDefinition: updateTaskDefinitionMutation,
    deleteTaskDefinition: deleteTaskDefinitionMutation
  } = useTaskDefinitionMutations();

  const createEmptyTaskDefinition = useCallback((): SprintTaskDefinition => {
    return {
      id: uuidv4(),
      name: 'New Task',
      description: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      definition: {
        taskName: 'New Task',
        description: '',
        steps: [],
        profileQuestions: [],
        staticPanels: [],
        category: ''
      }
    };
  }, []);

  const fetchTaskDefinition = useCallback(async (taskId: string): Promise<SprintTaskDefinition | null> => {
    try {
      // Find the task definition in the cached data first
      const cachedTask = data?.find(task => task.id === taskId);
      if (cachedTask) {
        return cachedTask;
      }

      // If not found in cache, fetch it directly
      const { data: refreshedData, error: refreshError } = await refetch();
      if (refreshError) throw refreshError;
      
      const foundTask = refreshedData?.find(task => task.id === taskId);
      return foundTask || null;
    } catch (error) {
      console.error("Error fetching task definition:", error);
      return null;
    }
  }, [data, refetch]);

  return {
    taskDefinitions: data,
    isLoading,
    error,
    createTaskDefinition: createTaskDefinitionMutation,
    updateTaskDefinition: updateTaskDefinitionMutation,
    deleteTaskDefinition: deleteTaskDefinitionMutation,
    fetchTaskDefinition,
    createEmptyTaskDefinition,
    refetch
  };
}
