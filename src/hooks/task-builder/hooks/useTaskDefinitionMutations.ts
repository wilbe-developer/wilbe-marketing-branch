
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { TASK_DEFINITIONS_QUERY_KEY } from "./useTaskDefinitionsQuery";
import { SprintTaskDefinition, TaskDefinition } from "@/types/task-builder";
import { toast } from "sonner";

/**
 * Create an empty task definition as a starting point
 */
export const createEmptyTaskDefinition = (): SprintTaskDefinition => {
  return {
    id: uuidv4(),
    name: "New Task",
    description: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    definition: {
      taskName: "New Task",
      description: "",
      steps: [
        {
          id: uuidv4(),
          type: "question",
          text: "First Question",
          inputType: "text"
        }
      ],
      profileQuestions: [],
      category: "general",
      order_index: 0
    }
  };
};

/**
 * Hook for task definition mutations (create, update, delete)
 */
export const useTaskDefinitionMutations = () => {
  const queryClient = useQueryClient();

  // Create a new task definition
  const createTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: SprintTaskDefinition) => {
      console.log("Creating task definition:", taskDefinition);
      
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .insert({
          name: taskDefinition.name,
          description: taskDefinition.description || "",
          definition: JSON.parse(JSON.stringify(taskDefinition.definition)) // Convert to JSON compatible format
        })
        .select("*")
        .single();

      if (error) {
        console.error("Error creating task definition:", error);
        throw error;
      }

      console.log("Task definition created:", data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
      toast.success("Task definition created successfully");
      return data;
    },
    onError: (error) => {
      console.error("Failed to create task definition:", error);
      toast.error("Failed to create task definition");
      throw error;
    }
  });

  // Update an existing task definition
  const updateTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: SprintTaskDefinition) => {
      console.log("Updating task definition:", taskDefinition);
      
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .update({
          name: taskDefinition.name,
          description: taskDefinition.description || "",
          definition: JSON.parse(JSON.stringify(taskDefinition.definition)), // Convert to JSON compatible format
          updated_at: new Date().toISOString()
        })
        .eq("id", taskDefinition.id)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating task definition:", error);
        throw error;
      }

      console.log("Task definition updated:", data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
      toast.success("Task definition updated successfully");
      return data;
    },
    onError: (error) => {
      console.error("Failed to update task definition:", error);
      toast.error("Failed to update task definition");
      throw error;
    }
  });

  // Delete a task definition
  const deleteTaskDefinition = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting task definition with ID:", id);
      
      const { error } = await supabase
        .from("sprint_task_definitions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting task definition:", error);
        throw error;
      }

      console.log("Task definition deleted successfully");
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
      toast.success("Task definition deleted successfully");
      return id;
    },
    onError: (error) => {
      console.error("Failed to delete task definition:", error);
      toast.error("Failed to delete task definition");
      throw error;
    }
  });

  return {
    createTaskDefinition,
    updateTaskDefinition,
    deleteTaskDefinition
  };
};
