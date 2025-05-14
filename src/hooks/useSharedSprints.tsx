
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

export interface SharedSprint {
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
}

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

        // Fetch owner profiles
        const sharedSprintsList: SharedSprint[] = [];
        
        for (const collab of collaborations) {
          try {
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
              
              sharedSprintsList.push({
                ownerId: collab.sprint_owner_id,
                ownerName: ownerFullName,
                ownerEmail: ownerData.email
              });
            }
          } catch (error) {
            console.error("Error fetching shared sprint owner:", error);
          }
        }
        
        setSharedSprints(sharedSprintsList);
      } catch (error) {
        console.error("Error fetching shared sprints:", error);
        toast({
          title: "Error",
          description: "Could not load shared sprints. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedSprints();
  }, [userId]);

  return { sharedSprints, isLoading };
}
