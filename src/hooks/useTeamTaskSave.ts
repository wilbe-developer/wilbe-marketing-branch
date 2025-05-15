
import { useSprintTasks } from "./useSprintTasks.tsx";
import { TeamMember, serializeTeamMembers } from './team-members/types';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useTeamTaskSave = () => {
  const { updateProgress } = useSprintTasks();
  const { user } = useAuth();

  const saveTeamData = async (
    taskId: string,
    teamMembers: TeamMember[],
    neededSkills: string,
    uploadedFileId?: string,
    companyReasons?: string[],
    
    // Solo founder fields
    missingSkills?: string,
    skillsJustification?: string,
    hireProfile?: string,
    fullTimeTrigger?: string,
    
    // Incorporation data
    companyFormationDate?: string,
    companyFormationLocation?: string,
    plannedFormationDate?: string,
    plannedFormationLocation?: string,
    formationLocationReason?: string,
    
    // Equity data
    equityAgreed?: boolean | null,
    equitySplit?: string,
    equityConcerns?: string
  ) => {
    try {
      if (!user?.id) {
        toast.error("You must be logged in to save team information");
        return false;
      }

      // Ensure all required fields are present on team members
      const serializedTeamMembers = teamMembers.map(member => ({
        id: member.id || crypto.randomUUID(),
        name: member.name || '',
        profile_description: member.profile_description || '',
        employment_status: member.employment_status || '',
        trigger_points: member.trigger_points || ''
      }));
      
      console.log("Saving team members:", JSON.stringify(serializedTeamMembers));
      
      // Save to task_answers for the team task
      const progressResult = await updateProgress.mutateAsync({
        taskId,
        completed: true,
        fileId: uploadedFileId,
        taskAnswers: {
          team_members: serializedTeamMembers,
          needed_skills: neededSkills,
          company_reasons: companyReasons,
          
          // Solo founder fields
          missing_skills: missingSkills,
          skills_justification: skillsJustification,
          hire_profile: hireProfile,
          full_time_trigger: fullTimeTrigger,
          
          // Incorporation data
          company_formation_date: companyFormationDate,
          company_formation_location: companyFormationLocation,
          planned_formation_date: plannedFormationDate,
          planned_formation_location: plannedFormationLocation,
          formation_location_reason: formationLocationReason,
          
          // Equity data
          equity_agreed: equityAgreed,
          equity_split: equitySplit,
          equity_concerns: equityConcerns
        }
      });

      // Also save team members to the team_members table
      // First remove existing team members for this user
      const { error: deleteError } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', user.id);
      
      if (deleteError) {
        console.error("Error deleting existing team members:", deleteError);
        // Continue anyway - we'll attempt to insert the new ones
      }

      // Only insert members with non-empty names
      const validTeamMembers = serializedTeamMembers.filter(member => member.name.trim() !== '');
      
      if (validTeamMembers.length > 0) {
        // Prepare team members for database insertion
        const teamMembersToInsert = validTeamMembers.map(member => ({
          id: member.id,
          user_id: user.id,
          owner_id: user.id, // This will be the same as user_id for self-created teams
          name: member.name,
          profile_description: member.profile_description,
          employment_status: member.employment_status,
          trigger_points: member.trigger_points
        }));
        
        // Insert team members to the database
        const { error: insertError } = await supabase
          .from('team_members')
          .insert(teamMembersToInsert);
        
        if (insertError) {
          console.error("Error inserting team members:", insertError);
          toast.error("Team members saved to progress, but failed to save to database.");
          // Still return true as the progress was saved successfully
          return true;
        }
      }
      
      toast.success("Team information saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving team data:", error);
      toast.error("Failed to save team information. Please try again.");
      return false;
    }
  };

  return {
    saveTeamData
  };
};
