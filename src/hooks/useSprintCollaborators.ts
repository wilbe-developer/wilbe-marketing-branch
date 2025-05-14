
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Collaborator {
  id: string;
  sprint_owner_id: string;
  collaborator_id: string;
  access_level: string;
  created_at: string;
  created_by: string;
  email?: string; // From profiles join
  firstName?: string; // From profiles join
  lastName?: string; // From profiles join
}

export const useSprintCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchCollaborators = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // First fetch the collaborator links
      const { data: collabData, error: collabError } = await supabase
        .from("sprint_collaborators")
        .select("*")
        .eq("sprint_owner_id", user.id);

      if (collabError) throw collabError;
      
      if (!collabData || collabData.length === 0) {
        setCollaborators([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch profile details for each collaborator separately
      const collaboratorsWithProfiles = await Promise.all(
        collabData.map(async (collab) => {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("email, first_name, last_name")
            .eq("id", collab.collaborator_id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
          }

          return {
            ...collab,
            email: profileData?.email,
            firstName: profileData?.first_name,
            lastName: profileData?.last_name
          };
        })
      );
      
      setCollaborators(collaboratorsWithProfiles);
    } catch (error: any) {
      console.error("Error fetching collaborators:", error);
      toast({
        title: "Error fetching collaborators",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCollaborator = async (email: string, accessLevel: string = "edit") => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // First find the user by email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .single();

      if (userError) {
        if (userError.code === "PGRST116") {
          throw new Error("User not found. Please check the email address.");
        }
        throw userError;
      }

      if (!userData?.id) {
        throw new Error("User not found. Please check the email address.");
      }

      // Check if this user is already a collaborator
      const { data: existingCollaborator, error: existingError } = await supabase
        .from("sprint_collaborators")
        .select("id")
        .eq("sprint_owner_id", user.id)
        .eq("collaborator_id", userData.id)
        .maybeSingle();

      if (existingError && existingError.code !== "PGRST116") throw existingError;

      if (existingCollaborator) {
        throw new Error("This user is already a collaborator on your sprint.");
      }

      // Add as collaborator
      const { error: insertError } = await supabase
        .from("sprint_collaborators")
        .insert({
          sprint_owner_id: user.id,
          collaborator_id: userData.id,
          created_by: user.id,
          access_level: accessLevel
        });

      if (insertError) throw insertError;

      // Notify the user about being added as a collaborator
      try {
        // This will be a server-side notification in the future
        console.log(`Notifying user ${userData.id} that they have been added as a collaborator`);
      } catch (notifyError) {
        console.error("Failed to send notification:", notifyError);
        // Don't block the flow if notification fails
      }

      toast({
        title: "Collaborator added",
        description: "Successfully added collaborator to your sprint."
      });

      // Refresh the list
      await fetchCollaborators();
    } catch (error: any) {
      console.error("Error adding collaborator:", error);
      toast({
        title: "Error adding collaborator",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollaboratorAccess = async (collaboratorId: string, accessLevel: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sprint_collaborators")
        .update({ access_level: accessLevel })
        .eq("id", collaboratorId)
        .eq("sprint_owner_id", user.id); // Ensure owner is making this change

      if (error) throw error;

      toast({
        title: "Access level updated",
        description: "Successfully updated collaborator's access level."
      });

      // Update state with the new access level
      setCollaborators(prev => 
        prev.map(c => c.id === collaboratorId ? {...c, access_level: accessLevel} : c)
      );
    } catch (error: any) {
      console.error("Error updating access level:", error);
      toast({
        title: "Error updating access level",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sprint_collaborators")
        .delete()
        .eq("id", collaboratorId)
        .eq("sprint_owner_id", user.id); // Ensure owner is making this change

      if (error) throw error;

      toast({
        title: "Collaborator removed",
        description: "Successfully removed collaborator from your sprint."
      });

      // Update state by filtering out the removed collaborator
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    } catch (error: any) {
      console.error("Error removing collaborator:", error);
      toast({
        title: "Error removing collaborator",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    collaborators,
    isLoading,
    fetchCollaborators,
    addCollaborator,
    updateCollaboratorAccess,
    removeCollaborator
  };
};
