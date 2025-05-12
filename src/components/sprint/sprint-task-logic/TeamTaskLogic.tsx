
import React, { useEffect } from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useTeamTaskData } from "@/hooks/useTeamTaskData";
import { useTeamProfileInfo } from "@/hooks/useTeamProfileInfo";
import TeamStepContent from "./team/TeamStepContent";

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
  const { sprintProfile } = useSprintProfileQuickEdit();
  
  const {
    steps,
    currentStepContext,
    handleStepChange,
    handleComplete,
    loadTeamMembers,
    teamStatus,
    isIncorporated,
    uploadedFileId
  } = useTeamTaskData(task, sprintProfile);

  const { renderContextBasedProfileInfo } = useTeamProfileInfo(
    currentStepContext,
    isIncorporated,
    teamStatus
  );

  // Effect to reload team members when team status changes
  useEffect(() => {
    if (teamStatus) {
      loadTeamMembers();
    }
  }, [teamStatus, loadTeamMembers]);

  // Handle completion callback
  const handleTaskComplete = async () => {
    const success = await handleComplete();
    if (success) {
      onComplete(uploadedFileId);
    }
  };

  return (
    <div>
      {children}
      {renderContextBasedProfileInfo()}
      <TeamStepContent 
        steps={steps}
        isCompleted={isCompleted}
        onComplete={handleTaskComplete}
        onStepChange={handleStepChange}
      />
    </div>
  );
};

export default TeamTaskLogic;
