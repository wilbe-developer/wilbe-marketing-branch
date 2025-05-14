
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useSharedSprint } from "@/hooks/useSharedSprint";

export const useSprintSubmission = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { isSharedSprint, sprintOwnerId, isReadOnly } = useSharedSprint();

  const handleSubmit = async (taskId: string, data: any, isUpload = false) => {
    if (!user?.id || !taskId) {
      toast({
        title: "Error",
        description: "You must be logged in to submit",
        variant: "destructive",
      });
      return;
    }

    if (isReadOnly) {
      toast({
        title: "View-only access",
        description: "You don't have permission to edit this sprint",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Determine which user ID to use for the progress record
      // For shared sprints we're updating on behalf of the owner
      const userId = isSharedSprint ? sprintOwnerId : user.id;
      
      // Check if there's an existing progress record
      const { data: existingProgress, error: fetchError } = await supabase
        .from("user_sprint_progress")
        .select("id")
        .eq("task_id", taskId)
        .eq("user_id", userId)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
      
      // Prepare the progress data
      const progressData = {
        user_id: userId,
        task_id: taskId,
        completed: true,
        completed_at: new Date().toISOString(),
        task_answers: data,
      };
      
      // Update or insert the progress record
      if (existingProgress) {
        const { error: updateError } = await supabase
          .from("user_sprint_progress")
          .update(progressData)
          .eq("id", existingProgress.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("user_sprint_progress")
          .insert(progressData);
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Success",
        description: isUpload ? "File uploaded successfully" : "Answer saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error saving progress",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};

export default useSprintSubmission;
