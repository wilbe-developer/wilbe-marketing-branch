
import { useSprintTasks } from "./useSprintTasks.tsx";
import { TeamMember } from './useTeamMembers';

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
      // Save to task_answers for the team task
      await updateProgress.mutateAsync({
        taskId,
        completed: true,
        fileId: uploadedFileId,
        taskAnswers: {
          team_members: teamMembers,
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
      
      return true;
    } catch (error) {
      console.error("Error saving team data:", error);
      return false;
    }
  };

  return {
    saveTeamData
  };
};
