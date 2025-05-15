
import React from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useIPTaskData } from "@/hooks/useIPTaskData";
import { useIPProfileInfo } from "@/hooks/useIPProfileInfo";
import IPStepContent from "./ip/IPStepContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface IPTaskLogicProps {
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  task: any;
  hideMainQuestion?: boolean;
  children?: React.ReactNode;
}

const IPTaskLogic: React.FC<IPTaskLogicProps> = ({ 
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
    universityIP,
    uploadedFileId
  } = useIPTaskData(task, sprintProfile);

  const { renderContextBasedProfileInfo } = useIPProfileInfo(
    currentStepContext,
    universityIP
  );

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
      
      {universityIP === undefined && (
        <Alert className="mb-6 bg-amber-50">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Profile Information Needed</AlertTitle>
          <AlertDescription>
            Please answer the profile question above to customize your IP & Technology Transfer task experience.
          </AlertDescription>
        </Alert>
      )}
      
      <IPStepContent 
        steps={steps}
        isCompleted={isCompleted}
        onComplete={handleTaskComplete}
        onStepChange={handleStepChange}
      />
    </div>
  );
};

export default IPTaskLogic;
