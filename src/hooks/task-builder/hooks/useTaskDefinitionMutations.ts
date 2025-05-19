
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskDefinition, TaskDefinition } from "@/types/task-builder";
import { toast } from "sonner";
import { ensureValidIdsInObject, generateStableId } from "@/utils/stableId";
import { TASK_DEFINITIONS_QUERY_KEY } from "./useTaskDefinitionsQuery";
import { processTaskDefinition, parseTaskDefinition } from "@/utils/task-builder/taskDefinitionValidation";

/**
 * Hook providing mutations for task definitions (create, update, delete)
 */
export const useTaskDefinitionMutations = () => {
  const queryClient = useQueryClient();

  // Create a new task definition with valid IDs
  const createTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: Omit<SprintTaskDefinition, "id" | "created_at" | "updated_at">) => {
      try {
        console.log("Creating new task definition:", taskDefinition.name);
        
        // Validate the definition before sending to the database
        if (!taskDefinition.definition) {
          console.error("Missing definition object");
          throw new Error("Task definition is missing");
        }
        
        if (!taskDefinition.name) {
          console.error("Missing task name");
          throw new Error("Task name is required");
        }
        
        // Deep clone the definition to avoid reference issues
        const processedDefinition = JSON.parse(JSON.stringify(taskDefinition.definition)) as TaskDefinition;
        
        // Make sure steps array exists
        if (!Array.isArray(processedDefinition.steps)) {
          console.warn("No steps array found, creating empty one");
          processedDefinition.steps = [];
        }
        
        // Make sure profileQuestions array exists
        if (!Array.isArray(processedDefinition.profileQuestions)) {
          console.warn("No profileQuestions array found, creating empty one");
          processedDefinition.profileQuestions = [];
        }
        
        // Ensure all IDs throughout the definition are valid
        const validatedDefinition = ensureValidIdsInObject(processedDefinition);
        
        const { data, error } = await supabase
          .from("sprint_task_definitions")
          .insert({
            name: taskDefinition.name,
            description: taskDefinition.description,
            definition: validatedDefinition as any // Type cast to any for JSON compatibility
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating task definition:", error);
          throw new Error(`Error creating task definition: ${error.message}`);
        }

        if (!data) {
          throw new Error("No data returned from task creation");
        }

        console.log("Task definition created successfully:", data);
        
        // Process the task definition
        return processTaskDefinition(data);
      } catch (err: any) {
        console.error("Error in createTaskDefinition:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
      queryClient.setQueryData([TASK_DEFINITIONS_QUERY_KEY, data.id], data);
    },
    onError: (error: Error) => {
      console.error("Task creation error:", error);
      toast.error(`Failed to create task: ${error.message}`);
    }
  });

  // Update an existing task definition
  const updateTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: Pick<SprintTaskDefinition, "id" | "name" | "description" | "definition">) => {
      try {
        console.log("Updating task definition:", taskDefinition);
        
        // Validate the input
        if (!taskDefinition.id) {
          throw new Error("Task ID is required");
        }
        
        if (!taskDefinition.name) {
          throw new Error("Task name is required");
        }
        
        if (!taskDefinition.definition) {
          throw new Error("Task definition is required");
        }
        
        // Deep clone the definition to avoid reference issues
        const processedDefinition = JSON.parse(JSON.stringify(taskDefinition.definition)) as TaskDefinition;
        
        // Make sure steps array exists
        if (!Array.isArray(processedDefinition.steps)) {
          console.warn("No steps array found, creating empty one");
          processedDefinition.steps = [];
        }

        // Ensure all IDs are valid
        const validatedDefinition = ensureValidIdsInObject(processedDefinition);
        
        const { data, error } = await supabase
          .from("sprint_task_definitions")
          .update({
            name: taskDefinition.name,
            description: taskDefinition.description,
            definition: validatedDefinition as any // Type cast to any for JSON compatibility
          })
          .eq("id", taskDefinition.id)
          .select()
          .single();

        if (error) {
          console.error("Supabase error updating task definition:", error);
          throw new Error(`Error updating task definition: ${error.message}`);
        }

        if (!data) {
          throw new Error(`Task with ID ${taskDefinition.id} not found`);
        }

        console.log("Task definition updated successfully:", data);
        
        // Process the task definition
        return processTaskDefinition(data);
      } catch (err: any) {
        console.error("Exception in updateTaskDefinition:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
      queryClient.setQueryData([TASK_DEFINITIONS_QUERY_KEY, data.id], data);
      toast.success("Task definition updated successfully");
    },
    onError: (error: Error) => {
      console.error("Task update error:", error);
      toast.error(`Failed to update task: ${error.message}`);
    }
  });

  // Delete a task definition
  const deleteTaskDefinition = useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log(`Deleting task definition with ID: ${id}`);
        
        const { error } = await supabase
          .from("sprint_task_definitions")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting task definition:", error);
          throw new Error(`Error deleting task definition: ${error.message}`);
        }

        console.log("Task definition deleted successfully");
        return id;
      } catch (err: any) {
        console.error("Error in deleteTaskDefinition:", err);
        throw err;
      }
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY, id] });
    },
    onError: (error: Error) => {
      console.error("Task deletion error:", error);
      toast.error(`Failed to delete task: ${error.message}`);
    }
  });

  return {
    createTaskDefinition,
    updateTaskDefinition,
    deleteTaskDefinition
  };
};

/**
 * Create a new empty task definition template with valid IDs
 */
export const createEmptyTaskDefinition = (): Omit<SprintTaskDefinition, "id" | "created_at" | "updated_at"> => {
  try {
    console.log("Creating empty task definition template");
    const stableId = generateStableId();
    
    return {
      name: "New Task",
      description: "Task description",
      definition: {
        taskName: "New Task",
        description: "Task description",
        profileQuestions: [],
        steps: [
          {
            id: stableId,
            type: "question",
            text: "Initial question",
            inputType: "radio",
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" }
            ]
          }
        ]
      }
    };
  } catch (err) {
    console.error("Error creating empty task definition:", err);
    // Return a minimal valid template even if uuid generation fails
    return {
      name: "New Task",
      description: "Task description",
      definition: {
        taskName: "New Task",
        description: "Task description",
        profileQuestions: [],
        steps: []
      }
    };
  }
};
