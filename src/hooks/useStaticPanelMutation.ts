
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskDefinition, StaticPanel, StaticPanelItem } from "@/types/task-builder";

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

interface AddPanelItemParams {
  taskId: string;
  panelIndex: number;
  newItem: StaticPanelItem;
}

interface AddNewPanelParams {
  taskId: string;
  newPanel: StaticPanel;
  position?: 'start' | 'end';
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
      
      // Invalidate the correct query key that matches what the component uses
      queryClient.invalidateQueries({ 
        queryKey: ["taskDefinition", variables.taskId] 
      });
      
      // Force refetch the specific task with the correct key
      queryClient.refetchQueries({ 
        queryKey: ["taskDefinition", variables.taskId] 
      });
    },
    onError: (error) => {
      console.error('Error updating static panel:', error);
      toast.error("Failed to update panel");
    }
  });

  const addPanelItem = useMutation({
    mutationFn: async ({ taskId, panelIndex, newItem }: AddPanelItemParams) => {
      console.log("Adding panel item:", { taskId, panelIndex, newItem });
      
      const { data: taskDef, error: fetchError } = await supabase
        .from('sprint_task_definitions')
        .select('definition')
        .eq('id', taskId)
        .single();

      if (fetchError || !taskDef) {
        throw new Error('Failed to fetch task definition');
      }

      const definition = taskDef.definition as unknown as TaskDefinition;
      
      if (!definition.staticPanels || !definition.staticPanels[panelIndex]) {
        throw new Error('Panel not found');
      }

      const updatedPanels = [...definition.staticPanels];
      const panel = updatedPanels[panelIndex];
      
      // Initialize items if it doesn't exist
      if (!panel.items) {
        panel.items = [];
      }
      
      // Set proper order for new item
      const maxOrder = panel.items.reduce((max, item) => Math.max(max, item.order || 0), 0);
      newItem.order = maxOrder + 1;
      
      // Add the new item
      panel.items = [...panel.items, newItem];

      const updatedDefinition = {
        ...definition,
        staticPanels: updatedPanels
      };

      const { error: updateError } = await supabase
        .from('sprint_task_definitions')
        .update({
          definition: updatedDefinition as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) {
        throw updateError;
      }

      return { panelIndex, newItem };
    },
    onSuccess: (data, variables) => {
      console.log("Item added successfully:", data);
      queryClient.invalidateQueries({ 
        queryKey: ["taskDefinition", variables.taskId] 
      });
    },
    onError: (error) => {
      console.error('Error adding panel item:', error);
      toast.error("Failed to add item");
    }
  });

  const addNewPanel = useMutation({
    mutationFn: async ({ taskId, newPanel, position = 'end' }: AddNewPanelParams) => {
      console.log("Adding new panel:", { taskId, newPanel, position });
      
      const { data: taskDef, error: fetchError } = await supabase
        .from('sprint_task_definitions')
        .select('definition')
        .eq('id', taskId)
        .single();

      if (fetchError || !taskDef) {
        throw new Error('Failed to fetch task definition');
      }

      const definition = taskDef.definition as unknown as TaskDefinition;
      
      let updatedPanels = definition.staticPanels || [];
      
      if (position === 'start') {
        updatedPanels = [newPanel, ...updatedPanels];
      } else {
        updatedPanels = [...updatedPanels, newPanel];
      }

      const updatedDefinition = {
        ...definition,
        staticPanels: updatedPanels
      };

      const { error: updateError } = await supabase
        .from('sprint_task_definitions')
        .update({
          definition: updatedDefinition as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) {
        throw updateError;
      }

      return { newPanel };
    },
    onSuccess: (data, variables) => {
      console.log("Panel added successfully:", data);
      queryClient.invalidateQueries({ 
        queryKey: ["taskDefinition", variables.taskId] 
      });
    },
    onError: (error) => {
      console.error('Error adding new panel:', error);
      toast.error("Failed to add panel");
    }
  });

  return {
    updateStaticPanel: updateStaticPanel.mutate,
    addPanelItem: addPanelItem.mutate,
    addNewPanel: addNewPanel.mutate,
    isUpdating: updateStaticPanel.isPending,
    isAddingItem: addPanelItem.isPending,
    isAddingPanel: addNewPanel.isPending
  };
};
