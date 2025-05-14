
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "../useAuth";
import { TeamMember } from './types';

export const useTeamMemberDatabase = (
  teamMembers: TeamMember[],
  setTeamMembers: (members: TeamMember[]) => void,
  initialDataLoaded: boolean,
  setInitialDataLoaded: (loaded: boolean) => void
) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Function to load team members from database - can be called manually when needed
  const loadTeamMembers = async (taskAnswers?: any) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log("Attempting to load team members from database for user:", user.id);
      
      // First try to get from task answers if available
      if (taskAnswers?.team_members && taskAnswers.team_members.length > 0) {
        console.log("Using team members from task answers:", taskAnswers.team_members);
        
        // Convert from task_answers format to our standardized format if needed
        const members = taskAnswers.team_members.map((member: any) => {
          // Check if the member is using the old format (profile, employmentStatus, triggerPoints)
          if ('profile' in member || 'employmentStatus' in member || 'triggerPoints' in member) {
            return {
              name: member.name,
              profile_description: member.profile || member.profile_description || '',
              employment_status: member.employmentStatus || member.employment_status || '',
              trigger_points: member.triggerPoints || member.trigger_points || ''
            };
          }
          // Already in the correct format
          return member;
        });
        
        setTeamMembers(members);
        setInitialDataLoaded(true);
        setLoading(false);
        return;
      }
      
      // Otherwise load from team_members table
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error loading team members:", error);
        setLoading(false);
        return;
      }
      
      if (data && data.length > 0) {
        console.log("Loaded team members from database:", data);
        
        // Transform from database format to TeamMember format
        const loadedMembers = data.map(member => ({
          name: member.name,
          profile_description: member.profile_description,
          employment_status: member.employment_status,
          trigger_points: member.trigger_points || ''
        }));
        
        setTeamMembers(loadedMembers);
        setInitialDataLoaded(true);
      } else if (!initialDataLoaded) {
        // If no team members found, and we haven't loaded any initial data yet, reset to default
        setTeamMembers([{ 
          name: '', 
          profile_description: '', 
          employment_status: '',
          trigger_points: '' 
        }]);
        setInitialDataLoaded(true);
      }
    } catch (error) {
      console.error("Error in loadTeamMembers:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveTeamMembers = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to save team information");
      return false;
    }
    
    setLoading(true);
    
    try {
      console.log("Current user ID:", user.id);
      console.log("Team members to save:", JSON.stringify(teamMembers));
      
      // Delete existing team members for this user
      const { error: deleteError } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', user.id);
        
      if (deleteError) {
        console.error('Error deleting existing team members:', deleteError);
        throw deleteError;
      }
      
      // Only insert members with non-empty names
      const membersToInsert = teamMembers.filter(member => member.name.trim() !== '');
      
      if (membersToInsert.length === 0) {
        console.log("No team members to insert");
        toast.success("Team information saved successfully!");
        setLoading(false);
        return true;
      }
      
      console.log("Inserting team members:", JSON.stringify(membersToInsert));
      
      // Insert new team members one by one to handle potential errors individually
      for (const member of membersToInsert) {
        console.log("Inserting team member:", JSON.stringify(member));
        
        const { error } = await supabase
          .from('team_members')
          .insert({
            user_id: user.id,
            name: member.name,
            profile_description: member.profile_description,
            employment_status: member.employment_status,
            trigger_points: member.trigger_points
          });

        if (error) {
          console.error('Error inserting team member:', error);
          throw error;
        }
      }

      toast.success("Team information saved successfully!");
      return true;
    } catch (error: any) {
      console.error('Error saving team members:', error);
      toast.error(`Failed to save team information: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadTeamMembers,
    saveTeamMembers
  };
};
