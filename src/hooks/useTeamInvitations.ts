
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSprintContext } from "@/hooks/useSprintContext";
import { supabase } from "@/integrations/supabase/client";
import { toast as showToast } from "@/hooks/use-toast";

export interface PendingInvitation {
  id: string;
  email: string;
  sprint_owner_id: string;
  access_level: 'view' | 'edit' | 'manage';
  invitation_token: string;
  invited_by: string;
  expires_at: string;
  accepted_at: string | null;
  accepted_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useTeamInvitations = () => {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { currentSprintOwnerId } = useSprintContext();

  const sprintOwnerId = currentSprintOwnerId || user?.id;

  const fetchInvitations = async () => {
    if (!sprintOwnerId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("pending_team_invitations")
        .select("*")
        .eq("sprint_owner_id", sprintOwnerId)
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setInvitations(data || []);
    } catch (error: any) {
      console.error("Error fetching invitations:", error);
      showToast({
        title: "Error fetching invitations",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendInvitation = async (email: string, accessLevel: 'view' | 'edit' | 'manage' = 'edit') => {
    if (!sprintOwnerId || !user?.id) return;
    
    setIsLoading(true);
    try {
      // Generate unique invitation token
      const invitationToken = crypto.randomUUID();
      
      // Check if invitation already exists for this email and sprint
      const { data: existingInvitation, error: existingError } = await supabase
        .from("pending_team_invitations")
        .select("id")
        .eq("sprint_owner_id", sprintOwnerId)
        .eq("email", email.trim().toLowerCase())
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (existingError && existingError.code !== "PGRST116") throw existingError;

      if (existingInvitation) {
        throw new Error("An invitation is already pending for this email address.");
      }

      // Check if user is already a collaborator
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (userError && userError.code !== "PGRST116") throw userError;

      if (userData?.id) {
        const { data: existingCollaborator, error: collabError } = await supabase
          .from("sprint_collaborators")
          .select("id")
          .eq("sprint_owner_id", sprintOwnerId)
          .eq("collaborator_id", userData.id)
          .maybeSingle();

        if (collabError && collabError.code !== "PGRST116") throw collabError;

        if (existingCollaborator) {
          throw new Error("This user is already a team member on your BSF.");
        }
      }

      // Create the invitation
      const { error: insertError } = await supabase
        .from("pending_team_invitations")
        .insert({
          email: email.trim().toLowerCase(),
          sprint_owner_id: sprintOwnerId,
          access_level: accessLevel,
          invitation_token: invitationToken,
          invited_by: user.id
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

      // Send email invitation
      try {
        await fetch('/api/send-team-access-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberName: email.split('@')[0], // Use email prefix as fallback name
            memberEmail: email,
            ownerName,
            accessLevel: accessLevel === 'view' ? 'View Only' : accessLevel === 'edit' ? 'Can Edit' : 'Can Manage',
            invitationToken,
            isInvitation: true
          }),
        });
      } catch (emailError) {
        console.error("Error sending email invitation:", emailError);
        // Don't throw error here - invitation was created successfully
      }

      showToast({
        title: "Invitation sent",
        description: "Successfully sent team invitation."
      });

      // Refresh the list
      await fetchInvitations();
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      showToast({
        title: "Error sending invitation",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    setIsLoading(true);
    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) throw new Error("Invitation not found");

      // Get owner name for email notification
      const { data: ownerData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", invitation.sprint_owner_id)
        .single();

      const ownerName = ownerData 
        ? `${ownerData.first_name || ''} ${ownerData.last_name || ''}`.trim() || 'BSF Owner'
        : 'BSF Owner';

      // Resend email invitation
      await fetch('/api/send-team-access-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: invitation.email.split('@')[0],
          memberEmail: invitation.email,
          ownerName,
          accessLevel: invitation.access_level === 'view' ? 'View Only' : invitation.access_level === 'edit' ? 'Can Edit' : 'Can Manage',
          invitationToken: invitation.invitation_token,
          isInvitation: true
        }),
      });

      showToast({
        title: "Invitation resent",
        description: "Successfully resent team invitation."
      });
    } catch (error: any) {
      console.error("Error resending invitation:", error);
      showToast({
        title: "Error resending invitation",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("pending_team_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;

      showToast({
        title: "Invitation cancelled",
        description: "Successfully cancelled team invitation."
      });

      // Update state by filtering out the cancelled invitation
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error: any) {
      console.error("Error cancelling invitation:", error);
      showToast({
        title: "Error cancelling invitation",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invitations,
    isLoading,
    fetchInvitations,
    sendInvitation,
    resendInvitation,
    cancelInvitation
  };
};
