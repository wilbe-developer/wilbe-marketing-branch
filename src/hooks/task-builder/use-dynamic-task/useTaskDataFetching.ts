
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskDefinition } from "@/types/task-builder";
import { useAuth } from "@/hooks/useAuth";

export const useTaskDataFetching = (taskId: string) => {
  const { user } = useAuth();

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
  const { data: sprintProgress, isLoading: isLoadingSprintProgress } = useQuery({
    queryKey: ["userSprintProgress", taskId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_sprint_progress")
        .select("*")
        .eq("task_id", taskId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw new Error(`Error fetching sprint progress: ${error.message}`);
      }

      return data;
    },
    enabled: !!taskId && !!user?.id,
  });

  return {
    taskDefinition,
    sprintProgress,
    isLoading: isLoadingTask || isLoadingSprintProgress
  };
};
