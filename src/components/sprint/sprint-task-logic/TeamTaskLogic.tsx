
import React, { useEffect, useState } from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useTeamTaskData } from "@/hooks/useTeamTaskData";
import { useTeamProfileInfo } from "@/hooks/useTeamProfileInfo";
import TeamStepContent from "./team/TeamStepContent";
import { CollaboratorsManagement } from "@/components/sprint/CollaboratorsManagement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

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
  const [showCollaborators, setShowCollaborators] = useState(false);
  
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

  // Determine if we should show collaboration invite
  const showCollaborationInvite = teamStatus === 'co-founders' && !isCompleted;

  return (
    <div>
      {children}
      {renderContextBasedProfileInfo()}
      
      {showCollaborationInvite && !showCollaborators && (
        <Alert className="mb-6">
          <Users className="h-4 w-4" />
          <AlertTitle>Would you like to invite your co-founders to collaborate?</AlertTitle>
          <AlertDescription>
            Your co-founders can help complete this information if you invite them to collaborate on your sprint.
            <div className="mt-3">
              <Button 
                onClick={() => setShowCollaborators(true)}
                variant="outline"
                size="sm"
              >
                Show Collaboration Options
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {showCollaborationInvite && showCollaborators && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Invite Co-Founders to Collaborate</h3>
          <CollaboratorsManagement />
        </div>
      )}
      
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
