
import { useState, useEffect } from "react";
import { useTeamMembers } from "./useTeamMembers";
import { TeamMember } from "./team-members/types";
import { useTeamTaskState } from "./useTeamTaskState";
import { useTeamStepBuilder, StepContext } from "./useTeamStepBuilder";
import { useTeamTaskSave } from "./useTeamTaskSave";
import { toast } from "sonner";

export const useTeamTaskData = (task: any, sprintProfile: any) => {
  const { 
    teamMembers, 
    addTeamMember, 
    removeTeamMember, 
    updateTeamMember,
    saveTeamMembers, 
    loadTeamMembers
  } = useTeamMembers(task?.progress?.task_answers);

  const {
    // Original states
    neededSkills,
    setNeededSkills,
    uploadedFileId,
    setUploadedFileId,
    hiringPlanStep,
    setHiringPlanStep,
    teamStatus,
    isIncorporated,
    
    // Company reasons
    companyReasons,
    setCompanyReasons,
    
    // Incorporation data
    companyFormationDate,
    setCompanyFormationDate,
    companyFormationLocation,
    setCompanyFormationLocation,
    plannedFormationDate,
    setPlannedFormationDate,
    plannedFormationLocation,
    setPlannedFormationLocation,
    formationLocationReason,
    setFormationLocationReason,
    
    // Equity data
    equityAgreed,
    setEquityAgreed,
    equitySplit,
    setEquitySplit,
    equityConcerns,
    setEquityConcerns,
  } = useTeamTaskState(task, sprintProfile);

  const { saveTeamData } = useTeamTaskSave();
  const [currentStepContext, setCurrentStepContext] = useState<StepContext | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load team members when component initializes or task data changes
  useEffect(() => {
    loadTeamMembers();
  }, [task, loadTeamMembers]);

  const steps = useTeamStepBuilder({
    teamStatus,
    isIncorporated,
    teamMembers,
    neededSkills,
    uploadedFileId,
    hiringPlanStep,
    companyReasons,
    
    // Incorporation data
    companyFormationDate,
    companyFormationLocation,
    plannedFormationDate,
    plannedFormationLocation,
    formationLocationReason,
    
    // Equity data
    equityAgreed,
    equitySplit,
    equityConcerns,
    
    // Handlers
    onTeamMemberAdd: () => {
      addTeamMember({ 
        name: '', 
        profile_description: '', 
        employment_status: '',
        trigger_points: '' 
      });
    },
    onTeamMemberRemove: (index: number) => {
      const member = teamMembers[index];
      if (member && member.id) {
        removeTeamMember(member.id);
      }
    },
    onTeamMemberUpdate: (index: number, field: keyof TeamMember, value: string) => {
      const member = teamMembers[index];
      if (member && member.id) {
        updateTeamMember(member.id, { [field]: value });
      }
    },
    onSkillsChange: setNeededSkills,
    onFileUpload: setUploadedFileId,
    onHiringPlanStepChange: setHiringPlanStep,
    onCompanyReasonsChange: setCompanyReasons,
    
    // Incorporation data handlers
    onCompanyFormationDateChange: setCompanyFormationDate,
    onCompanyFormationLocationChange: setCompanyFormationLocation,
    onPlannedFormationDateChange: setPlannedFormationDate,
    onPlannedFormationLocationChange: setPlannedFormationLocation,
    onFormationLocationReasonChange: setFormationLocationReason,
    
    // Equity data handlers
    onEquityAgreedChange: setEquityAgreed,
    onEquitySplitChange: setEquitySplit,
    onEquityConcernsChange: setEquityConcerns,
  });

  const handleStepChange = (stepIndex: number, context?: StepContext) => {
    setCurrentStepContext(context);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Always save team data to both tables
      console.log("Attempting to save team data with members:", JSON.stringify(teamMembers));
      
      // Validate team members data
      const hasInvalidTeamMembers = teamMembers.some(
        member => !member.name || !member.profile_description || !member.employment_status
      );
      
      if (hasInvalidTeamMembers && teamStatus !== 'solo') {
        toast.error("Please complete all required team member fields");
        setIsLoading(false);
        return false;
      }
      
      const success = await saveTeamData(
        task.id,
        teamMembers,
        neededSkills,
        uploadedFileId,
        companyReasons,
        
        // Incorporation data
        companyFormationDate,
        companyFormationLocation,
        plannedFormationDate,
        plannedFormationLocation,
        formationLocationReason,
        
        // Equity data
        equityAgreed,
        equitySplit,
        equityConcerns
      );

      return success;
    } catch (error) {
      console.error("Error in handleComplete:", error);
      toast.error("Failed to save your progress");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    steps,
    currentStepContext,
    handleStepChange,
    handleComplete,
    loadTeamMembers,
    teamStatus,
    isIncorporated,
    uploadedFileId,
    isLoading
  };
};
