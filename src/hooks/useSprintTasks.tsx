
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTask, UserSprintProgress, UserTaskProgress, TaskOption } from "@/types/sprint";
import { useAuth } from "./useAuth";
import { useSprintContext } from "./useSprintContext";
import { toast } from "./use-toast";

export const useSprintTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { currentSprintOwnerId, isSharedSprint } = useSprintContext();
  
  // Fetch all sprint tasks (now global templates, not filtered by user)
  const { data: tasks, isLoading: isTasksLoading, error } = useQuery({
    queryKey: ["sprintTasks"],
    queryFn: async (): Promise<SprintTask[]> => {
      const { data, error } = await supabase
        .from("sprint_tasks")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      
      return (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        order_index: task.order_index,
        upload_required: task.upload_required,
        content: task.content,
        question: task.question,
        options: task.options as unknown as TaskOption[] | null,
        category: task.category,
        status: task.status
      }));
    },
    enabled: !!user,
  });

  // Fetch user progress for sprint tasks
  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ["userSprintProgress", currentSprintOwnerId],
    queryFn: async (): Promise<UserSprintProgress[]> => {
      if (!currentSprintOwnerId) return [];
      
      const { data, error } = await supabase
        .from("user_sprint_progress")
        .select("*")
        .eq("user_id", currentSprintOwnerId);
      
      if (error) throw error;
      
      return (data || []).map(progress => ({
        id: progress.id,
        user_id: progress.user_id,
        task_id: progress.task_id,
        completed: progress.completed,
        file_id: progress.file_id,
        answers: progress.answers as Record<string, any> | null,
        task_answers: progress.task_answers as Record<string, any> | null,
        completed_at: progress.completed_at,
        created_at: progress.created_at
      }));
    },
    enabled: !!currentSprintOwnerId,
  });

  // Get combined task and progress data
  const tasksWithProgress: UserTaskProgress[] = tasks?.map(task => {
    const progress = userProgress?.find(p => p.task_id === task.id);
    return {
      ...task,
      order_index: task.order_index || 0, // Ensure order_index is always present
      progress
    };
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
        const updateData: Partial<UserSprintProgress> = {};
        
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
    tasks,
    userProgress,
    tasksWithProgress,
    isLoading: isTasksLoading || isProgressLoading,
    error,
    updateProgress
  };
};
