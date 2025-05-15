
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const useIPTaskSave = (taskId: string) => {
  const { user } = useAuth();
  
  const saveIPTaskData = useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from('user_sprint_progress')
        .upsert({
          task_id: taskId,
          user_id: user.id,
          task_answers: data,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'task_id,user_id'
        });
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success('IP & Technology Transfer task completed successfully');
    },
    onError: (error) => {
      console.error('Error saving IP task data:', error);
      toast.error('Failed to save your progress. Please try again.');
    }
  });
  
  return { saveIPTaskData };
};
