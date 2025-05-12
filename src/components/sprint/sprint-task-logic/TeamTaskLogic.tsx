
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StepBasedTaskLogic from "../StepBasedTaskLogic";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamTaskState } from "@/hooks/useTeamTaskState";
import { useTeamStepBuilder } from "@/hooks/useTeamStepBuilder";
import { useTeamTaskSave } from "@/hooks/useTeamTaskSave";
import { useIsMobile } from "@/hooks/use-mobile";
import { SprintProfileShowOrAsk } from "../SprintProfileShowOrAsk";

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
    neededSkills,
    setNeededSkills,
    uploadedFileId,
    setUploadedFileId,
    hiringPlanStep,
    setHiringPlanStep,
    teamStatus,
    isIncorporated,
    companyReasons,
    setCompanyReasons,
    equitySplit,
    setEquitySplit,
    equityRationale,
    setEquityRationale,
    vestingSchedule,
    setVestingSchedule,
    vestingDetails,
    setVestingDetails,
    equityFormalAgreement,
    setEquityFormalAgreement
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
    equitySplit,
    equityRationale,
    vestingSchedule,
    vestingDetails,
    equityFormalAgreement,
    onTeamMemberAdd: addTeamMember,
    onTeamMemberRemove: removeTeamMember,
    onTeamMemberUpdate: updateTeamMember,
    onSkillsChange: setNeededSkills,
    onFileUpload: setUploadedFileId,
    onHiringPlanStepChange: setHiringPlanStep,
    onCompanyReasonsChange: setCompanyReasons,
    onEquitySplitChange: setEquitySplit,
    onEquityRationaleChange: setEquityRationale,
    onVestingScheduleChange: setVestingSchedule,
    onVestingDetailsChange: setVestingDetails,
    onEquityFormalAgreementChange: setEquityFormalAgreement
  });

  const handleComplete = async () => {
    // Always save team data to both tables
    const success = await saveTeamData(
      task.id,
      teamMembers,
      neededSkills,
      uploadedFileId,
      companyReasons,
      equitySplit,
      equityRationale,
      vestingSchedule,
      vestingDetails,
      equityFormalAgreement
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
          {/* Display incorporation status info at the relevant step */}
          {isIncorporated !== undefined && (
            <SprintProfileShowOrAsk 
              profileKey="company_incorporated" 
              label="Is your company incorporated?"
              displayStyle="you-chose"
              type="boolean"
            >
              {/* This will display at the proper time in the flow */}
              <div className="mb-4"></div>
            </SprintProfileShowOrAsk>
          )}
          
          {/* Display team status info at the relevant step */}
          {teamStatus && (
            <SprintProfileShowOrAsk 
              profileKey="team_status" 
              label="Team status"
              displayStyle="you-chose"
              type="select"
              options={[
                { value: "solo", label: "I'm solo" },
                { value: "employees", label: "I have a team but they're employees" },
                { value: "cofounders", label: "I have co-founders" }
              ]}
            >
              {/* This will display at the proper time in the flow */}
              <div className="mb-4"></div>
            </SprintProfileShowOrAsk>
          )}
          
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
