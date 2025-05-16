
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskDefinition } from "@/types/task-builder";
import { UserTaskProgress } from "@/types/sprint";
import { useAuth } from "./useAuth";
import { useSprintContext } from "./useSprintContext";
import { toast } from "sonner";

export const useSprintTaskDefinitions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { currentSprintOwnerId, isSharedSprint } = useSprintContext();
  
  // Fetch task definitions
  const { data: taskDefinitions, isLoading: isTasksLoading, error } = useQuery({
    queryKey: ["sprintTaskDefinitions", "dashboard"],
    queryFn: async (): Promise<SprintTaskDefinition[]> => {
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch user progress for tasks
  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ["userSprintProgress", currentSprintOwnerId],
    queryFn: async () => {
      if (!currentSprintOwnerId) return [];
      
      const { data, error } = await supabase
        .from("user_sprint_progress")
        .select("*")
        .eq("user_id", currentSprintOwnerId);
      
      if (error) throw error;
      
      return data || [];
    },
    enabled: !!currentSprintOwnerId,
  });

  // Convert task definitions to format compatible with the dashboard
  const tasksWithProgress: UserTaskProgress[] = taskDefinitions?.map(taskDef => {
    // Extract task id and find progress record
    const taskId = taskDef.id;
    const progress = userProgress?.find(p => p.task_id === taskId);

    // Convert task definition to UserTaskProgress format
    const taskProgress: UserTaskProgress = {
      id: taskDef.id,
      title: taskDef.name,
      description: taskDef.description || "",
      order_index: 0, // We'll need to add this to the definitions table later
      upload_required: taskDef.definition?.requiresUpload || false,
      content: taskDef.definition?.content || null,
      question: taskDef.definition?.mainQuestion || null,
      options: null,
      category: taskDef.definition?.category || null,
      status: "active",
      progress
    };

    return taskProgress;
  }) || [];

  // Update user progress
  const updateProgress = useMutation({
    mutationFn: async (params: { 
      taskId: string; 
      completed?: boolean; 
      answers?: Record<string, any>; 
      taskAnswers?: Record<string, any>;
      fileId?: string | null;
    }) => {
      if (!user || !currentSprintOwnerId) {
        throw new Error("User not authenticated");
      }
      
      const { taskId, completed, answers, taskAnswers, fileId } = params;
      
      // Check if progress entry exists
      const { data: existingProgress } = await supabase
        .from("user_sprint_progress")
        .select("id")
        .eq("user_id", currentSprintOwnerId)
        .eq("task_id", taskId)
        .maybeSingle();
      
      const now = new Date().toISOString();
      
      if (existingProgress) {
        // Update existing progress
        const updateData: Record<string, any> = {};
        
        if (completed !== undefined) {
          updateData.completed = completed;
          if (completed) updateData.completed_at = now;
        }
        
        if (answers !== undefined) updateData.answers = answers;
        if (taskAnswers !== undefined) updateData.task_answers = taskAnswers;
        if (fileId !== undefined) updateData.file_id = fileId;
        
        const { error } = await supabase
          .from("user_sprint_progress")
          .update(updateData)
          .eq("id", existingProgress.id);
        
        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from("user_sprint_progress")
          .insert({
            user_id: currentSprintOwnerId,
            task_id: taskId,
            completed: completed || false,
            answers: answers || null,
            task_answers: taskAnswers || null,
            file_id: fileId || null,
            completed_at: completed ? now : null
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSprintProgress", currentSprintOwnerId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive"
      });
      console.error("Update progress error:", error);
    }
  });

  return {
    tasks: taskDefinitions,
    userProgress,
    tasksWithProgress,
    isLoading: isTasksLoading || isProgressLoading,
    error,
    updateProgress
  };
};
