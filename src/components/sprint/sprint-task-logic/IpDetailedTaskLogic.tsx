
import React from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useIpTaskData } from "@/hooks/useIpTaskData";
import { Card } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants/app";
import IpStepContent from "./ip/IpStepContent";

interface IpDetailedTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  hideMainQuestion?: boolean;
}

const IpDetailedTaskLogic: React.FC<IpDetailedTaskLogicProps> = ({
  task,
  isCompleted,
  onComplete,
  hideMainQuestion = false,
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  
  // Use our IP task data hook to get all the data and functions
  const {
    steps,
    conditionalFlow,
    currentStepContext,
    handleStepChange,
    handleComplete,
    reliesOnUniIp,
    uploadedFileId,
    isLoading
  } = useIpTaskData(task);

  // Handle completion callback
  const handleTaskComplete = async () => {
    const success = await handleComplete();
    if (success) {
      onComplete(uploadedFileId);
    }
  };

  // If task is already completed, show completion message
  if (isCompleted) {
    return (
      <div className="bg-green-50 p-4 rounded-md text-green-800 space-y-2">
        <h3 className="font-medium">IP Due Diligence Completed</h3>
        <p>You've completed the IP due diligence assessment.</p>
        <Card className="p-4 mt-4 bg-white">
          <p className="text-gray-600 text-sm">
            {APP_NAME} has recorded your IP due diligence responses. This information will help you navigate
            your intellectual property strategy.
          </p>
        </Card>
      </div>
    );
  }

  // Use the IpStepContent component to render the steps
  return (
    <IpStepContent 
      steps={steps}
      conditionalFlow={conditionalFlow}
      isCompleted={isCompleted}
      onComplete={handleTaskComplete}
      onStepChange={handleStepChange}
    />
  );
};

export default IpDetailedTaskLogic;
