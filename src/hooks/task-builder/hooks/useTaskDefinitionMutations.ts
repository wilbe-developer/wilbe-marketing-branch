
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SprintTaskDefinition, TaskDefinition } from '@/types/task-builder';
import { TASK_DEFINITIONS_QUERY_KEY } from './useTaskDefinitionsQuery';

export function useTaskDefinitionMutations() {
  const queryClient = useQueryClient();

  // Create mutation
  const createTaskDefinitionMutation = useMutation({
    mutationFn: async (taskDefinition: SprintTaskDefinition) => {
      // Convert TaskDefinition to JSON
      const definitionJson = JSON.stringify(taskDefinition.definition);
      
      const { data, error } = await supabase
        .from('sprint_task_definitions')
        .insert({
          name: taskDefinition.name,
          description: taskDefinition.description,
          definition: definitionJson
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
    }
  });

  // Update mutation
  const updateTaskDefinitionMutation = useMutation({
    mutationFn: async (taskDefinition: SprintTaskDefinition) => {
      // Convert TaskDefinition to JSON
      const definitionJson = JSON.stringify(taskDefinition.definition);
      
      const { data, error } = await supabase
        .from('sprint_task_definitions')
        .update({
          name: taskDefinition.name,
          description: taskDefinition.description,
          definition: definitionJson
        })
        .eq('id', taskDefinition.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
    }
  });

  // Delete mutation
  const deleteTaskDefinitionMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('sprint_task_definitions')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
    }
  });

  return {
    createTaskDefinition: createTaskDefinitionMutation,
    updateTaskDefinition: updateTaskDefinitionMutation,
    deleteTaskDefinition: deleteTaskDefinitionMutation
  };
}
