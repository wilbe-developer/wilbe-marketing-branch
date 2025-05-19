
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskDefinition } from "@/types/task-builder";
import { processTaskDefinition } from "@/utils/task-builder/taskDefinitionValidation";

export const TASK_DEFINITIONS_QUERY_KEY = "sprintTaskDefinitions";

/**
 * Hook to fetch all task definitions
 */
export const useTaskDefinitionsQuery = () => {
  return useQuery({
    queryKey: [TASK_DEFINITIONS_QUERY_KEY],
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
        return data.map(processTaskDefinition) as SprintTaskDefinition[];
      } catch (err) {
        console.error("Error in task definitions query:", err);
        throw err;
      }
    },
    retry: 3, // Increase retries for network/transient issues
    staleTime: 30000, // 30 seconds - don't refetch too frequently
    refetchOnWindowFocus: false
  });
};

/**
 * Fetches a single task definition by ID
 */
export const fetchTaskDefinition = async (queryClient: any, id: string) => {
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
    
    // Process the task definition
    const result = processTaskDefinition(data);
    
    console.log("Processed task definition:", result);
    
    // Cache the result for faster access
    queryClient.setQueryData([TASK_DEFINITIONS_QUERY_KEY, id], result);
    
    return result;
  } catch (error: any) {
    console.error("Error fetching task definition:", error);
    throw error;
  }
};
