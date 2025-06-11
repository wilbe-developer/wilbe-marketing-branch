
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSprintContext } from "@/hooks/useSprintContext";
import { supabase } from "@/integrations/supabase/client";
import { toast as showToast } from "@/hooks/use-toast";

export interface Collaborator {
  id: string;
  sprint_owner_id: string;
  collaborator_id: string;
  access_level: AccessLevel;
  created_at: string;
  created_by: string;
  email?: string; // From profiles join
  firstName?: string; // From profiles join
  lastName?: string; // From profiles join
}

export type AccessLevel = 'view' | 'edit' | 'manage';

// Helper function to validate if a string is a valid AccessLevel
const isValidAccessLevel = (level: string): level is AccessLevel => {
  return ['view', 'edit', 'manage'].includes(level);
};

export const useSprintCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { currentSprintOwnerId } = useSprintContext();

  // Use currentSprintOwnerId instead of user.id for all operations
  const sprintOwnerId = currentSprintOwnerId || user?.id;

  const fetchCollaborators = async () => {
    if (!sprintOwnerId) return;
    
    setIsLoading(true);
    try {
      // First fetch the collaborator links
      const { data: collabData, error: collabError } = await supabase
        .from("sprint_collaborators")
        .select("*")
        .eq("sprint_owner_id", sprintOwnerId);

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

          // Ensure access_level is a valid AccessLevel type
          let accessLevel: AccessLevel = 'edit'; // Default fallback
          if (isValidAccessLevel(collab.access_level)) {
            accessLevel = collab.access_level;
          }

          return {
            ...collab,
            access_level: accessLevel,
            email: profileData?.email,
            firstName: profileData?.first_name,
            lastName: profileData?.last_name
          } as Collaborator;
        })
      );
      
      setCollaborators(collaboratorsWithProfiles);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      showToast({
        title: "Error fetching team members",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCollaborator = async (email: string, accessLevel: AccessLevel = 'edit') => {
    if (!sprintOwnerId) return;
    
    setIsLoading(true);
    try {
      // First find the user by email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
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
        .eq("sprint_owner_id", sprintOwnerId)
        .eq("collaborator_id", userData.id)
        .maybeSingle();

      if (existingError && existingError.code !== "PGRST116") throw existingError;

      if (existingCollaborator) {
        throw new Error("This user is already a team member on your BSF.");
      }

      // Add as collaborator - always use sprintOwnerId as created_by to maintain ownership
      const { error: insertError } = await supabase
        .from("sprint_collaborators")
        .insert({
          sprint_owner_id: sprintOwnerId,
          collaborator_id: userData.id,
          created_by: sprintOwnerId, // Always use the sprint owner ID, not the current user
          access_level: accessLevel
        });

      if (insertError) throw insertError;

      // Get owner name for email notification
      const { data: ownerData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", sprintOwnerId)
        .single();

      const ownerName = ownerData 
        ? `${ownerData.first_name || ''} ${ownerData.last_name || ''}`.trim() || 'BSF Owner'
        : 'BSF Owner';

      const memberName = userData 
        ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Team Member'
        : 'Team Member';

      // Send email notification (don't await to avoid blocking UI)
      try {
        await fetch('/api/send-team-access-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberName,
            memberEmail: email,
            ownerName,
            accessLevel: accessLevel === 'view' ? 'View Only' : accessLevel === 'edit' ? 'Can Edit' : 'Can Manage'
          }),
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't throw error here - team addition was successful
      }

      showToast({
        title: "Member access added",
        description: "Successfully added team member to your BSF."
      });

      // Refresh the list
      await fetchCollaborators();
    } catch (error: any) {
      console.error("Error adding member:", error);
      showToast({
        title: "Error adding member",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollaboratorAccess = async (collaboratorId: string, accessLevel: AccessLevel) => {
    if (!sprintOwnerId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sprint_collaborators")
        .update({ access_level: accessLevel })
        .eq("id", collaboratorId)
        .eq("sprint_owner_id", sprintOwnerId); // Ensure we're updating the right sprint

      if (error) throw error;

      showToast({
        title: "Access level updated",
        description: "Successfully updated team member access level."
      });

      // Update state by updating the changed collaborator
      setCollaborators(prev => 
        prev.map(c => c.id === collaboratorId 
          ? { ...c, access_level: accessLevel } 
          : c
        )
      );
    } catch (error: any) {
      console.error("Error updating team access:", error);
      showToast({
        title: "Error updating access",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    if (!sprintOwnerId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sprint_collaborators")
        .delete()
        .eq("id", collaboratorId)
        .eq("sprint_owner_id", sprintOwnerId); // Ensure we're deleting from the right sprint

      if (error) throw error;

      showToast({
        title: "Access removed",
        description: "Successfully removed team member access from your BSF."
      });

      // Update state by filtering out the removed collaborator
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    } catch (error: any) {
      console.error("Error removing member:", error);
      showToast({
        title: "Error removing member",
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
