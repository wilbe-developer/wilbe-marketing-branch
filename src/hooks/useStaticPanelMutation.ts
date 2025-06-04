
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskDefinition } from "@/types/task-builder";

interface UpdateStaticPanelParams {
  taskId: string;
  panelIndex: number;
  updates: {
    title?: string;
    content?: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    items?: Array<{
      text: string;
      order?: number;
      isExpandable?: boolean;
      expandedContent?: string;
    }>;
  };
}

export const useStaticPanelMutation = () => {
  const queryClient = useQueryClient();

  const updateStaticPanel = useMutation({
    mutationFn: async ({ taskId, panelIndex, updates }: UpdateStaticPanelParams) => {
      console.log("Updating panel:", { taskId, panelIndex, updates });
      
      // First, get the current task definition
      const { data: taskDef, error: fetchError } = await supabase
        .from('sprint_task_definitions')
        .select('definition')
        .eq('id', taskId)
        .single();

      if (fetchError || !taskDef) {
        console.error("Failed to fetch task definition:", fetchError);
        throw new Error('Failed to fetch task definition');
      }

      // Type assertion with unknown as intermediate step
      const definition = taskDef.definition as unknown as TaskDefinition;
      
      // Update the specific panel
      if (!definition.staticPanels || !definition.staticPanels[panelIndex]) {
        throw new Error('Panel not found');
      }

      const updatedPanels = [...definition.staticPanels];
      updatedPanels[panelIndex] = {
        ...updatedPanels[panelIndex],
        ...updates
      };

      // Create updated definition
      const updatedDefinition = {
        ...definition,
        staticPanels: updatedPanels
      };

      console.log("Saving updated definition:", updatedDefinition);

      // Update the database - convert back to Json format
      const { error: updateError } = await supabase
        .from('sprint_task_definitions')
        .update({
          definition: updatedDefinition as any, // Use 'any' to bypass strict Json typing
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) {
        console.error("Failed to update task definition:", updateError);
        throw updateError;
      }

      return { panelIndex, updates };
    },
    onSuccess: (data, variables) => {
      console.log("Panel updated successfully:", data);
      
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['task-definition', variables.taskId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['sprint-task-definitions'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['dynamic-task', variables.taskId] 
      });
      
      // Force refetch the specific task
      queryClient.refetchQueries({ 
        queryKey: ['task-definition', variables.taskId] 
      });
    },
    onError: (error) => {
      console.error('Error updating static panel:', error);
      toast.error("Failed to update panel");
    }
  });

  return {
    updateStaticPanel: updateStaticPanel.mutate,
    isUpdating: updateStaticPanel.isPending
  };
};
