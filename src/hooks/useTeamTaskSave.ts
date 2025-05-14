
import { useSprintTasks } from "./useSprintTasks.tsx";
import { TeamMember, serializeTeamMembers } from './team-members/types';
import { toast } from "sonner";

export const useTeamTaskSave = () => {
  const { updateProgress } = useSprintTasks();

  const saveTeamData = async (
    taskId: string,
    teamMembers: TeamMember[],
    neededSkills: string,
    uploadedFileId?: string,
    companyReasons?: string[],
    
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
      await updateProgress.mutateAsync({
        taskId,
        completed: true,
        fileId: uploadedFileId,
        taskAnswers: {
          team_members: serializedTeamMembers,
          needed_skills: neededSkills,
          company_reasons: companyReasons,
          
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
