
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SprintTask, UserTaskProgress } from '@/types/sprint';
import { Json } from '@/integrations/supabase/types';

export function useSprintTasks() {
  const [tasksWithProgress, setTasksWithProgress] = useState<UserTaskProgress[]>([]);
  const queryClient = useQueryClient();

  // Fetch sprint tasks with progress
  const { data, isLoading, error } = useQuery({
    queryKey: ['sprint-tasks'],
    queryFn: async () => {
      // Get all sprint tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('sprint_tasks')
        .select('*')
        .order('order_index');

      if (tasksError) throw tasksError;

      // Get user progress for tasks
      const { data: userProgress, error: progressError } = await supabase
        .from('user_sprint_progress')
        .select('*');

      if (progressError) throw progressError;

      // Combine tasks with progress
      const tasksWithUserProgress = tasks.map((task) => {
        const progress = userProgress.find((p) => p.task_id === task.id);
        return {
          ...task,
          // Ensure that options is properly typed as TaskOption[] | null
          options: task.options as unknown as SprintTask['options'],
          progress: progress || null
        };
      }) as UserTaskProgress[];

      return tasksWithUserProgress;
    }
  });

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setTasksWithProgress(data);
    }
  }, [data]);

  // Update task progress
  const updateProgress = useMutation({
    mutationFn: async ({ 
      taskId, 
      completed, 
      fileId = null, 
      answers = null 
    }: { 
      taskId: string; 
      completed: boolean; 
      fileId?: string | null; 
      answers?: Record<string, any> | null;
    }) => {
      // Get existing progress
      const { data: existingProgress } = await supabase
        .from('user_sprint_progress')
        .select('*')
        .eq('task_id', taskId)
        .maybeSingle();

      const completedAt = completed ? new Date().toISOString() : null;
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      if (existingProgress) {
        // Update existing progress
        const { data, error } = await supabase
          .from('user_sprint_progress')
          .update({
            completed,
            completed_at: completedAt,
            file_id: fileId !== undefined ? fileId : existingProgress.file_id,
            answers: answers as Json
          })
          .eq('id', existingProgress.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new progress
        const { data, error } = await supabase
          .from('user_sprint_progress')
          .insert({
            task_id: taskId,
            user_id: userId,
            completed,
            completed_at: completedAt,
            file_id: fileId,
            answers: answers as Json
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['sprint-tasks'] });
    }
  });

  return {
    tasksWithProgress,
    updateProgress,
    isLoading,
    error
  };
}
