
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
        // First get the task to find the owner
        const { data: taskData, error: taskError } = await supabase
          .from("sprint_tasks")
          .select("user_id")
          .eq("id", taskId)
          .single();

        if (taskError) {
          console.error("Error fetching task:", taskError);
          setIsLoading(false);
          return;
        }

        const ownerId = taskData.user_id;
        setSprintOwnerId(ownerId);

        // If this is the user's own task, it's not a shared sprint
        if (ownerId === user.id) {
          setIsSharedSprint(false);
          setIsLoading(false);
          return;
        }

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
