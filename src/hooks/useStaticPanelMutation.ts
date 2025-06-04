
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      // First, get the current task definition
      const { data: taskDef, error: fetchError } = await supabase
        .from('sprint_task_definitions')
        .select('definition')
        .eq('id', taskId)
        .single();

      if (fetchError || !taskDef) {
        throw new Error('Failed to fetch task definition');
      }

      const definition = taskDef.definition;
      
      // Update the specific panel
      if (!definition.staticPanels || !definition.staticPanels[panelIndex]) {
        throw new Error('Panel not found');
      }

      const updatedPanels = [...definition.staticPanels];
      updatedPanels[panelIndex] = {
        ...updatedPanels[panelIndex],
        ...updates
      };

      // Update the database
      const { error: updateError } = await supabase
        .from('sprint_task_definitions')
        .update({
          definition: {
            ...definition,
            staticPanels: updatedPanels
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) {
        throw updateError;
      }

      return { panelIndex, updates };
    },
    onSuccess: () => {
      // Invalidate and refetch task definitions
      queryClient.invalidateQueries({ queryKey: ['task-definition'] });
      queryClient.invalidateQueries({ queryKey: ['sprint-task-definitions'] });
      toast.success("Panel updated successfully");
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
