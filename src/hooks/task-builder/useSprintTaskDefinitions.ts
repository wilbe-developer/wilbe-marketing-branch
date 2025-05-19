
import { useQueryClient } from "@tanstack/react-query";
import { TASK_DEFINITIONS_QUERY_KEY, useTaskDefinitionsQuery, fetchTaskDefinition } from "./hooks/useTaskDefinitionsQuery";
import { useTaskDefinitionMutations, createEmptyTaskDefinition } from "./hooks/useTaskDefinitionMutations";

/**
 * Main hook for working with sprint task definitions
 * This hook composes more specialized hooks for a cleaner, more modular architecture
 */
export const useSprintTaskDefinitions = () => {
  const queryClient = useQueryClient();

  // Use the query hook to fetch all task definitions
  const { data: taskDefinitions, isLoading, error } = useTaskDefinitionsQuery();

  // Use the mutations hook to get CRUD operations
  const { 
    createTaskDefinition, 
    updateTaskDefinition, 
    deleteTaskDefinition 
  } = useTaskDefinitionMutations();

  // Wrapper function to fetch a single task definition by ID
  const fetchSingleTaskDefinition = async (id: string) => {
    return fetchTaskDefinition(queryClient, id);
  };

  return {
    taskDefinitions,
    isLoading,
    error,
    fetchTaskDefinition: fetchSingleTaskDefinition,
    createTaskDefinition,
    updateTaskDefinition,
    deleteTaskDefinition,
    createEmptyTaskDefinition
  };
};
