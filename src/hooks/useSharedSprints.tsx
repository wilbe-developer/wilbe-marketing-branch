
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SharedSprint, SharedTask, UserTaskProgress } from "@/types/sprint";

// Adapter function to convert a SharedTask to UserTaskProgress format
export const adaptSharedTaskToUserTaskProgress = (task: SharedTask): UserTaskProgress => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    order_index: task.order_index || 0,
    upload_required: !!task.upload_required,
    content: null,           // Add missing properties required by UserTaskProgress
    question: null,          // Add missing properties required by UserTaskProgress
    options: null,           // Add missing properties required by UserTaskProgress
    category: task.category || null,
    status: 'active',
    progress: task.progress ? {
      id: task.progress.id,
      user_id: '', // Will be set by the client
      task_id: task.id,
      completed: task.progress.completed,
      completed_at: task.progress.completed_at || null,
      created_at: new Date().toISOString(), // Default value since it's required
      file_id: task.progress.file_id || null,
      answers: task.progress.answers || null,
      task_answers: {} // Add this empty object for the task_answers field
    } : undefined
  };
};

export function useSharedSprints(userId: string | undefined) {
  const [sharedSprints, setSharedSprints] = useState<SharedSprint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSharedSprints = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Get all sprints where the user is a collaborator
        const { data: collaborations, error: collabError } = await supabase
          .from("sprint_collaborators")
          .select("sprint_owner_id")
          .eq("collaborator_id", userId);

        if (collabError) throw collabError;
        
        if (!collaborations || collaborations.length === 0) {
          setSharedSprints([]);
          setIsLoading(false);
          return;
        }

        // Fetch owner profiles and their tasks
        const sharedSprintsList: SharedSprint[] = [];
        
        for (const collab of collaborations) {
          try {
            // Get owner profile
            const { data: ownerData } = await supabase
              .from("profiles")
              .select("first_name, last_name, email")
              .eq("id", collab.sprint_owner_id)
              .single();
              
            if (ownerData) {
              const ownerFullName = [
                ownerData.first_name,
                ownerData.last_name
              ].filter(Boolean).join(" ") || "Sprint Owner";
              
              // Get owner's tasks with progress
              const { data: tasks, error: tasksError } = await supabase
                .from("sprint_tasks")
                .select("*")
                .order("order_index");
                
              if (tasksError) throw tasksError;
              
              // Get owner's task progress
              const { data: progress, error: progressError } = await supabase
                .from("user_sprint_progress")
                .select("*")
                .eq("user_id", collab.sprint_owner_id);
                
              if (progressError) throw progressError;
              
              // Combine tasks with progress
              const tasksWithProgress: SharedTask[] = (tasks || []).map(task => {
                const taskProgress = progress?.find(p => p.task_id === task.id);
                return {
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  order_index: task.order_index,
                  upload_required: task.upload_required,
                  completed: taskProgress?.completed || false,
                  progress: taskProgress ? {
                    id: taskProgress.id,
                    completed: !!taskProgress.completed,
                    completed_at: taskProgress.completed_at || null,
                    answers: taskProgress.answers as Record<string, any> | null,
                    file_id: taskProgress.file_id || null
                  } : undefined
                };
              });
              
              sharedSprintsList.push({
                owner_id: collab.sprint_owner_id,
                owner_name: ownerFullName,
                owner_email: ownerData.email,
                tasks: tasksWithProgress
              });
            }
          } catch (error) {
            console.error("Error fetching shared sprint owner:", error);
          }
        }
        
        setSharedSprints(sharedSprintsList);
      } catch (error) {
        console.error("Error fetching shared sprints:", error);
        toast("Could not load shared sprints. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedSprints();
  }, [userId]);

  return { sharedSprints, isLoading };
}
