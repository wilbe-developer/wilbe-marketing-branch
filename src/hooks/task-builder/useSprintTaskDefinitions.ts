
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskDefinition, TaskDefinition } from "@/types/task-builder";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useSprintTaskDefinitions = () => {
  const queryClient = useQueryClient();

  // Fetch all task definitions
  const { data: taskDefinitions, isLoading, error } = useQuery({
    queryKey: ["sprintTaskDefinitions"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("sprint_task_definitions")
          .select("*")
          .order("name");

        if (error) {
          throw new Error(`Error fetching task definitions: ${error.message}`);
        }

        if (!data) {
          return [] as SprintTaskDefinition[];
        }

        return data.map(item => {
          try {
            const definition = typeof item.definition === 'string' 
              ? JSON.parse(item.definition) 
              : item.definition;
              
            return {
              ...item,
              definition: definition as TaskDefinition
            };
          } catch (err) {
            console.error("Error parsing task definition:", err, item);
            // Return a minimal valid task definition
            return {
              ...item,
              definition: {
                taskName: item.name || "Error: Invalid Definition",
                description: "This task definition has invalid JSON data.",
                profileQuestions: [],
                steps: []
              } as TaskDefinition
            };
          }
        }) as SprintTaskDefinition[];
      } catch (err) {
        console.error("Error in task definitions query:", err);
        throw err;
      }
    }
  });

  // Fetch a single task definition by ID
  const fetchTaskDefinition = async (id: string) => {
    try {
      console.log(`Fetching task definition with ID: ${id}`);
      
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .select("*")
        .eq("id", id)
        .single();
          
      if (error) {
        console.error(`Error fetching task definition: ${error.message}`);
        throw new Error(`Error fetching task definition: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Task definition with ID ${id} not found`);
      }

      console.log("Raw task data from database:", data);
      
      // Ensure definition is properly parsed
      let parsedDefinition: TaskDefinition;
      
      try {
        parsedDefinition = typeof data.definition === 'string'
          ? JSON.parse(data.definition)
          : data.definition;
            
        // Validate required fields exist
        if (!parsedDefinition.taskName || !Array.isArray(parsedDefinition.steps)) {
          throw new Error("Invalid task definition structure");
        }
        
        // Ensure profileQuestions is always an array
        if (!parsedDefinition.profileQuestions) {
          parsedDefinition.profileQuestions = [];
        }
      } catch (parseError) {
        console.error("Failed to parse definition:", parseError, data.definition);
        // Provide a fallback minimal definition
        parsedDefinition = {
          taskName: data.name || "Error: Invalid Definition",
          description: "This task definition could not be parsed correctly.",
          profileQuestions: [],
          steps: []
        };
      }
      
      const result = {
        ...data,
        definition: parsedDefinition
      } as SprintTaskDefinition;
      
      console.log("Processed task definition:", result);
      return result;
    } catch (error) {
      console.error("Error fetching task definition:", error);
      throw error; // Re-throw to be handled by the component
    }
  };

  // Create a new task definition
  const createTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: Omit<SprintTaskDefinition, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await supabase
          .from("sprint_task_definitions")
          .insert({
            name: taskDefinition.name,
            description: taskDefinition.description,
            definition: taskDefinition.definition as any // Type cast to any for JSON compatibility
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

        return {
          ...data,
          definition: data.definition as unknown as TaskDefinition
        } as SprintTaskDefinition;
      } catch (err) {
        console.error("Error in createTaskDefinition:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
      toast.success("Task definition created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Update an existing task definition
  const updateTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: Pick<SprintTaskDefinition, "id" | "name" | "description" | "definition">) => {
      try {
        console.log("Updating task definition:", taskDefinition);
        
        const { data, error } = await supabase
          .from("sprint_task_definitions")
          .update({
            name: taskDefinition.name,
            description: taskDefinition.description,
            definition: taskDefinition.definition as any // Type cast to any for JSON compatibility
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

        return {
          ...data,
          definition: data.definition as unknown as TaskDefinition
        } as SprintTaskDefinition;
      } catch (err) {
        console.error("Exception in updateTaskDefinition:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
      toast.success("Task definition updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Delete a task definition
  const deleteTaskDefinition = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sprint_task_definitions")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Error deleting task definition: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
      toast.success("Task definition deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Create a new empty task definition template
  const createEmptyTaskDefinition = (): Omit<SprintTaskDefinition, "id" | "created_at" | "updated_at"> => {
    return {
      name: "New Task",
      description: "Task description",
      definition: {
        taskName: "New Task",
        description: "Task description",
        profileQuestions: [],
        steps: [
          {
            id: uuidv4(),
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
  };

  return {
    taskDefinitions,
    isLoading,
    error,
    fetchTaskDefinition,
    createTaskDefinition,
    updateTaskDefinition,
    deleteTaskDefinition,
    createEmptyTaskDefinition
  };
};
