
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useSharedSprint = () => {
  const [isSharedSprint, setIsSharedSprint] = useState(false);
  const [sprintOwnerId, setSprintOwnerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { taskId } = useParams<{ taskId: string }>();

  useEffect(() => {
    const checkIfSharedSprint = async () => {
      if (!user?.id || !taskId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if there's any progress record for this task
        const { data: progressData, error: progressError } = await supabase
          .from("user_sprint_progress")
          .select("user_id")
          .eq("task_id", taskId)
          .single();

        if (progressError && progressError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" which is fine for new tasks
          console.error("Error checking task progress:", progressError);
          setIsLoading(false);
          return;
        }

        // If this is a new task or the user's own task, it's not a shared sprint
        if (!progressData || progressData.user_id === user.id) {
          setIsSharedSprint(false);
          setIsLoading(false);
          return;
        }

        // If we got here, there's a task owned by someone else
        const ownerId = progressData.user_id;
        setSprintOwnerId(ownerId);

        // Check if the current user is a collaborator
        const { data: collabData, error: collabError } = await supabase
          .from("sprint_collaborators")
          .select("id")
          .eq("sprint_owner_id", ownerId)
          .eq("collaborator_id", user.id)
          .single();

        if (collabError && collabError.code !== "PGRST116") {
          console.error("Error checking collaborator status:", collabError);
        }

        setIsSharedSprint(!!collabData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in shared sprint check:", error);
        setIsLoading(false);
      }
    };

    checkIfSharedSprint();
  }, [user?.id, taskId]);

  return { isSharedSprint, sprintOwnerId, isLoading };
};
