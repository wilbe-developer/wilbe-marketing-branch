
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic from "../StepBasedTaskLogic";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamTaskState } from "@/hooks/useTeamTaskState";
import { useTeamStepBuilder } from "@/hooks/useTeamStepBuilder";
import { useTeamTaskSave } from "@/hooks/useTeamTaskSave";
import { useIsMobile } from "@/hooks/use-mobile";

interface TeamTaskLogicProps {
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  task: any;
  hideMainQuestion?: boolean;
  children?: React.ReactNode;
}

const TeamTaskLogic: React.FC<TeamTaskLogicProps> = ({ 
  isCompleted, 
  onComplete, 
  task,
  hideMainQuestion, 
  children 
}) => {
  const isMobile = useIsMobile();
  const { sprintProfile } = useSprintProfileQuickEdit();
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

  // Effect to reload team members when team status changes
  useEffect(() => {
    if (teamStatus) {
      loadTeamMembers();
    }
  }, [teamStatus, loadTeamMembers]);

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

    if (success) {
      onComplete(uploadedFileId);
    }
  };

  return (
    <div>
      {children}
      <Card className={`mb-6 ${isMobile ? 'shadow-sm' : 'mb-8'}`}>
        <CardContent className={isMobile ? "p-3 sm:p-4 md:p-6" : "p-6"}>
          <StepBasedTaskLogic
            steps={steps}
            isCompleted={isCompleted}
            onComplete={handleComplete}
            conditionalFlow={{}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamTaskLogic;
