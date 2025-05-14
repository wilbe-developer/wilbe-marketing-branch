
import { useState } from "react";
import { useTeamMembers, TeamMember } from "./useTeamMembers";
import { useTeamTaskState } from "./useTeamTaskState";
import { useTeamStepBuilder, StepContext } from "./useTeamStepBuilder";
import { useTeamTaskSave } from "./useTeamTaskSave";

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
    onTeamMemberAdd: addTeamMember,
    onTeamMemberRemove: removeTeamMember,
    onTeamMemberUpdate: updateTeamMember,
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
    // Always save team data to both tables
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
  };

  return {
    steps,
    currentStepContext,
    handleStepChange,
    handleComplete,
    loadTeamMembers,
    teamStatus,
    isIncorporated,
    uploadedFileId
  };
};
