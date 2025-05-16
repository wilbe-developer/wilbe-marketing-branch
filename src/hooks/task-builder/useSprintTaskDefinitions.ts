
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskDefinition, TaskDefinition } from "@/types/task-builder";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Stable ID generator with fallback
const generateStableId = () => {
  try {
    return uuidv4();
  } catch (error) {
    console.error("UUID generation failed, using timestamp fallback:", error);
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
};

export const useSprintTaskDefinitions = () => {
  const queryClient = useQueryClient();

  // Fetch all task definitions
  const { data: taskDefinitions, isLoading, error } = useQuery({
    queryKey: ["sprintTaskDefinitions"],
    queryFn: async () => {
      try {
        console.log("Fetching all task definitions");
        const { data, error } = await supabase
          .from("sprint_task_definitions")
          .select("*")
          .order("name");

        if (error) {
          console.error("Supabase error when fetching task definitions:", error);
          throw new Error(`Error fetching task definitions: ${error.message}`);
        }

        if (!data) {
          console.log("No task definitions found, returning empty array");
          return [] as SprintTaskDefinition[];
        }

        console.log(`Found ${data.length} task definitions`);
        
        // Process and validate each task definition
        return data.map(item => {
          try {
            // Parse definition if it's a string
            let parsedDefinition: TaskDefinition;
            
            if (typeof item.definition === 'string') {
              parsedDefinition = JSON.parse(item.definition) as TaskDefinition;
            } else if (item.definition && typeof item.definition === 'object') {
              // Add explicit type assertion with safety check
              const definitionObj = item.definition as Record<string, any>;
              parsedDefinition = {
                taskName: definitionObj.taskName || item.name || "Unnamed Task",
                steps: Array.isArray(definitionObj.steps) ? definitionObj.steps : [],
                profileQuestions: Array.isArray(definitionObj.profileQuestions) 
                  ? definitionObj.profileQuestions 
                  : [],
                // Copy any other properties
                ...definitionObj
              };
            } else {
              throw new Error("Invalid definition format");
            }
              
            // Ensure required properties exist
            if (!parsedDefinition.taskName) {
              console.warn(`Task ${item.id} missing taskName, adding default`);
              parsedDefinition.taskName = item.name || "Unnamed Task";
            }
            
            if (!Array.isArray(parsedDefinition.steps)) {
              console.warn(`Task ${item.id} missing steps array, adding empty array`);
              parsedDefinition.steps = [];
            }
            
            if (!Array.isArray(parsedDefinition.profileQuestions)) {
              console.warn(`Task ${item.id} missing profileQuestions array, adding empty array`);
              parsedDefinition.profileQuestions = [];
            }
            
            return {
              ...item,
              definition: parsedDefinition
            };
          } catch (err) {
            console.error("Error processing task definition:", err, item);
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
    },
    retry: 2,
    staleTime: 30000, // 30 seconds - don't refetch too frequently
    refetchOnWindowFocus: false
  });

  // Fetch a single task definition by ID
  const fetchTaskDefinition = async (id: string) => {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }
      
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
        console.error(`Task definition with ID ${id} not found`);
        throw new Error(`Task definition with ID ${id} not found`);
      }

      console.log("Raw task data from database:", data);
      
      // Ensure definition is properly parsed
      let parsedDefinition: TaskDefinition;
      
      try {
        if (typeof data.definition === 'string') {
          parsedDefinition = JSON.parse(data.definition) as TaskDefinition;
        } else if (data.definition && typeof data.definition === 'object') {
          // Add explicit type assertion with safety check
          const definitionObj = data.definition as Record<string, any>;
          parsedDefinition = {
            taskName: definitionObj.taskName || data.name || "Unnamed Task",
            steps: Array.isArray(definitionObj.steps) ? definitionObj.steps : [],
            profileQuestions: Array.isArray(definitionObj.profileQuestions) 
              ? definitionObj.profileQuestions 
              : [],
            // Copy any other properties
            ...definitionObj
          };
        } else {
          throw new Error("Invalid definition data format");
        }
            
        // Validate required fields exist
        if (!parsedDefinition.taskName || !Array.isArray(parsedDefinition.steps)) {
          console.warn("Task definition missing required fields, adding defaults");
          parsedDefinition = {
            ...parsedDefinition,
            taskName: parsedDefinition.taskName || data.name || "Unnamed Task",
            steps: Array.isArray(parsedDefinition.steps) ? parsedDefinition.steps : []
          };
        }
        
        // Ensure profileQuestions is always an array
        if (!Array.isArray(parsedDefinition.profileQuestions)) {
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
    } catch (error: any) {
      console.error("Error fetching task definition:", error);
      throw error; // Re-throw to be handled by the component
    }
  };

  // Create a new task definition
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
        
        // Make sure steps array exists
        if (!Array.isArray(taskDefinition.definition.steps)) {
          console.warn("No steps array found, creating empty one");
          taskDefinition.definition.steps = [];
        }
        
        // Make sure profileQuestions array exists
        if (!Array.isArray(taskDefinition.definition.profileQuestions)) {
          console.warn("No profileQuestions array found, creating empty one");
          taskDefinition.definition.profileQuestions = [];
        }
        
        // Ensure all steps have stable IDs
        if (taskDefinition.definition.steps) {
          taskDefinition.definition.steps = taskDefinition.definition.steps.map(step => {
            if (!step.id) {
              return {
                ...step,
                id: generateStableId()
              };
            }
            return step;
          });
        }
        
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

        console.log("Task definition created successfully:", data);

        let definition: TaskDefinition;
        
        // Parse definition if needed
        if (typeof data.definition === 'string') {
          definition = JSON.parse(data.definition) as TaskDefinition;
        } else if (data.definition && typeof data.definition === 'object') {
          // Add explicit type assertion with safety check
          const definitionObj = data.definition as Record<string, any>;
          definition = {
            taskName: definitionObj.taskName || data.name || "Unnamed Task",
            steps: Array.isArray(definitionObj.steps) ? definitionObj.steps : [],
            profileQuestions: Array.isArray(definitionObj.profileQuestions) 
              ? definitionObj.profileQuestions 
              : [],
            // Copy any other properties
            ...definitionObj
          };
        } else {
          // Default minimal definition
          definition = {
            taskName: data.name || "Unnamed Task",
            steps: [],
            profileQuestions: []
          };
        }

        return {
          ...data,
          definition
        } as SprintTaskDefinition;
      } catch (err: any) {
        console.error("Error in createTaskDefinition:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
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
        
        // Make sure steps array exists
        if (!Array.isArray(taskDefinition.definition.steps)) {
          console.warn("No steps array found, creating empty one");
          taskDefinition.definition.steps = [];
        }

        // Ensure all steps have stable IDs
        if (taskDefinition.definition.steps) {
          taskDefinition.definition.steps = taskDefinition.definition.steps.map(step => {
            if (!step.id) {
              return {
                ...step,
                id: generateStableId()
              };
            }
            return step;
          });
        }
        
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

        console.log("Task definition updated successfully:", data);

        let definition: TaskDefinition;
        
        // Parse definition if needed
        if (typeof data.definition === 'string') {
          definition = JSON.parse(data.definition) as TaskDefinition;
        } else if (data.definition && typeof data.definition === 'object') {
          // Add explicit type assertion with safety check
          const definitionObj = data.definition as Record<string, any>;
          definition = {
            taskName: definitionObj.taskName || data.name || "Unnamed Task",
            steps: Array.isArray(definitionObj.steps) ? definitionObj.steps : [],
            profileQuestions: Array.isArray(definitionObj.profileQuestions) 
              ? definitionObj.profileQuestions 
              : [],
            // Copy any other properties
            ...definitionObj
          };
        } else {
          // Default minimal definition
          definition = {
            taskName: data.name || "Unnamed Task",
            steps: [],
            profileQuestions: []
          };
        }

        return {
          ...data,
          definition
        } as SprintTaskDefinition;
      } catch (err: any) {
        console.error("Exception in updateTaskDefinition:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
    },
    onError: (error: Error) => {
      console.error("Task deletion error:", error);
      toast.error(`Failed to delete task: ${error.message}`);
    }
  });

  // Create a new empty task definition template
  const createEmptyTaskDefinition = (): Omit<SprintTaskDefinition, "id" | "created_at" | "updated_at"> => {
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
