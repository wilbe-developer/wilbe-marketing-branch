
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SprintTaskDefinition, StaticPanel } from '@/types/task-builder';
import { toast } from 'sonner';

export function useStaticPanelMutation() {
  const queryClient = useQueryClient();

  const updateStaticPanels = useMutation({
    mutationFn: async ({ taskId, staticPanels }: { taskId: string; staticPanels: StaticPanel[] }) => {
      // First, fetch the current task definition
      const { data: currentTask, error: fetchError } = await supabase
        .from('sprint_task_definitions')
        .select('*')
        .eq('id', taskId)
        .single();

      if (fetchError) throw fetchError;

      // Parse the current definition
      let currentDefinition;
      if (typeof currentTask.definition === 'string') {
        currentDefinition = JSON.parse(currentTask.definition);
      } else {
        currentDefinition = currentTask.definition;
      }

      // Update only the static panels
      const updatedDefinition = {
        ...currentDefinition,
        staticPanels: staticPanels
      };

      // Save back to database
      const { data, error } = await supabase
        .from('sprint_task_definitions')
        .update({
          definition: JSON.stringify(updatedDefinition)
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the same query key used by dashboard hook
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions", "dashboard"] });
      toast.success("Static panels updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update static panels:", error);
      toast.error("Failed to update static panels");
    }
  });

  return {
    updateStaticPanels
  };
}
