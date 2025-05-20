
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskDefinition } from "@/types/task-builder";
import { useAuth } from "@/hooks/useAuth";
import { useSprintContext } from "@/hooks/useSprintContext";

export const useTaskDataFetching = (taskId: string) => {
  const { user } = useAuth();
  const { currentSprintOwnerId } = useSprintContext();

  // Fetch task definition
  const { data: taskDefinition, isLoading: isLoadingTask } = useQuery({
    queryKey: ["taskDefinition", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) {
        throw new Error(`Error fetching task definition: ${error.message}`);
      }

      // Type assertion to convert from Json to TaskDefinition
      return data.definition as unknown as TaskDefinition;
    },
    enabled: !!taskId,
  });

  // Fetch user progress only from user_sprint_progress table
  // Use the currentSprintOwnerId from SprintContext instead of user.id
  const { data: sprintProgress, isLoading: isLoadingSprintProgress } = useQuery({
    queryKey: ["userSprintProgress", taskId, currentSprintOwnerId],
    queryFn: async () => {
      if (!currentSprintOwnerId) return null;

      const { data, error } = await supabase
        .from("user_sprint_progress")
        .select("*")
        .eq("task_id", taskId)
        .eq("user_id", currentSprintOwnerId)
        .maybeSingle();

      if (error) {
        throw new Error(`Error fetching sprint progress: ${error.message}`);
      }

      return data;
    },
    enabled: !!taskId && !!currentSprintOwnerId,
  });

  return {
    taskDefinition,
    sprintProgress,
    isLoading: isLoadingTask || isLoadingSprintProgress
  };
};
