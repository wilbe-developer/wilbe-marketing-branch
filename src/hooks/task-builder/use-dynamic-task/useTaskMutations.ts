
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useSprintContext } from "@/hooks/useSprintContext";

export const useTaskMutations = (taskId: string, answers: Record<string, any>, setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>) => {
  const { user } = useAuth();
  const { currentSprintOwnerId } = useSprintContext();
  const queryClient = useQueryClient();

  // Save user's answer for a step with optimistic updates
  const answerNode = useMutation({
    mutationFn: async ({ stepId, value }: { stepId: string; value: any }) => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!currentSprintOwnerId) throw new Error("Sprint owner ID not available");

      const newAnswers = { ...answers, [stepId]: value };

      // First check if a record already exists
      const { data: existingProgress, error: checkError } = await supabase
        .from("user_sprint_progress")
        .select("id")
        .eq("user_id", currentSprintOwnerId)
        .eq("task_id", taskId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking sprint_progress:", checkError);
        throw new Error("Failed to check if progress exists");
      }

      // Update or insert based on whether a record exists
      if (existingProgress) {
        // Update existing record
        const { error } = await supabase
          .from("user_sprint_progress")
          .update({
            task_answers: newAnswers
          })
          .eq("id", existingProgress.id);

        if (error) {
          console.error("Error updating sprint_progress:", error);
          throw new Error("Failed to save answer");
        }
      } else {
        // Insert new record with initialized task_answers
        const { error } = await supabase
          .from("user_sprint_progress")
          .insert({
            user_id: currentSprintOwnerId,
            task_id: taskId,
            task_answers: newAnswers,
            answers: null, // Ensure this is properly initialized
            profile_updates: {} // Initialize empty profile updates
          });

        if (error) {
          console.error("Error inserting sprint_progress:", error);
          throw new Error("Failed to save answer");
        }
      }

      return { stepId, value, newAnswers };
    },
    onMutate: async ({ stepId, value }) => {
      // Optimistic update - immediately update local state
      const newAnswers = { ...answers, [stepId]: value };
      setAnswers(newAnswers);
      
      // Return context for potential rollback
      return { previousAnswers: answers };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousAnswers) {
        setAnswers(context.previousAnswers);
      }
      console.error("Auto-save failed:", error);
      // Don't show toast here - let AutoSaveManager handle it
    },
    onSuccess: ({ newAnswers }) => {
      // Ensure local state matches what was saved
      setAnswers(newAnswers);
      queryClient.invalidateQueries({ queryKey: ["userSprintProgress", taskId, currentSprintOwnerId] });
    },
    // Add retry configuration
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Upload a file for a step
  const uploadFile = useMutation({
    mutationFn: async ({ stepId, file }: { stepId: string; file: File }) => {
      // Implement file upload logic here
      // For now, we'll just simulate it
      const fileId = `file-${Date.now()}`;
      
      // Update answers with the file reference
      return answerNode.mutateAsync({ 
        stepId, 
        value: { fileId, fileName: file.name } 
      });
    }
  });

  // Update user's profile in response to profile questions
  const updateProfile = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!currentSprintOwnerId) throw new Error("Sprint owner ID not available");

      // Update the profile in sprint_profiles table
      const { error } = await supabase
        .from("sprint_profiles")
        .update({ [key]: value })
        .eq("user_id", currentSprintOwnerId);

      if (error) {
        throw error;
      }

      // First check if a record already exists
      const { data: existingProgress, error: checkError } = await supabase
        .from("user_sprint_progress")
        .select("id, profile_updates")
        .eq("user_id", currentSprintOwnerId)
        .eq("task_id", taskId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking sprint_progress:", checkError);
        throw new Error("Failed to check if progress exists");
      }

      // Get current profile updates or initialize empty object
      let profileUpdates = existingProgress?.profile_updates || {};
      if (typeof profileUpdates !== 'object' || profileUpdates === null) {
        profileUpdates = {};
      }

      // Add the new profile update
      profileUpdates[key] = value;

      if (existingProgress) {
        // Update existing record
        const { error: progressError } = await supabase
          .from("user_sprint_progress")
          .update({
            profile_updates: profileUpdates
          })
          .eq("id", existingProgress.id);

        if (progressError) {
          throw progressError;
        }
      } else {
        // Insert new record with initialized fields
        const { error: progressError } = await supabase
          .from("user_sprint_progress")
          .insert({
            user_id: currentSprintOwnerId,
            task_id: taskId,
            profile_updates: profileUpdates,
            task_answers: {}, // Initialize empty task answers
            answers: null // Ensure this is properly initialized
          });

        if (progressError) {
          throw progressError;
        }
      }

      return { key, value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSprintProgress", taskId, currentSprintOwnerId] });
      queryClient.invalidateQueries({ queryKey: ["sprintProfile", currentSprintOwnerId] });
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  // Mark task as completed
  const completeTask = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!currentSprintOwnerId) throw new Error("Sprint owner ID not available");

      // First check if a record already exists
      const { data: existingProgress, error: checkError } = await supabase
        .from("user_sprint_progress")
        .select("id")
        .eq("user_id", currentSprintOwnerId)
        .eq("task_id", taskId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking sprint_progress:", checkError);
        throw new Error("Failed to check if progress exists");
      }

      if (existingProgress) {
        // Update existing record
        const { error } = await supabase
          .from("user_sprint_progress")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
            task_answers: answers
          })
          .eq("id", existingProgress.id);

        if (error) {
          throw new Error("Failed to complete task");
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from("user_sprint_progress")
          .insert({
            user_id: currentSprintOwnerId,
            task_id: taskId,
            completed: true,
            completed_at: new Date().toISOString(),
            task_answers: answers,
            answers: null,
            profile_updates: {}
          });

        if (error) {
          throw new Error("Failed to complete task");
        }
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSprintProgress", taskId, currentSprintOwnerId] });
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
    },
    onError: (error) => {
      toast.error(`Failed to complete task: ${error.message}`);
    }
  });

  return {
    answerNode,
    uploadFile,
    updateProfile,
    completeTask
  };
};
